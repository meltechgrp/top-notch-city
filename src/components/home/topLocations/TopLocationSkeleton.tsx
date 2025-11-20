import { View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Skeleton } from "moti/skeleton";

interface Props {
  className?: string;
}

export function TopLocationSkeleton({ className }: Props) {
  return (
    <View
      className={cn(
        "relative rounded-lg w-[165px] bg-background-muted overflow-hidden h-32 flex-1",
        className
      )}
    >
      <Skeleton colorMode="dark" radius={8} width={"100%"} height={"100%"} />

      <View className="absolute inset-0 bg-black/40 flex justify-end p-4 gap-2">
        <View className="flex-row gap-2 items-center">
          <Skeleton colorMode="dark" width={100} height={16} radius={4} />
          <Skeleton colorMode="dark" width={24} height={24} radius={12} />
        </View>
        <Skeleton colorMode="dark" width={80} height={14} radius={4} />
      </View>
    </View>
  );
}
