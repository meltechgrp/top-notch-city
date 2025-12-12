import { Icon, Pressable, Text, View } from "@/components/ui";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import CategoryBottomSheet from "./CategoryBottomSheet";
import { useCategoryMutations } from "@/tanstack/mutations/useCategoryMutations";
import { cn } from "@/lib/utils";

type Props = {
  item: Omit<Category, "slug">;
  className?: string;
};

export default function CategoryItem({ item, className }: Props) {
  const { mutateAsync: editCategory, isPending: loading3 } =
    useCategoryMutations().editCategoryMutation;
  const { mutateAsync: deleteCategory, isPending: loading } =
    useCategoryMutations().deleteCategoryMutation;
  const { mutateAsync: addSubcategory, isPending: loading2 } =
    useCategoryMutations().addSubcategoryMutation;
  const [categoryBottomSheet, setCategoryBottomSheet] = useState(false);
  const [type, setType] = useState<"edit" | "add" | undefined>();
  async function editHandler(val: string) {
    await editCategory(
      {
        id: item.id,
        data: { name: val },
      },
      {
        onSuccess: () => setCategoryBottomSheet(false),
      }
    );
  }
  async function deleteHandler() {
    await deleteCategory(
      { id: item.id },
      {
        onSuccess: () => setCategoryBottomSheet(false),
      }
    );
  }

  async function newSubHandler(val: string) {
    await addSubcategory(
      {
        categoryId: item.id,
        data: { name: val, category_id: item.id },
      },
      {
        onSuccess: () => setCategoryBottomSheet(false),
      }
    );
  }
  return (
    <>
      <View className={cn("flex-1", className)}>
        <SwipeableWrapper
          rightAction={() => {
            setType("edit");
            setCategoryBottomSheet(true);
          }}
          leftAction={() => deleteHandler()}
        >
          <View
            className={cn(
              "flex-1 p-6 py-4 flex-row justify-between items-center bg-background-muted rounded-t-xl"
            )}
          >
            <View>
              <Text size="lg" className="capitalize">
                {item.name} Category
              </Text>
            </View>
            <View>
              <Pressable
                onPress={() => {
                  setType("add");
                  setCategoryBottomSheet(true);
                }}
                className=" p-2 rounded-full bg-background"
              >
                <Icon size="xl" as={Plus} className="text-primary" />
              </Pressable>
            </View>
          </View>
        </SwipeableWrapper>
      </View>
      {type && (
        <CategoryBottomSheet
          visible={categoryBottomSheet}
          onDismiss={() => {
            setType(undefined);
            setCategoryBottomSheet(false);
          }}
          onSubmit={async (val) => {
            if (type == "add") {
              await newSubHandler(val);
            } else {
              await editHandler(val);
            }
          }}
          loading={loading || loading2 || loading3}
          type={type}
          value={type == "edit" ? item.name : undefined}
        />
      )}
    </>
  );
}
