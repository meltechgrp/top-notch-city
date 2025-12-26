import { Text, View } from "@/components/ui";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import * as Haptics from "expo-haptics";
import { ReactNode, useEffect, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { RectButton } from "react-native-gesture-handler";
import eventBus from "@/lib/eventBus";

export type SwipeAction = {
  onPress: () => void;
  component?: ReactNode;
  width?: number;
  type?: "success" | "danger" | "neutral";
};

type Props = {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  withBorder?: boolean;
};

export default function SwipeableWrapper({
  children,
  leftActions = [],
  rightActions = [],
  withBorder,
}: Props) {
  const reanimatedRef = useRef<SwipeableMethods>(null);

  const triggerHaptics = (type?: SwipeAction["type"]) => {
    if (Platform.OS === "ios") {
      if (type === "danger") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Clock_Tick);
    }
  };

  const renderActions = (actions: SwipeAction[]) => () => (
    <Animated.View style={{ flexDirection: "row" }}>
      {actions.map((action, index) => (
        <RectButton
          key={index}
          style={[
            styles.action,
            {
              width: action.width ?? 80,
              borderRadius: withBorder ? 10 : 0,
            },
          ]}
          onPress={() => {
            triggerHaptics(action.type);
            action.onPress();
            reanimatedRef.current?.close();
          }}
        >
          {action.component ?? (
            <View className="flex-1 items-center justify-center bg-gray-600">
              <Text className="text-white">Action</Text>
            </View>
          )}
        </RectButton>
      ))}
    </Animated.View>
  );

  function handleSwipeOpen() {
    eventBus.dispatchEvent("SWIPEABLE_OPEN", null);
  }

  useEffect(() => {
    const closeAll = () => reanimatedRef.current?.close();

    eventBus.addEventListener("SWIPEABLE_OPEN", closeAll);
    return () => {
      eventBus.removeEventListener("SWIPEABLE_OPEN", closeAll);
    };
  }, []);

  return (
    <ReanimatedSwipeable
      ref={reanimatedRef}
      friction={2}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={
        leftActions.length ? renderActions(leftActions) : undefined
      }
      onSwipeableCloseStartDrag={handleSwipeOpen}
      renderRightActions={
        rightActions.length ? renderActions(rightActions) : undefined
      }
    >
      {children}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  action: {
    height: "100%",
  },
});
