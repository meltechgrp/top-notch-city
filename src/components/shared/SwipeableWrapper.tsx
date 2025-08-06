import { Icon, Text } from "@/components/ui";
import { Edit, Trash } from "lucide-react-native";
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import * as Haptics from "expo-haptics";
import { ReactNode, useEffect, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { RectButton } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import eventBus from "@/lib/eventBus";

type Props = {
  children: ReactNode;
  rightAction?: () => void;
  leftAction?: () => void;
  withBorder?: boolean;
  rightText?: string;
};

export default function SwipeableWrapper({
  children,
  rightAction,
  leftAction,
  withBorder,
  rightText = "Edit",
}: Props) {
  const height = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleY: height.value }],
  }));
  const reanimatedRef = useRef<SwipeableMethods>(null);
  const RightAction = () => {
    if (!rightAction) return null;
    const pressHandler = () => {
      if (Platform.OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      rightAction();
      reanimatedRef.current?.close();
    };
    return (
      <Animated.View style={{ width: 90, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[
            styles.rightAction,
            { backgroundColor: "gray", borderRadius: withBorder ? 10 : 0 },
          ]}
          onPress={pressHandler}
        >
          <Icon as={Edit} className="text-white" />
          <Text className="text-white">{rightText}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  const LeftAction = () => {
    if (!leftAction) return null;
    const pressHandler = () => {
      if (Platform.OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Clock_Tick);
      }
      leftAction();
      reanimatedRef.current?.close();
    };
    return (
      <Animated.View style={{ width: 90, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[
            styles.rightAction,
            {
              backgroundColor: Colors.primary,
              borderRadius: withBorder ? 10 : 0,
            },
          ]}
          onPress={pressHandler}
        >
          <Icon as={Trash} className="text-white" />
          <Text className="text-white">Delete</Text>
        </RectButton>
      </Animated.View>
    );
  };

  useEffect(() => {
    eventBus.addEventListener("SWIPEABLE_OPEN", () =>
      reanimatedRef.current?.close()
    );

    return () => {
      eventBus.removeEventListener("SWIPEABLE_OPEN", () =>
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
        renderLeftActions={LeftAction}
        renderRightActions={RightAction}
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
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
