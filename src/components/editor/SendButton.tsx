import IconButton from "@/components/media/IconButton";
import { cn } from "@/lib/utils";

export function SendButton({
  onPress,
  className,
}: {
  onPress: () => void;
  className?: string;
}) {
  return (
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
  );
}
