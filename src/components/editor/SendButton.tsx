import IconButton from "@/components/media/IconButton";
import { cn } from "@/lib/utils";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

export function SendButton({
  onPress,
  className,
}: {
  onPress: () => void;
  className?: string;
}) {
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
      className={className}
    >
      <IconButton
        className={cn(
          "bg-primary h-12 w-12 rounded-full items-center justify-center",
          className
        )}
        onPress={onPress}
        iosName={"paperplane.fill"}
        style={{ transform: [{ rotate: "45deg" }] }}
        androidName="send"
      />
    </Animated.View>
  );
}
