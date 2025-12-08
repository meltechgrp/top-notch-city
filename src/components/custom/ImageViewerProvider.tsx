import React, {
  useRef,
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
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
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Icon, Image, View } from "@/components/ui";
import { scheduleOnRN } from "react-native-worklets";
import { Colors } from "@/constants/Colors";
import { generateMediaUrlSingle } from "@/lib/api";
import PagerView from "react-native-pager-view";
import { MiniVideoPlayer } from "@/components/custom/MiniVideoPlayer";
import { X } from "lucide-react-native";

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
  className,
}: {
  image: Media[];
  index?: number;
  children: React.ReactNode;
  style?: any;
  className?: string;
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
          if (!image?.length) return;
          measure((layout) => ctx.open(image, index, layout));
        })
      }
      style={style}
      className={className}
    >
      {children}
    </Pressable>
  );
};

type Media = {
  id: string;
  url: string;
  media_type?: "IMAGE" | "VIDEO" | "AUDIO";
};

const CLOSE_THRESHOLD = 140;

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
  if (Platform.OS === "android") {
    if (!visible) return null;

    return (
      <Modal visible={visible} transparent statusBarTranslucent>
        <View style={styles.androidContainer}>
          {/* Top Close Button */}
          <Pressable style={styles.androidCloseBtn} onPress={onClose}>
            <X size={24} color="#fff" />
          </Pressable>

          {/* Simple Scroll View */}
          <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: SCREEN_W * index, y: 0 }}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_W
              );
              setIndex(newIndex);
            }}
          >
            {images.map((item, i) => (
              <View
                key={i}
                style={{
                  width: SCREEN_W,
                  height: SCREEN_H,
                  backgroundColor: "black",
                  justifyContent: "center",
                }}
              >
                {item.media_type === "VIDEO" ? (
                  <MiniVideoPlayer
                    canPlay={i === index}
                    uri={generateMediaUrlSingle(item.url)}
                    autoPlay
                  />
                ) : (
                  <Image
                    source={{ uri: generateMediaUrlSingle(item.url) }}
                    style={{ width: SCREEN_W, height: SCREEN_H }}
                    contentFit="contain"
                  />
                )}
              </View>
            ))}
          </ScrollView>

          {/* Bottom Thumbnail Strip */}
          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.androidThumbScroll}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            >
              {images.map((item, i) => (
                <Pressable
                  key={item.id}
                  onPress={() => setIndex(i)}
                  style={[
                    styles.thumbWrap,
                    i === index
                      ? { borderColor: "#fff" }
                      : { borderColor: "rgba(255,255,255,0.3)" },
                  ]}
                >
                  {item.media_type === "VIDEO" ? (
                    <MiniVideoPlayer
                      showPlayBtn
                      canPlay={false}
                      showLoading={false}
                      uri={generateMediaUrlSingle(item.url)}
                    />
                  ) : (
                    <Image
                      source={{ uri: generateMediaUrlSingle(item.url) }}
                      style={styles.thumb}
                    />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    );
  }
  const progress = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleGesture = useSharedValue(1);
  const radius = useSharedValue(0);
  const zoom = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible && images && images.length > 0) {
      progress.value = 0;
      translateY.value = 0;
      scaleGesture.value = 1;
      backdropOpacity.value = 0;
      radius.value = 0;
      offsetX.value = 0;
      offsetY.value = 0;
      progress.value = withTiming(1, { duration: 140 });
      backdropOpacity.value = withTiming(1, { duration: 140 });
      const safeIndex = Math.max(
        0,
        Math.min(initialIndex || 0, images.length - 1)
      );
      setIndex(safeIndex);
    }
  }, [visible, initialIndex, images.length]);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (zoom.value > 1) {
        zoom.value = withTiming(1);
        offsetX.value = withTiming(0);
        offsetY.value = withTiming(0);
      } else {
        zoom.value = withTiming(2.2);
      }
    });

  const verticalPan = Gesture.Pan()
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
        const drag = absY / SCREEN_H;
        scaleGesture.value = Math.max(0.12, 1 - drag);
        const circleBase = SCREEN_W * 0.5;
        radius.value = interpolate(
          scaleGesture.value,
          [1, 0.12],
          [0, circleBase],
          Extrapolation.CLAMP
        );
        backdropOpacity.value = Math.max(0, 1 - drag * 1.2);
      }
    })
    .onEnd(() => {
      if (zoom.value > 1) {
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
        return;
      }
      if (Math.abs(translateY.value) > CLOSE_THRESHOLD) {
        scheduleOnRN(onClose);
        return;
      }
      translateY.value = withSpring(0);
      radius.value = withSpring(0);
      scaleGesture.value = withSpring(1);
      backdropOpacity.value = withTiming(1, { duration: 160 });
    });

  const gesture = Gesture.Simultaneous(verticalPan, doubleTap);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: radius.value,
      overflow: "hidden",
      transform:
        zoom.value > 1
          ? [{ scale: zoom.value }]
          : [{ translateY: translateY.value }, { scale: scaleGesture.value }],
      opacity: backdropOpacity.value,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.9)",
      opacity: backdropOpacity.value,
    };
  });

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 10 });
  }, [index]);

  if (!visible || !images || images.length === 0) return null;

  const renderSlide = (item: Media, i: number) => {
    if (item.media_type === "IMAGE" || !item.media_type) {
      return (
        <Image
          source={{ uri: generateMediaUrlSingle(item.url), cacheKey: item.id }}
          contentFit="contain"
          style={{ width: SCREEN_W, height: SCREEN_H }}
        />
      );
    } else if (item.media_type === "VIDEO" || !item.media_type) {
      return (
        <MiniVideoPlayer
          canPlay={i == index}
          autoPlay
          uri={generateMediaUrlSingle(item.url)}
        />
      );
    }
    return <></>;
  };
  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <GestureDetector gesture={gesture}>
        <Animated.View style={{ flex: 1 }}>
          <Animated.View style={backdropStyle} pointerEvents="none" />
          <Animated.View
            style={[
              {
                width: SCREEN_W,
                height: SCREEN_H,
              },
              animatedStyle,
            ]}
          >
            <PagerView
              initialPage={index}
              pageMargin={4}
              style={{ width: SCREEN_W, height: SCREEN_H }}
              onPageSelected={(e) => setIndex(e.nativeEvent.position)}
            >
              {images.map((item, i) => (
                <View
                  key={i}
                  style={{ width: SCREEN_W, height: SCREEN_H }}
                  className="bg-black/40"
                >
                  {renderSlide(item, i)}
                </View>
              ))}
            </PagerView>
          </Animated.View>

          <RNView style={styles.topBar} pointerEvents="box-none">
            <Pressable
              onPress={() => {
                backdropOpacity.value = withTiming(0, { duration: 150 });
                progress.value = withTiming(0, { duration: 150 }, () =>
                  scheduleOnRN(onClose)
                );
              }}
              className="bg-background-muted border border-outline-100"
              style={styles.iconBtn}
            >
              <Icon as={X} size="xl" className="text-primary" />
            </Pressable>

            <RNView style={{ flex: 1 }} />
          </RNView>

          {images.length > 1 && (
            <RNView style={styles.bottomStrip} pointerEvents="box-none">
              <ScrollView
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
              >
                {images.map((item, i) => (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setIndex(i);
                    }}
                    style={[
                      styles.thumbWrap,
                      i === index
                        ? { borderColor: Colors.primary }
                        : { borderColor: "rgba(255,255,255,0.2)" },
                    ]}
                  >
                    {item.media_type == "IMAGE" ? (
                      <Image
                        source={{ uri: generateMediaUrlSingle(item.url) }}
                        style={styles.thumb}
                      />
                    ) : (
                      <MiniVideoPlayer
                        showPlayBtn
                        canPlay={false}
                        showLoading={false}
                        uri={generateMediaUrlSingle(item.url)}
                      />
                    )}
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
  androidContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  androidCloseBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 50,
  },
  androidThumbScroll: {
    position: "absolute",
    bottom: 24,
    width: "100%",
  },
  thumbWrap: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 8,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 20,
    left: 12,
    right: 12,
    zIndex: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 6,
    borderRadius: 999,
  },
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
});

export default ProfileImageViewer;
