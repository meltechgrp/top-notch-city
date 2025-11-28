import React, {
  useRef,
  useState,
  useContext,
  createContext,
  ReactNode,
} from "react";
import {
  Modal,
  Pressable,
  Image,
  StyleSheet,
  View as RNView,
  Dimensions,
  Platform,
  findNodeHandle,
  UIManager,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

type OriginLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

type ViewerState = {
  visible: boolean;
  images: string[];
  index: number;
  originLayout: OriginLayout;
};

const ImageViewerContext = createContext<{
  open: (
    images: string[] | string,
    index?: number,
    layout?: OriginLayout
  ) => void;
  close: () => void;
} | null>(null);

export const ImageViewerProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ViewerState>({
    visible: false,
    images: [],
    index: 0,
    originLayout: null,
  });

  const open = (
    images: string[] | string,
    index = 0,
    layout: OriginLayout = null
  ) => {
    setState({
      visible: true,
      images: Array.isArray(images) ? images : [images],
      index,
      originLayout: layout,
    });
  };

  const close = () =>
    setState((s) => ({
      ...s,
      visible: false,
    }));

  return (
    <ImageViewerContext.Provider value={{ open, close }}>
      {children}
      <ProfileImageViewer
        visible={state.visible}
        images={state.images}
        index={state.index}
        originLayout={state.originLayout}
        onClose={close}
      />
    </ImageViewerContext.Provider>
  );
};

export const useProfileImageViewer = () => {
  const ctx = useContext(ImageViewerContext);
  if (!ctx)
    throw new Error(
      "useProfileImageViewer must be used within ImageViewerProvider"
    );
  return ctx;
};

export const ProfileImageTrigger = ({
  image,
  index = 0,
  children,
  style,
}: {
  image: string;
  index?: number;
  children: React.ReactNode;
  style?: any;
}) => {
  const ref = useRef<any>(null);
  const ctx = useProfileImageViewer();

  const measure = (cb: (l: OriginLayout) => void) => {
    const node = findNodeHandle(ref.current);
    if (!node) return cb(null);
    if (Platform.OS === "android") {
      UIManager.measure(node, (_x, _y, width, height, pageX, pageY) => {
        cb({ x: pageX, y: pageY, width, height });
      });
    } else {
      // iOS and most RN versions support measureInWindow on the ref
      // @ts-ignore
      ref.current?.measureInWindow?.(
        (pageX: number, pageY: number, width: number, height: number) => {
          cb({ x: pageX, y: pageY, width, height });
        }
      ) || cb(null);
    }
  };

  return (
    <Pressable
      ref={ref}
      onPress={() =>
        measure((layout) => {
          ctx.open(image, index, layout);
        })
      }
      style={style}
    >
      {children}
    </Pressable>
  );
};

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

