import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

export default function LoadingLine() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // Animate width from 0% to 50% (centered = outward expansion)
    const scaleX = 0.85 + progress.value * 0.85; // from 25% to 50%

    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ["#ff4d4d", "#4dff88", "#4da6ff"]
    );

    return {
      transform: [{ scaleX }], // expands/shrinks from center
      backgroundColor,
    };
  });

  return (
    <View className="mt-1 w-full h-1 bg-background overflow-hidden rounded items-center justify-center">
      <Animated.View
        className="h-full rounded"
        style={[
          {
            width: "50%", // base width, scaling will handle animation
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
