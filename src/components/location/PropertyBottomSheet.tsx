import BottomSheet from "@/components/shared/BottomSheet";
import * as React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import PropertyListItem from "@/components/property/PropertyListItem";
import { Property } from "@/db/models/properties";

type Props = {
  onDismiss: () => void;
  visible: boolean;
  data: Property;
};
export default function PropertyBottomSheet(props: Props) {
  const { visible, onDismiss, data } = props;
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint="40%"
      withScroll
    >
      <View className=" px-4 py-1 flex-1">
        <PropertyListItem
          onPress={() => {
            onDismiss();
            router.push({
              pathname: "/property/[propertyId]",
              params: {
                propertyId: data.slug,
              },
            });
          }}
          property={data}
        />
      </View>
    </BottomSheet>
  );
}
