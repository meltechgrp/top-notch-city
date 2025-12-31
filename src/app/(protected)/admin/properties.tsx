import { Box, View } from "@/components/ui";
import FilterComponent from "@/components/admin/shared/FilterComponent";
import { useEffect, useState } from "react";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useMe } from "@/hooks/useMe";
import { usePropertyFeedSync } from "@/db/queries/syncPropertyFeed";

export default function AdminProperties() {
  const { resync } = usePropertyFeedSync(false);
  const [search, setSearch] = useState("");
  const { me } = useMe();
  const debouncedSearch = useDebouncedValue(search, 400);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);
  return (
    <>
      <Box className=" flex-1 px-2 pt-2">
        <FilterComponent
          search={search}
          onSearch={setSearch}
          tab={activeTab}
          filter={debouncedSearch}
          showTabs={true}
          onUpdate={setActiveTab}
          searchPlaceholder="Search by location or category"
        />
        <View className="flex-1">
          <VerticalProperties
            showStatus
            showLike={false}
            role={me?.role}
            className="pb-40"
            search={debouncedSearch}
            tab={activeTab}
            perPage={10}
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
