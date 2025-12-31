import { Box, View } from "@/components/ui";
import { useEffect, useState } from "react";
import VerticalProperties from "@/components/property/VerticalProperties";
import FilterComponent from "@/components/admin/shared/FilterComponent";
import { useMe } from "@/hooks/useMe";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePropertyFeedSync } from "@/db/queries/syncPropertyFeed";

export default function PendingProperties() {
  const { resync } = usePropertyFeedSync(false);
  const [search, setSearch] = useState("");
  const { me } = useMe();
  const debouncedSearch = useDebouncedValue(search, 400);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);
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
            tab={"pending"}
            page={page}
            refetch={resync}
            fetchNextPage={setPage}
            fetchPrevPage={setPage}
          />
        </View>
      </Box>
    </>
  );
}
