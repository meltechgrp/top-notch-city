import { hapticFeed } from "@/components/HapticTab";
import { Image, Text, View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  location: TopLocation;
  clasName?: string;
};

export default function TopLocation({
  location: { state, property_count, photo_url },
  clasName,
}: Props) {
  return (
    <TouchableOpacity
      key={state}
      onPress={() => {
        hapticFeed();
        router.push({
          pathname: `/property/locations/[locationId]`,
          params: {
            locationId: state,
          },
        });
      }}
      className={cn(
        "relative rounded-lg w-[165px] overflow-hidden h-32 flex-1",
        clasName
      )}
    >
      <Image source={photo_url} className="w-full h-full" alt={state} />
      <View className="absolute inset-0 bg-black/40 to-transparent flex justify-end p-4">
        <Text className="text-white text-xl font-bold">{state}</Text>
        <Text className="text-gray-200 text-base">
          {property_count} Properties
        </Text>
      </View>
    </TouchableOpacity>
  );
}
