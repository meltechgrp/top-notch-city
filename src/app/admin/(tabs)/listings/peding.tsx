import { Box, View } from "@/components/ui";
import { useMemo, useState } from "react";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useProductQueries } from "@/tanstack/queries/useProductQueries";
import PropertyDetailsBottomSheet from "@/components/admin/properties/PropertyDetailsBottomSheet";
import { useStore } from "@/store";

export default function PendingProperties() {
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductQueries({ type: "pending" });
  const { me } = useStore();
  const propertyData = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  return (
    <>
      <Box className=" flex-1 px-2 pt-2">
        <View className="flex-1">
          <VerticalProperties
            data={propertyData}
            isLoading={isLoading || isFetchingNextPage}
            disableHeader
            showStatus
            refetch={refetch}
            onPress={(data) => {
              setActiveProperty(data);
              setPropertyBottomSheet(true);
            }}
            fetchNextPage={fetchNextPage}
          />
        </View>
      </Box>
      {activeProperty && me && (
        <PropertyDetailsBottomSheet
          visible={propertyBottomSheet}
          property={activeProperty}
          user={me}
          onDismiss={() => setPropertyBottomSheet(false)}
        />
      )}
    </>
  );
}
