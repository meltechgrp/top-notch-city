import { fetchAllAmenities } from "@/actions/property/amenity";
import AmenityBottomSheet from "@/components/admin/properties/AmenityBottomSheet";
import AmenityItem from "@/components/admin/properties/amenityItem";
import AdminCreateButton from "@/components/admin/shared/AdminCreateButton";
import BeachPersonWaterParasolIcon from "@/components/icons/BeachPersonWaterParasolIcon";
import EmptyStateWrapper from "@/components/shared/EmptyStateWrapper";
import { Box, Heading, Text, View } from "@/components/ui";
import { useAmenityMutations } from "@/tanstack/mutations/useAmenityMutation";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl } from "react-native";

type FlatItem = {
  type: "category" | "subcategory";
  id: string;
  name: string;
  categoryId: string;
};

export default function AmenitiesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["amenities"],
    queryFn: fetchAllAmenities,
  });

  const { mutateAsync, isPending, isSuccess } =
    useAmenityMutations().addAmenityMutation;

  const flatAmenities = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped = data.reduce<Record<string, AmenityLabel[]>>(
      (acc, amenity) => {
        if (!acc[amenity.type]) {
          acc[amenity.type] = [];
        }
        acc[amenity.type].push(amenity);
        return acc;
      },
      {}
    );

    return Object.entries(grouped).flatMap(([typeName, items]) => [
      {
        type: "category",
        id: typeName, // Using type name as the category ID
        name: typeName,
      },
      ...items.map((item) => ({
        type: "subcategory",
        id: item.id,
        name: item.name,
        categoryId: typeName,
      })),
    ]);
  }, [data]) as FlatItem[];

  const handleCreateCategory = async (data: { name: string; type: string }) => {
    await mutateAsync(data);
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
          isEmpty={!flatAmenities.length}
          loading={isLoading}
          illustration={<BeachPersonWaterParasolIcon />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          cta={
            <View className="items-center gap-2 px-12">
              <Heading size="xl" className="font-heading">
                No amenities yet
              </Heading>
            </View>
          }
          contentWrapperClassName="relative -top-24"
        >
          <FlashList
            data={flatAmenities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              if (item.type === "category") {
                return (
                  <View
                    className={
                      "flex-1 p-6 py-4 flex-row justify-between items-center "
                    }
                  >
                    <View>
                      <Text size="md" className="capitalize">
                        {item.name} Amenities
                      </Text>
                    </View>
                  </View>
                );
              }

              if (item.type === "subcategory") {
                return <AmenityItem item={item} categoryId={item.categoryId} />;
              }

              return null;
            }}
            estimatedItemSize={80}
            contentContainerStyle={{
              paddingBottom: 120,
              paddingTop: 10,
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
        <AmenityBottomSheet
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
