import { Box, View } from "@/components/ui";
import FilterComponent from "@/components/admin/shared/FilterComponent";
import { useEffect, useState } from "react";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useMe } from "@/hooks/useMe";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";

export default function AdminProperties() {
  const [search, setSearch] = useState("");
  const { me } = useMe();
  const debouncedSearch = useDebouncedValue(search, 400);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const { data, refetch } = useInfinityQueries({
    type: "admin",
    search: debouncedSearch,
    status: activeTab,
    perPage: 10,
  });
  const counts = data?.pages?.[0]?.status_counts;
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
          all={counts?.all ?? data?.pages?.[0]?.total ?? 0}
          pending={counts?.pending ?? 0}
          approved={counts?.approved ?? 0}
          rejected={counts?.rejected ?? 0}
          flagged={counts?.flagged ?? 0}
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
            refetch={refetch as any}
            fetchNextPage={setPage}
            fetchPrevPage={setPage}
          />
        </View>
      </Box>
    </>
  );
}
