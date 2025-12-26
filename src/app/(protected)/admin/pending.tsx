import { Box, View } from "@/components/ui";
import { useMemo } from "react";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";

export default function PendingProperties() {
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({ type: "pending" });
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
            hasNextPage={hasNextPage}
            className="pb-40"
            refetch={refetch}
            fetchNextPage={fetchNextPage}
          />
        </View>
      </Box>
    </>
  );
}
