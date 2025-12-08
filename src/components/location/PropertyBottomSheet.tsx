import BottomSheet from "@/components/shared/BottomSheet";
import * as React from "react";
import { View } from "react-native";
import { Icon, Pressable, Text } from "@/components/ui";
import {
  cn,
  composeFullAddress,
  formatMoney,
  generateTitle,
  formatDateDistance,
} from "@/lib/utils";
import PropertyMedia from "@/components/property/PropertyMedia";
import { Eye, Heart } from "lucide-react-native";
import { router } from "expo-router";

type Props = {
  onDismiss: () => void;
  visible: boolean;
  data: Property;
};
export default function PropertyBottomSheet(props: Props) {
  const { visible, onDismiss, data } = props;
  const Actions = () => {
    return (
      <Text className="text-base">
        {formatDateDistance(data.created_at, true)}
      </Text>
    );
  };
  return (
    <BottomSheet
      withCloseButton
      withHeader
      visible={visible}
      title={`${generateTitle(data)} for ${data.purpose.charAt(0).toUpperCase()}${data.purpose.slice(1)}`}
      onDismiss={onDismiss}
      snapPoint="45%"
    >
      <View className=" px-4 py-1 flex-1">
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
            style={{ height: 380 }}
            source={data?.media[0]}
            onPress={() => {
              onDismiss();
              router.push({
                pathname: "/property/[propertyId]",
                params: {
                  propertyId: data.slug,
                },
              });
            }}
            rounded
          />
          <View className="justify-between">
            <View
              className={cn(
                "flex-row pb-5 px-4 gap-4 justify-between items-end"
              )}
            >
              <View className="flex-1 gap-1">
                <View className="flex-row gap-4 items-center mt-4">
                  <Actions />
                  <View className="flex-row gap-2 items-center">
                    <Icon as={Eye} size="sm" color="white" />
                    <Text className="text-white text-base">
                      {data?.interaction?.viewed}
                    </Text>
                  </View>
                  <View className="flex-row gap-2 items-center">
                    <Icon as={Heart} size="sm" color={"white"} />
                    <Text className="text-white text-base">
                      {data?.interaction?.liked}
                    </Text>
                  </View>
                </View>

                {data?.address && (
                  <View className="flex-row items-center gap-1">
                    <Text className="text-white ">
                      {composeFullAddress(data.address)}
                    </Text>
                  </View>
                )}
                <Text className="text-white text-2xl font-bold">
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
