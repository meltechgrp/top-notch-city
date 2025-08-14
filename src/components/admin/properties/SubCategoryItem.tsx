import { Icon, Text, View } from "@/components/ui";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { useState } from "react";
import CategoryBottomSheet from "./CategoryBottomSheet";
import { CornerDownRight } from "lucide-react-native";
import { useCategoryMutations } from "@/tanstack/mutations/useCategoryMutations";

type Props = {
  categoryId: string;
  item: {
    name: string;
    id: string;
  };
};

export default function SubCategoryItem({ item, categoryId }: Props) {
  const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
  const { mutateAsync: editSubCategory, isPending: loading2 } =
    useCategoryMutations().editSubcategoryMutation;
  const { mutateAsync: deleteSubCategory, isPending: loading } =
    useCategoryMutations().deleteSubcategoryMutation;

  async function editHandler(val: string) {
    await editSubCategory(
      {
        id: item.id,
        data: {
          category_id: categoryId,
          name: val,
        },
      },
      {
        onSuccess: () => setCategoryBottomSheet(false),
      }
    );
  }
  async function deleteHandler() {
    await deleteSubCategory(
      {
        categoryId: categoryId,
        subcategoryId: item.id,
      },
      {
        onSuccess: () => setCategoryBottomSheet(false),
      }
    );
  }
  return (
    <>
      <SwipeableWrapper
        rightAction={() => setCategoryBottomSheet(true)}
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
      <CategoryBottomSheet
        visible={categoryBottomSheet}
        onDismiss={() => setCategoryBottomSheet(false)}
        onSubmit={editHandler}
        loading={loading || loading2}
        type="edit"
        value={item.name}
      />
    </>
  );
}
