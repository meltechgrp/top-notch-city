import { fetchAllCategories } from "@/actions/property/category";
import CategoryBottomSheet from "@/components/admin/properties/CategoryBottomSheet";
import CategoryItem from "@/components/admin/properties/CategoryItem";
import SubCategoryItem from "@/components/admin/properties/SubCategoryItem";
import AdminCreateButton from "@/components/admin/shared/AdminCreateButton";
import BeachPersonWaterParasolIcon from "@/components/icons/BeachPersonWaterParasolIcon";
import EmptyStateWrapper from "@/components/shared/EmptyStateWrapper";
import { Box, Heading, View } from "@/components/ui";
import { useCategoryMutations } from "@/tanstack/mutations/useCategoryMutations";
import { useCategoryQueries } from "@/tanstack/queries/useCategoryQueries";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl } from "react-native";

type FlatItem = {
  type: "category" | "subcategory";
  id: string;
  name: string;
  categoryId?: string;
};

export default function Categories() {
  const [refreshing, setRefreshing] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const { subcategoriesData, refetch, loading } = useCategoryQueries();
  const { data: allCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });

  const {
    addCategoryMutation: { mutateAsync: addCategory, isPending, isSuccess },
  } = useCategoryMutations();

  const uncategorizedCategories = useMemo(() => {
    const usedCategoryIds = new Set(
      subcategoriesData?.map(({ category }) => category.id)
    );

    return (
      allCategories
        ?.filter((cat) => !usedCategoryIds.has(cat.id))
        .map((cat) => ({
          category: cat,
          data: [],
        })) || []
    );
  }, [allCategories, subcategoriesData]);

  const flatData = useMemo(() => {
    if (!subcategoriesData) return [];

    return [...uncategorizedCategories, ...subcategoriesData].flatMap(
      ({ category, data }) => [
        {
          type: "category",
          id: category.id,
          name: category.name,
        },
        ...data.map((sub) => ({
          type: "subcategory",
          id: sub.id,
          name: sub.name,
          categoryId: category.id,
        })),
      ]
    );
  }, [subcategoriesData, uncategorizedCategories]) as FlatItem[];

  const handleCreateCategory = async (name: string) => {
    await addCategory({ name });
    refetch();
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setShowBottomSheet(false);
    }
  }, [isSuccess]);

  return (
    <Box className="flex-1">
      <View className="flex-1 py-px">
        <EmptyStateWrapper
          isEmpty={!flatData.length}
          loading={loading}
          illustration={<BeachPersonWaterParasolIcon />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          cta={
            <View className="items-center gap-2 px-12">
              <Heading size="xl" className="font-heading">
                No category yet
              </Heading>
            </View>
          }
          contentWrapperClassName="relative -top-24"
        >
          <FlashList
            data={flatData}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            renderItem={({ item }) => {
              if (item.type === "category") {
                return (
                  <CategoryItem
                    className="mt-8 rounded-t-xl"
                    item={{ id: item.id, name: item.name }}
                  />
                );
              }

              if (item.type === "subcategory") {
                return (
                  <SubCategoryItem
                    categoryId={item.categoryId!}
                    item={{ id: item.id, name: item.name }}
                  />
                );
              }

              return null;
            }}
            estimatedItemSize={80}
            contentContainerStyle={{
              paddingBottom: 120,
              paddingHorizontal: 16,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        </EmptyStateWrapper>
      </View>

      <AdminCreateButton solo onPress={() => setShowBottomSheet(true)} />

      {showBottomSheet && (
        <CategoryBottomSheet
          visible={showBottomSheet}
          onDismiss={() => setShowBottomSheet(false)}
          onSubmit={handleCreateCategory}
          loading={isPending}
          type="add"
        />
      )}
    </Box>
  );
}
