import { fetchAllAmenities } from "@/actions/property/amenity";
import AmenityBottomSheet from "@/components/admin/properties/AmenityBottomSheet";
import AmenityItem from "@/components/admin/properties/amenityItem";
import AdminCreateButton from "@/components/admin/shared/AdminCreateButton";
import EmptyStateWrapper from "@/components/shared/EmptyStateWrapper";
import { Box, Heading, View } from "@/components/ui";
import { useAmenityMutations } from "@/tanstack/mutations/useAmenityMutation";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Bath } from "lucide-react-native";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";

export default function AmenitiesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["amenities"],
    queryFn: fetchAllAmenities,
  });

  const { mutateAsync, isPending, isSuccess } =
    useAmenityMutations().addAmenityMutation;
  const amenities = data || [];

  const handleCreateCategory = async (data: string) => {
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
          isEmpty={!amenities.length}
          loading={isLoading}
          illustration={<Bath />}
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
            data={amenities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AmenityItem item={item} />}
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
