import { View } from "react-native";
import { MotiView } from "moti";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function HorizontalListItemSkeleton({ className }: Props) {
  return (
    <View
      className={cn(
        "relative flex-row h-[110px] bg-background-muted/80 rounded-xl p-2 gap-4 overflow-hidden",
        className
      )}
      style={{ borderRadius: 8 }}
    >
      {/* Image skeleton */}
      {/* <Skeleton
        variant="sharp"
        className="h-full w-32 rounded-xl"
        style={{ width: 128, borderRadius: 8 }}
      /> */}

      {/* Text block skeleton */}
      <View className="w-[120px] justify-center gap-2">
        {/* <SkeletonText _lines={3} className="h-3" /> */}
      </View>
    </View>
  );
}
