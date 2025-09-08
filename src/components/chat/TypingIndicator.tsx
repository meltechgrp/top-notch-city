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

const DOT_SIZE = 8;

const Dot = ({ delay }: { delay: number }) => {
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
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: Colors.primary,
          marginHorizontal: 4,
        },
        animatedStyle,
      ]}
    />
  );
};

export const TypingIndicator = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", height: 20 }}>
      <Dot delay={0} />
      <Dot delay={100} />
      <Dot delay={200} />
    </View>
  );
};
