import { Box, View } from "@/components/ui";
import { FilterComponent } from "@/components/admin/shared/FilterComponent";
import { useMemo, useState } from "react";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useStore } from "@/store";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import PropertyDetailsBottomSheet from "@/components/admin/properties/PropertyDetailsBottomSheet";

export default function Properties() {
  const [search, setSearch] = useState("");
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);

  const [actveTab, setActiveTab] = useState("all");
  const { me } = useStore();
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({ type: "admin" });

  const propertyData = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  const filteredData = useMemo(() => {
    let filtered = propertyData;

    if (actveTab !== "all") {
      filtered = filtered.filter((u) => u.status.toLowerCase() === actveTab);
    }
    if (search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filtered = filtered.filter(
        (u) =>
          regex.test(u.title) ||
          regex.test(u.category.name) ||
          regex.test(u.subcategory.name)
      );
    }
    return filtered;
  }, [propertyData, search, actveTab]);
  const tabs = useMemo(() => {
    const all = propertyData.length;
    const rejected = propertyData.filter(
      (item) => item.status == "rejected"
    ).length;
    const approved = propertyData.filter(
      (item) => item.status === "approved"
    ).length;
    const pending = propertyData.filter(
      (item) => item.status === "pending"
    ).length;
    const sold = propertyData.filter((item) => item.status === "sold").length;
    const flagged = propertyData.filter(
      (item) => item.status === "flagged"
    ).length;

    return [
      { title: "all", total: all },
      { title: "pending", total: pending },
      { title: "approved", total: approved },
      { title: "sold", total: sold },
      { title: "rejected", total: rejected },
      { title: "flagged", total: flagged },
    ];
  }, [propertyData]);
  const headerComponent = useMemo(() => {
    return (
      <FilterComponent
        search={search}
        onSearch={setSearch}
        tabs={tabs}
        tab={actveTab}
        onUpdate={setActiveTab}
        searchPlaceholder="Search by name"
      />
    );
  }, [search, setSearch, tabs, actveTab]);
  useRefreshOnFocus(refetch);
  return (
    <>
      <Box className=" flex-1 px-2 pt-2">
        <View className="flex-1">
          <VerticalProperties
            headerTopComponent={headerComponent}
            data={filteredData}
            showStatus
            isLoading={isLoading || isFetchingNextPage}
            className="pb-40"
            onPress={(data) => {
              setActiveProperty(data);
              setPropertyBottomSheet(true);
            }}
            fetchNextPage={fetchNextPage}
            refetch={refetch}
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
