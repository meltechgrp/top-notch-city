import { Pressable, View } from "react-native";
import { Skeleton } from "moti/skeleton";
import { cn } from "@/lib/utils";

export function ReviewSkeleton({
  style,
  className,
}: {
  style?: any;
  className?: string;
}) {
  return (
    <Pressable
      style={[{ minHeight: 120 }, style]}
      className={cn(
        "relative flex-1 bg-background-muted rounded-xl overflow-hidden p-4",
        className
      )}
    >
      {/* Header: Avatar + Name + Date */}
      <View className="flex-row items-center mb-3 justify-between">
        <View className="flex-row items-center gap-3">
          <Skeleton colorMode="dark" width={40} height={40} radius={999} />
          <Skeleton colorMode="dark" width={120} height={18} radius={6} />
        </View>
        <Skeleton colorMode="dark" width={80} height={14} radius={6} />
      </View>

      {/* Rating stars */}
      <View className="flex-row mb-3 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            colorMode="dark"
            width={16}
            height={16}
            radius={4}
          />
        ))}
      </View>

      {/* Comment text */}
      <View className="gap-2">
        <Skeleton colorMode="dark" width={"90%"} height={14} radius={6} />
        <Skeleton colorMode="dark" width={"80%"} height={14} radius={6} />
        <Skeleton colorMode="dark" width={"60%"} height={14} radius={6} />
      </View>
    </Pressable>
  );
}
