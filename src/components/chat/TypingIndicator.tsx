import { Colors } from "@/constants/Colors";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";

const Dot = ({ delay, size }: { delay: number; size: number }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: Colors.primary,
          marginHorizontal: 4,
        },
        animatedStyle,
      ]}
    />
  );
};

export const TypingIndicator = ({ size = 8 }: { size?: number }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", height: 20 }}>
      <Dot size={size} delay={0} />
      <Dot size={size} delay={100} />
      <Dot size={size} delay={200} />
    </View>
  );
};
