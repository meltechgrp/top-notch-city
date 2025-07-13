import React, { useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { StyleSheet } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Icon, Text, View } from "../ui";
import { MessageCircle, Trash } from "lucide-react-native";
import eventBus from "@/lib/eventBus";
import Animated from "react-native-reanimated";
import { RectButton } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";

export default function NotificationItemWrapper({
  children,
  onDelete,
  onRead,
  isRead,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  onRead: () => void;
  isRead: boolean;
}) {
  const height = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleY: height.value }],
  }));
  const reanimatedRef = useRef<SwipeableMethods>(null);
  const handleSwipeDelete = () => {
    // Animate out
    opacity.value = withTiming(0, { duration: 500 });
    height.value = withTiming(0, { duration: 500 }, () => {
      runOnJS(onDelete)();
    });
  };
  const RightAction = () => {
    const pressHandler = () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onDelete();
      reanimatedRef.current?.close();
    };
    return (
      <Animated.View style={{ width: 100, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[
            styles.rightAction,
            { backgroundColor: Colors.primary, borderRadius: 12 },
          ]}
          onPress={pressHandler}
        >
          <Icon as={Trash} className="text-white" />
          <Text className="text-white">Delete</Text>
        </RectButton>
      </Animated.View>
    );
  };
  const LeftAction = () => {
    const pressHandler = () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onRead();
      reanimatedRef.current?.close();
    };
    if (isRead) return undefined;
    return (
      <Animated.View style={{ width: 100, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[
            styles.rightAction,
            { backgroundColor: "gray", borderRadius: 12 },
          ]}
          onPress={pressHandler}
        >
          <Icon as={MessageCircle} className="text-white" />
          <Text className="text-white">Read</Text>
        </RectButton>
      </Animated.View>
    );
  };
  useEffect(() => {
    if (!isRead) return;
    reanimatedRef.current?.close();
  }, [isRead]);

  function handleSwipeOpen() {
    eventBus.dispatchEvent("NOTIFICATION_OPEN", null);
  }

  useEffect(() => {
    eventBus.addEventListener("NOTIFICATION_OPEN", () =>
      reanimatedRef.current?.close()
    );

    return () => {
      eventBus.removeEventListener("NOTIFICATION_OPEN", () =>
        reanimatedRef.current?.close()
      );
    };
  }, []);
  return (
    <Reanimated.View style={animatedContainerStyle}>
      <ReanimatedSwipeable
        friction={2}
        ref={reanimatedRef}
        rightThreshold={40}
        onSwipeableWillOpen={() =>
          eventBus.dispatchEvent("NOTIFICATION_SWIPED", true)
        }
        onSwipeableClose={() =>
          eventBus.dispatchEvent("NOTIFICATION_SWIPED", false)
        }
        renderLeftActions={LeftAction}
        renderRightActions={RightAction}
        shouldCancelWhenOutside={true}
        onSwipeableCloseStartDrag={handleSwipeOpen}
        overshootLeft={false}
        overshootRight={false}
        leftThreshold={30}
      >
        {children}
      </ReanimatedSwipeable>
    </Reanimated.View>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    minWidth: 80,
    width: "100%",
    minHeight: 80,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
