import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ViewProps } from "react-native";
import { memo } from "react";
import { Pressable } from "@/components/ui";

// Reusable Animated Pressable
const AnimatedPressable = ({
  children,
  onPress,
  className,
  ...props
}: ViewProps & {
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.85, { damping: 10, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      onPress={onPress}
    >
      <Animated.View style={animatedStyle} className={className} {...props}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default memo(AnimatedPressable);
