import BottomSheet from "@/components/shared/BottomSheet";
import * as React from "react";
import { View } from "react-native";
import { Icon, Pressable, Text } from "@/components/ui";
import { cn, composeFullAddress, formatMoney, useTimeAgo } from "@/lib/utils";
import PropertyMedia from "@/components/property/PropertyMedia";
import { PropertyTitle } from "@/components/property/PropertyTitle";
import PropertyInteractions from "@/components/property/PropertyInteractions";
import { MapPin } from "lucide-react-native";
import { router } from "expo-router";

type Props = {
  onDismiss: () => void;
  visible: boolean;
  data: Property;
};
export default function PropertyBottomSheet(props: Props) {
  const { visible, onDismiss, data } = props;
  const Actions = () => {
    return <Text className="text-gray-300">{useTimeAgo(data.created_at)}</Text>;
  };
  return (
    <BottomSheet visible={visible} onDismiss={onDismiss} plain snapPoint="35%">
      <View className=" p-4 flex-1">
        <Pressable
          key={data.id}
          onPress={() => {
            onDismiss();
            router.push({
              pathname: "/property/[propertyId]",
              params: {
                propertyId: data.slug,
              },
            });
          }}
          className={cn("relative flex-1 rounded-xl")}
        >
          <PropertyMedia
            style={{ height: 400 }}
            source={data?.media[0]}
            withBackdrop
            rounded
          />
          <View className=" absolute top-0 w-full h-full justify-between">
            <View
              className={cn(" flex-row p-4 pb-0 items-start justify-between")}
            >
              <Actions />
            </View>
            <View
              className={cn(
                "flex-row pb-5 px-4 gap-4 justify-between items-end"
              )}
            >
              <View className="flex-1 gap-1">
                <View className="flex-row justify-between items-end">
                  <PropertyTitle property={data} />
                  {data.interaction && (
                    <PropertyInteractions
                      interaction={data.interaction}
                      className="w-[15%] gap-2 pr-0"
                    />
                  )}
                </View>

                {data?.address && (
                  <View className="flex-row items-center gap-1">
                    <Icon as={MapPin} size="sm" className="text-white" />
                    <Text className="text-white text-sm">
                      {composeFullAddress(data.address)}
                    </Text>
                  </View>
                )}
                <Text className="text-white text-xl font-bold">
                  {formatMoney(data.price, "NGN", 0)}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