const ProfileImageViewer = ({
  visible,
  images,
  index: initialIndex,
  originLayout,
  onClose,
}: {
  visible: boolean;
  images: string[];
  index: number;
  originLayout: OriginLayout;
  onClose: () => void;
}) => {
  const [index, setIndex] = useState(initialIndex || 0);
  const progress = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleGesture = useSharedValue(1);
  const backdropOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      progress.value = 0;
      translateY.value = 0;
      scaleGesture.value = 1;
      backdropOpacity.value = 0;
      progress.value = withTiming(1, { duration: 260 });
      backdropOpacity.value = withTiming(1, { duration: 260 });
      setIndex(initialIndex || 0);
    }
  }, [visible, initialIndex]);

  const pan = Gesture.Pan()
    .onChange((e) => {
      translateY.value = e.translationY;
      const t = clamp(1 - Math.abs(e.translationY) / (SCREEN_H * 0.8), 0.4, 1);
      scaleGesture.value = t;
      backdropOpacity.value = clamp(
        1 - Math.abs(e.translationY) / (SCREEN_H * 0.6),
        0,
        1
      );
    })
    .onEnd(() => {
      if (Math.abs(translateY.value) > 140) {
        backdropOpacity.value = withTiming(0, { duration: 180 });
        progress.value = withTiming(0, { duration: 180 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0);
        scaleGesture.value = withSpring(1);
        backdropOpacity.value = withTiming(1, { duration: 160 });
      }
    });

  const tap = Gesture.Tap().onEnd(() => {
    backdropOpacity.value = withTiming(0, { duration: 180 });
    progress.value = withTiming(0, { duration: 180 }, () => runOnJS(onClose)());
  });

  const gesture = Gesture.Race(pan, tap);

  const animatedStyle = useAnimatedStyle(() => {
    const startX = originLayout?.x ?? SCREEN_W / 2;
    const startY = originLayout?.y ?? SCREEN_H / 2;
    const startW = originLayout?.width ?? 100;
    const startH = originLayout?.height ?? 100;

    const finalW = SCREEN_W;
    const finalH = SCREEN_H;
    const left = interpolate(
      progress.value,
      [0, 1],
      [startX, 0],
      Extrapolate.CLAMP
    );
    const top = interpolate(
      progress.value,
      [0, 1],
      [startY, 0],
      Extrapolate.CLAMP
    );
    const width = interpolate(
      progress.value,
      [0, 1],
      [startW, finalW],
      Extrapolate.CLAMP
    );
    const height = interpolate(
      progress.value,
      [0, 1],
      [startH, finalH],
      Extrapolate.CLAMP
    );
    const opacity = backdropOpacity.value;

    return {
      position: "absolute",
      top,
      left,
      width,
      height,
      transform: [
        { translateY: translateY.value },
        { scale: scaleGesture.value },
      ],
      opacity: 1,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.9)",
      opacity: backdropOpacity.value,
    };
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <GestureDetector gesture={gesture}>
        <RNView style={styles.container} pointerEvents="box-none">
          <Animated.View style={backdropStyle} />
          <Animated.Image
            source={{ uri: images[index] }}
            style={[styles.animatedImage, animatedStyle]}
            resizeMode="cover"
          />
          <RNView style={styles.topBar}>
            <Pressable
              onPress={() => {
                backdropOpacity.value = withTiming(0, { duration: 160 });
                progress.value = withTiming(0, { duration: 160 }, () =>
                  onClose()
                );
              }}
              style={styles.iconBtn}
            >
              <Ionicons name="close" size={26} color="#fff" />
            </Pressable>
            <RNView style={styles.spacer} />
            {images.length > 1 && (
              <RNView style={styles.controls}>
                <Pressable
                  onPress={() => setIndex((i) => Math.max(0, i - 1))}
                  style={styles.iconBtn}
                >
                  <Ionicons name="chevron-back" size={26} color="#fff" />
                </Pressable>
                <Pressable
                  onPress={() =>
                    setIndex((i) => Math.min(images.length - 1, i + 1))
                  }
                  style={styles.iconBtn}
                >
                  <Ionicons name="chevron-forward" size={26} color="#fff" />
                </Pressable>
              </RNView>
            )}
          </RNView>
          <RNView pointerEvents="box-none" style={styles.bottomStrip}>
            <RNView style={styles.thumbnailRow}>
              {images.map((uri, i) => (
                <Pressable
                  key={i}
                  onPress={() => setIndex(i)}
                  style={[
                    styles.thumbWrap,
                    i === index
                      ? { borderColor: "#fff" }
                      : { borderColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <Image
                    source={{ uri }}
                    style={styles.thumb}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </RNView>
          </RNView>
        </RNView>
      </GestureDetector>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedImage: {
    position: "absolute",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 44 : 20,
    left: 12,
    right: 12,
    zIndex: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  spacer: { flex: 1 },
  controls: {
    flexDirection: "row",
    gap: 8,
  },
  bottomStrip: {
    position: "absolute",
    bottom: 30,
    left: 12,
    right: 12,
    zIndex: 40,
    alignItems: "center",
  },
  thumbnailRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbWrap: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    marginHorizontal: 6,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
});

export default ProfileImageViewer;
