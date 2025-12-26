import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import Layout from "@/constants/Layout";
import { Box } from "@/components/ui";

export function PropertySkeletonScreen() {
  const { bannerHeight } = Layout;

  return (
    <Box className="flex-1 relative">
      {/* Carousel Section */}
      <Skeleton
        colorMode="dark"
        radius={0}
        height={bannerHeight + 60}
        width={"100%"}
      />

      <View className="px-4 py-5 gap-4 rounded-t-2xl bg-background -mt-4">
        {/* Price + Status */}
        <View className="bg-background-muted p-4 border border-outline-100 rounded-2xl gap-1">
          <View className="flex-row justify-between items-center">
            <Skeleton colorMode="dark" width={140} height={28} radius={8} />
            <Skeleton colorMode="dark" width={80} height={20} radius={6} />
          </View>
          <View className="flex-row justify-between items-center">
            <Skeleton colorMode="dark" width={140} height={12} radius={8} />
          </View>
          <View className="flex-row justify-between items-center">
            <Skeleton colorMode="dark" width={140} height={12} radius={8} />
            <View className="flex-row gap-4">
              <Skeleton colorMode="dark" width={60} height={20} radius={6} />
              <Skeleton colorMode="dark" width={60} height={20} radius={6} />
            </View>
          </View>
        </View>
        <View className="flex-row justify-between my-4">
          <Skeleton colorMode="dark" width={100} height={45} radius={6} />
          <Skeleton colorMode="dark" width={100} height={45} radius={6} />
          <Skeleton colorMode="dark" width={100} height={45} radius={6} />
        </View>

        {/* What's Special Section */}
        <View className="bg-background-muted p-4 border border-outline-100 rounded-2xl gap-1">
          <Skeleton colorMode="dark" width={"40%"} height={22} radius={6} />
          <Skeleton colorMode="dark" width={"100%"} height={18} radius={6} />
          <Skeleton colorMode="dark" width={"95%"} height={18} radius={6} />
          <Skeleton colorMode="dark" width={"85%"} height={18} radius={6} />
        </View>
        <View className="bg-background-muted p-4 border border-outline-100 rounded-2xl gap-1">
          <Skeleton colorMode="dark" width={"40%"} height={22} radius={6} />
          <Skeleton colorMode="dark" width={"100%"} height={18} radius={6} />
          <Skeleton colorMode="dark" width={"95%"} height={18} radius={6} />
          <Skeleton colorMode="dark" width={"85%"} height={18} radius={6} />
        </View>
      </View>
      {/* CTA Buttons */}
      <View className="flex-row justify-between bg-background w-full left-0 absolute bottom-4 gap-3 border-t border-t-outline-100 p-4">
        <Skeleton colorMode="dark" width={160} height={50} radius={8} />
        <Skeleton colorMode="dark" width={160} height={50} radius={8} />
      </View>
    </Box>
  );
}
