"use client";

import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Skeleton } from "moti/skeleton";

export function AgentSkeletonCard() {
  return (
    <TouchableOpacity
      className="flex-row bg-background-muted items-center rounded-xl justify-between px-4 py-3"
      activeOpacity={0.7}
    >
      <Skeleton colorMode="dark" width={50} height={50} radius={32} />

      <View className="flex-1 ml-3 gap-2 ">
        <Skeleton colorMode="dark" width={128} height={10} radius={8} />
        <Skeleton colorMode="dark" width={80} height={10} radius={6} />
        <View className="flex-row items-center gap-2">
          <Skeleton colorMode="dark" width={48} height={10} radius={6} />
          <Skeleton colorMode="dark" width={48} height={10} radius={6} />
        </View>
      </View>

      <Skeleton colorMode="dark" width={80} height={24} radius={18} />
    </TouchableOpacity>
  );
}
