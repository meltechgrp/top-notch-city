import { Icon, Text, View } from "@/components/ui";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { useState } from "react";
import AmenityBottomSheet from "./AmenityBottomSheet";
import { CornerDownRight } from "lucide-react-native";
import { useAmenityMutations } from "@/tanstack/mutations/useAmenityMutation";

type Props = {
  item: AmenityLabel;
};

export default function AmenityItem({ item }: Props) {
  const [amenityBottomSheet, setAmenityBottomSheet] = useState(false);
  const { mutateAsync: editAmenity, isPending: loading2 } =
    useAmenityMutations().editAmenityMutation;
  const { mutateAsync: deleteAmenity, isPending: loading } =
    useAmenityMutations().deleteAmenityMutation;

  async function editHandler(data: Omit<AmenityLabel, "id">) {
    await editAmenity(
      {
        id: item.id,
        data,
      },
      {
        onSuccess: () => setAmenityBottomSheet(false),
      }
    );
  }
  async function deleteHandler() {
    await deleteAmenity(
      { id: item.id },
      {
        onSuccess: () => setAmenityBottomSheet(false),
      }
    );
  }
  return (
    <>
      <SwipeableWrapper
        rightAction={() => setAmenityBottomSheet(true)}
        leftAction={() => deleteHandler()}
      >
        <View className="flex-1 p-6 py-5 border-t border-outline flex-row justify-between items-center bg-background-muted">
          <View className="flex-row gap-2 items-center">
            <Icon size="sm" as={CornerDownRight} className="text-primary" />
            <Text size="md" className=" capitalize font-light">
              {item.name}
            </Text>
          </View>
        </View>
      </SwipeableWrapper>
      <AmenityBottomSheet
        visible={amenityBottomSheet}
        onDismiss={() => setAmenityBottomSheet(false)}
        onSubmit={editHandler}
        loading={loading || loading2}
        type="edit"
        value={item}
      />
    </>
  );
}
