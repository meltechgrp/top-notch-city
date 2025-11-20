import { Pressable, View } from "react-native";
import { Skeleton } from "moti/skeleton";
import { cn } from "@/lib/utils";
import Layout from "@/constants/Layout";

export function PropertySkeletonCard({
  isHorizontal,
  style,
  className,
}: {
  isHorizontal?: boolean;
  style?: any;
  className?: string;
  bannerHeight?: number;
}) {
  const { bannerHeight } = Layout;
  return (
    <Pressable
      style={[{ height: bannerHeight }, style]}
      className={cn(
        "relative flex-1 bg-background-muted rounded-xl overflow-hidden",
        isHorizontal && "w-[23rem]",
        className
      )}
    >
      <Skeleton
        colorMode="dark"
        radius={16}
        height={bannerHeight}
        width={"100%"}
      />

      <View className="absolute inset-0 justify-between">
        <View className="flex-row p-4 pb-0 justify-between items-start">
          <Skeleton colorMode="dark" width={80} height={20} radius={8} />

          <Skeleton colorMode="dark" width={40} height={40} radius={999} />
        </View>

        <View className="px-4 pb-5 gap-3">
          <View className="flex-row justify-between items-end">
            <Skeleton colorMode="dark" width={"70%"} height={20} radius={6} />
            <Skeleton colorMode="dark" width={40} height={20} radius={6} />
          </View>

          <Skeleton colorMode="dark" width={"40%"} height={18} radius={6} />

          <Skeleton colorMode="dark" width={90} height={24} radius={6} />
        </View>
      </View>
    </Pressable>
  );
}
