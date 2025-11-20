import { Icon } from "../ui";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Heart } from "lucide-react-native";
import { Animated } from "react-native";

export function AnimatedLikeButton({
  liked,
  className,
}: {
  liked: boolean;
  className?: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (liked) {
      Animated.parallel([
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.6,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -1,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 60,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [liked]);

  const shakeInterpolate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-6, 6],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { translateX: shakeInterpolate }],
      }}
    >
      <Icon
        as={Heart}
        className={cn(
          "text-white w-8 h-8",
          className,
          liked && "text-primary fill-primary"
        )}
      />
    </Animated.View>
  );
}
