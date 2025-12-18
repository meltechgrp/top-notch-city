import React, { ReactNode, useCallback, useEffect } from "react";
import { Dimensions, Modal, Platform } from "react-native";
import { Icon, Text, Pressable, View } from "@/components/ui";
import { ChevronLeft, LucideIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";

const SCREEN_WIDTH = Dimensions.get("window").width;
const EDGE_WIDTH = 20;
type ModalScreenProps = {
  title?: string;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
  closeIcon?: LucideIcon;
  children: ReactNode;
  disableSwipe?: boolean;
  visible?: boolean;
  withScroll?: boolean;
  onDismiss: (val: boolean) => void;
};

export default function ModalScreen({
  title,
  rightComponent,
  children,
  disableSwipe = false,
  withScroll = false,
  onDismiss,
  closeIcon,
  leftComponent,
  visible,
}: ModalScreenProps) {
  const insets = useSafeAreaInsets();

  const translateX = useSharedValue(SCREEN_WIDTH);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const open = () => {
    translateX.value = withTiming(0, { duration: 250 });
  };

  const close = useCallback(() => {
    translateX.value = withTiming(SCREEN_WIDTH, { duration: 250 }, () => {
      scheduleOnRN(onDismiss, false);
    });
  }, [onDismiss]);

  const panGesture = Gesture.Pan()
    .enabled(!disableSwipe && Platform.OS === "ios")
    .activeOffsetX(10)
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      if (e.translationX > 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (e.translationX > SCREEN_WIDTH * 0.3) {
        scheduleOnRN(close);
      } else {
        translateX.value = withSpring(0);
      }
    });
  useEffect(() => {
    if (visible) open();
  }, [visible]);
  return (
    <>
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={close}
      >
        <Animated.View
          style={[{ flex: 1 }, animatedStyle]}
          className={"bg-background"}
        >
          {!disableSwipe && Platform.OS === "ios" && (
            <GestureDetector gesture={panGesture}>
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: EDGE_WIDTH,
                  zIndex: 50,
                }}
              />
            </GestureDetector>
          )}
          <View className="flex-1">
            <View
              style={{
                paddingTop: Math.max(insets.top, 16),
              }}
              className=" bg-background"
            >
              <View className="h-14 pb-1 px-4 flex-row items-center justify-between border-b border-outline-100/50 relative">
                {leftComponent ?? (
                  <Pressable onPress={close} className="w-20">
                    <View className="p-2 self-start ml-2 border bg-background-muted border-outline-100 rounded-full items-center justify-center">
                      <Icon as={closeIcon ?? ChevronLeft} size="xl" />
                    </View>
                  </Pressable>
                )}

                <View className=" absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                  <Text className="text-lg capitalize font-bold">
                    {title ?? ""}
                  </Text>
                </View>

                <View className="min-w-[40px] items-end">
                  {rightComponent ?? null}
                </View>
              </View>
            </View>
            {withScroll ? (
              <BodyScrollView style={{ flex: 1 }} containerClassName="flex-1">
                {children}
              </BodyScrollView>
            ) : (
              <View className="flex-1">{children}</View>
            )}
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}
