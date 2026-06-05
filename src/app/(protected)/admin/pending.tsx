import { Box, View } from "@/components/ui";
import { type Dispatch, type SetStateAction, useState } from "react";
import VerticalProperties from "@/components/property/VerticalProperties";
import FilterComponent from "@/components/admin/shared/FilterComponent";
import { useMe } from "@/hooks/useMe";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { toUiProperties } from "@/lib/propertyAdapter";

export default function PendingProperties() {
  const [search, setSearch] = useState("");
  const { me } = useMe();
  const debouncedSearch = useDebouncedValue(search, 400);
  const {
    data,
    refetch,
    isLoading,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({
    type: "pending",
    search: debouncedSearch,
    perPage: 10,
  });
  const properties = toUiProperties(
    data?.pages.flatMap((page) => page.results) ?? [],
  ).filter((property) => property.status === "pending");

  return (
    <>
      <Box className=" flex-1 px-2 pt-2">
        <FilterComponent
          search={search}
          onSearch={setSearch}
          filter={debouncedSearch}
          showTabs={false}
          searchPlaceholder="Search by location or category"
        />
        <View className="flex-1">
          <VerticalProperties
            showStatus
            showLike={false}
            role={me?.role}
            className="pb-40"
            search={debouncedSearch}
            perPage={10}
            properties={properties}
            isLoading={isLoading}
            isRefetching={isRefetching}
            refetch={refetch as any}
            fetchNextPage={
              (() => {
                if (!hasNextPage || isFetchingNextPage) return;
                void fetchNextPage();
              }) as Dispatch<SetStateAction<number>>
            }
          />
        </View>
      </Box>
    </>
  );
}
