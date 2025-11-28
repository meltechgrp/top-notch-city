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
  StyleSheet,
  View as RNView,
  Dimensions,
  Platform,
  findNodeHandle,
  UIManager,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  clamp,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "@/components/ui";
import { scheduleOnRN } from "react-native-worklets";
import { Colors } from "@/constants/Colors";
import { generateMediaUrlSingle } from "@/lib/api";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

type OriginLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

type ViewerState = {
  visible: boolean;
  images: Media[];
  index: number;
  originLayout: OriginLayout;
};

const ImageViewerContext = createContext<{
  open: (images: Media[] | [], index?: number, layout?: OriginLayout) => void;
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
    images: Media[] | [],
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
  image: Media;
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
        requestAnimationFrame(() => {
          if (!image?.url) return;
          measure((layout) => ctx.open([image], index, layout));
        })
      }
      style={style}
    >
      {children}
    </Pressable>
  );
};

const ProfileImageViewer = ({
  visible,
  images,
  index: initialIndex,
  originLayout,
  onClose,
}: {
  visible: boolean;
  images: Media[];
  index: number;
  originLayout: OriginLayout;
  onClose: () => void;
}) => {
  const [index, setIndex] = useState(initialIndex || 0);
  const progress = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scaleGesture = useSharedValue(1);
  const radius = useSharedValue(0);
  const zoom = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const SWIPE_THRESHOLD = 80;
  const CLOSE_THRESHOLD = 140;

  React.useEffect(() => {
    if (visible && images && images.length > 0) {
      progress.value = 0;
      translateY.value = 0;
      scaleGesture.value = 1;
      backdropOpacity.value = 0;
      radius.value = 0;
      offsetX.value = 0;
      offsetY.value = 0;
      progress.value = withTiming(1, { duration: 100 });
      backdropOpacity.value = withTiming(1, { duration: 100 });
      const safeIndex = Math.max(
        0,
        Math.min(initialIndex || 0, images.length - 1)
      );
      setIndex(safeIndex);
    }
  }, [visible, initialIndex, images.length]);

  const closeViewer = () => {
    backdropOpacity.value = withTiming(0, { duration: 180 });
    progress.value = withTiming(0, { duration: 180 }, () => {
      scheduleOnRN(onClose);
    });
  };
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (zoom.value > 1) {
        zoom.value = withTiming(1);
        offsetX.value = withTiming(0);
        offsetY.value = withTiming(0);
      } else {
        zoom.value = withTiming(2.5);
      }
    });
  const pan = Gesture.Pan()
    .onChange((e) => {
      if (zoom.value > 1) {
        offsetX.value = e.translationX;
        offsetY.value = e.translationY;
        return;
      }
      const absX = Math.abs(e.translationX);
      const absY = Math.abs(e.translationY);

      if (absY > absX) {
        translateY.value = e.translationY;
        translateX.value = 0;

        const drag = absY / SCREEN_H;
        scaleGesture.value = clamp(1 - drag, 0.15, 1);

        const circleBase = SCREEN_W * 0.5;
        radius.value = interpolate(
          scaleGesture.value,
          [1, 0],
          [0, circleBase],
          Extrapolation.CLAMP
        );

        backdropOpacity.value = clamp(1 - drag * 1.2, 0, 1);
      } else {
        translateX.value = e.translationX;
        translateY.value = 0;
      }
    })
    .onEnd(() => {
      if (zoom.value > 1) {
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
        return;
      }

      if (translateX.value < -SWIPE_THRESHOLD) {
        if (index < images.length - 1) {
          scheduleOnRN(setIndex, index + 1);
        }
      }
      if (translateX.value > SWIPE_THRESHOLD) {
        if (index > 0) {
          scheduleOnRN(setIndex, index - 1);
        }
      }
      if (Math.abs(translateY.value) > CLOSE_THRESHOLD) {
        scheduleOnRN(closeViewer);
        return;
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      radius.value = withSpring(0);
      scaleGesture.value = withSpring(1);
      backdropOpacity.value = withTiming(1, { duration: 100 });
    });
  const gesture = Gesture.Simultaneous(pan, doubleTap);

  const animatedStyle = useAnimatedStyle(() => {
    const startX = originLayout?.x ?? SCREEN_W / 2;
    const startY = originLayout?.y ?? SCREEN_H / 2;
    const startW = originLayout?.width ?? 120;
    const startH = originLayout?.height ?? 120;

    const finalW = SCREEN_W;
    const finalH = SCREEN_H;

    const leftBase = interpolate(progress.value, [0, 1], [startX, 0]);
    const topBase = interpolate(progress.value, [0, 1], [startY, 0]);
    const baseWidth = interpolate(progress.value, [0, 1], [startW, finalW]);
    const baseHeight = interpolate(progress.value, [0, 1], [startH, finalH]);

    const shrinkFactor = scaleGesture.value;
    const width = baseWidth * shrinkFactor;
    const height = baseHeight * shrinkFactor;

    const left = leftBase + (baseWidth - width) / 2;
    const top = topBase + (baseHeight - height) / 2;
    return {
      position: "absolute",
      top,
      left,
      width,
      height,
      borderRadius: radius.value,
      transform:
        zoom.value > 1
          ? [
              { translateX: offsetX.value },
              { translateY: offsetY.value },
              { scale: zoom.value },
            ]
          : [
              { translateX: translateX.value },
              { translateY: translateY.value },
            ],
      opacity: backdropOpacity.value,
    };
  });

  React.useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 10 });
  }, [index]);
  const backdropStyle = useAnimatedStyle(() => {
    return {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.9)",
      opacity: backdropOpacity.value,
    };
  });

  if (!visible || !images || images.length === 0) return null;

  const currentImage = images[index];
  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <GestureDetector gesture={gesture}>
        <Animated.View style={{ flex: 1 }}>
          <Animated.View style={backdropStyle} pointerEvents="none" />

          <Animated.View style={[styles.animatedImage, animatedStyle]}>
            <SafeAreaView className="flex-1 py-16" edges={["bottom", "top"]}>
              <Image
                source={{
                  uri: generateMediaUrlSingle(currentImage.url),
                  cacheKey: currentImage.id,
                }}
                contentFit="contain"
              />
            </SafeAreaView>
          </Animated.View>

          <RNView style={styles.topBar} pointerEvents="box-none">
            <Pressable
              onPress={() => {
                backdropOpacity.value = withTiming(0, { duration: 150 });
                progress.value = withTiming(0, { duration: 150 }, () =>
                  scheduleOnRN(onClose)
                );
              }}
              style={styles.iconBtn}
            >
              <Ionicons name="close" size={26} color="#fff" />
            </Pressable>

            <RNView style={{ flex: 1 }} />

            {images.length > 1 && (
              <RNView style={styles.controls}>
                <Pressable
                  onPress={() => setIndex((i) => Math.max(0, i - 1))}
                  style={styles.iconBtn}
                  disabled={index === 0}
                >
                  <Ionicons name="chevron-back" size={26} color="#fff" />
                </Pressable>

                <Pressable
                  onPress={() =>
                    setIndex((i) => Math.min(images.length - 1, i + 1))
                  }
                  style={styles.iconBtn}
                  disabled={index === images.length - 1}
                >
                  <Ionicons name="chevron-forward" size={26} color="#fff" />
                </Pressable>
              </RNView>
            )}
          </RNView>

          {images.length > 1 && (
            <RNView style={styles.bottomStrip} pointerEvents="box-none">
              <ScrollView
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                centerContent
                horizontal
                className="gap-4"
              >
                {images.map((img, i) => (
                  <Pressable
                    key={i}
                    onPress={() => setIndex(i)}
                    style={[
                      styles.thumbWrap,
                      i === index
                        ? { borderColor: Colors.primary }
                        : { borderColor: "rgba(255,255,255,0.2)" },
                    ]}
                  >
                    <Image
                      source={{
                        uri: generateMediaUrlSingle(img.url),
                        cacheKey: img.id,
                      }}
                      style={styles.thumb}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </RNView>
          )}
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullscreenWrapper: {
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
    top: Platform.OS === "ios" ? 45 : 20,
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
    gap: 12,
  },
  bottomStrip: {
    position: "absolute",
    bottom: 24,
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
