import React from "react";
import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import { useLayout } from "@react-native-community/hooks";
import { Box } from "@/components/ui";

export default function ProfileSkeleton() {
  const { width, onLayout } = useLayout();

  return (
    <Box className="flex-1">
      <MotiView
        transition={{ type: "timing" }}
        onLayout={onLayout}
        className="flex-1 px-4"
      >
        <View className="flex-row items-center mt-6">
          <Skeleton colorMode="dark" radius="round" height={90} width={90} />
          <View className="flex-row flex-1 justify-around ml-6">
            {[...Array(3)].map((_, i) => (
              <View key={i} className="items-center gap-3">
                <Skeleton colorMode="dark" height={20} width={40} />
                <Skeleton colorMode="dark" height={16} width={60} />
              </View>
            ))}
          </View>
        </View>

        <View className="mt-4 flex-row justify-between gap4 space-y-2">
          <Skeleton colorMode="dark" height={20} width={width * 0.28} />
          <Skeleton colorMode="dark" height={16} width={width * 0.28} />
          <Skeleton colorMode="dark" height={16} width={width * 0.28} />
        </View>

        <View className="flex-row justify-between mt-6 space-x-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} colorMode="dark" height={30} width={60} />
          ))}
        </View>

        <View className="mt-6">
          <Skeleton colorMode="dark" height={1} width={width} radius={0} />
        </View>

        <View className="gap-6 mt-4">
          <Skeleton
            colorMode="dark"
            height={250}
            width={width - 40}
            radius={4}
          />
          <Skeleton
            colorMode="dark"
            height={400}
            width={width - 40}
            radius={4}
          />
        </View>
      </MotiView>
    </Box>
  );
}
