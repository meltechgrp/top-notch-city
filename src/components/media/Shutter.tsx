import * as React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSpring,
  cancelAnimation,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { CameraMode } from "expo-camera";
import { Pressable } from "@/components/ui";

type ShutterButtonProps = {
  onPress: () => void;
  isRecording: boolean;
  cameraMode: CameraMode;
};

export function ShutterButton({
  onPress,
  isRecording,
  cameraMode,
}: ShutterButtonProps) {
  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    if (isRecording && cameraMode === "video") {
      pulse.value = withRepeat(withTiming(1.2, { duration: 700 }), -1, true);
    } else {
      cancelAnimation(pulse);
      pulse.value = 1;
    }
  }, [isRecording, cameraMode]);

  const handlePress = () => {
    if (cameraMode === "picture") {
      scale.value = 0.9;
      scale.value = withSpring(1, {
        damping: 6,
        stiffness: 300,
      });
    }
    onPress();
  };

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor:
      cameraMode === "video" && isRecording ? Colors.primary : "white",
  }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.outer, outerStyle]}>
        <Animated.View style={[styles.inner, innerStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 100,
    paddingHorizontal: 24,
    position: "absolute",
    width: "100%",
  },
  outer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
});
