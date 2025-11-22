import React from "react";
import { Pressable, View } from "react-native";
import { Skeleton } from "moti/skeleton";
import { cn } from "@/lib/utils";

export function ChatItemSkeleton({
  style,
  className,
}: {
  style?: any;
  className?: string;
}) {
  return (
    <Pressable
      style={[{ minHeight: 70 }, style]}
      className={cn("flex-1 bg-background", className)}
    >
      <View className="h-full w-full px-4">
        <View className="w-full h-full border-b border-outline flex-row items-center">
          <View className="h-[60px] gap-4 w-full flex-row items-center">
            <Skeleton colorMode="dark" width={48} height={48} radius={999} />

            <View className="flex-1 gap-1">
              <View className="flex-row items-center justify-between">
                <Skeleton
                  colorMode="dark"
                  width={"50%"}
                  height={16}
                  radius={6}
                />
                <Skeleton colorMode="dark" width={40} height={12} radius={6} />
              </View>

              <View className="flex-row items-center justify-between">
                <Skeleton
                  colorMode="dark"
                  width={"70%"}
                  height={14}
                  radius={6}
                />
                <Skeleton
                  colorMode="dark"
                  width={20}
                  height={18}
                  radius={999}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
