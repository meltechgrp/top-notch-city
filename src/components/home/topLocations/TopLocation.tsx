import { hapticFeed } from "@/components/HapticTab";
import { Icon, Image, Text, View } from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import React, { memo } from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  location: TopLocation;
  clasName?: string;
};

function TopLocation({
  location: { state, property_count, property_image, longitude, latitude },
  clasName,
}: Props) {
  return (
    <TouchableOpacity
      key={state}
      onPress={() => {
        hapticFeed();
        router.push({
          pathname: `/explore`,
          params: {
            longitude,
            latitude,
          },
        });
      }}
      className={cn(
        "relative rounded-lg w-[165px] overflow-hidden h-32 flex-1",
        clasName
      )}
    >
      <Image
        source={generateMediaUrlSingle(property_image)}
        className="w-full h-full"
        alt={state}
      />
      <View className="absolute inset-0 bg-black/50 gap-1 to-transparent flex justify-end p-4">
        <View className=" flex-row gap-2 items-center">
          <View className="max-w-[70%]">
            <Text numberOfLines={1} className="text-white text-base font-bold">
              {state}
            </Text>
          </View>
          <View className="w-8">
            <Icon size="lg" as={MapPin} className="text-primary" />
          </View>
        </View>
        <Text className="text-gray-200 text-base">
          {property_count} {property_count > 1 ? "Properties" : "Property"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(TopLocation);
