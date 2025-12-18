import { FilterComponent } from "@/components/admin/shared/FilterComponent";
import VerticalProperties from "@/components/property/VerticalProperties";
import { Box, Icon, Pressable, View } from "@/components/ui";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useStore } from "@/store";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { PlusCircle } from "lucide-react-native";
import { useMemo, useState } from "react";

export default function AgentProperties() {
  const { userId } = useGlobalSearchParams() as { userId: string };
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { me } = useStore();
  const [actveTab, setActiveTab] = useState("all");
  const { data, refetch, isLoading, fetchNextPage, hasNextPage } =
    useInfinityQueries({ type: "agent-property" });
  const list = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  const filteredData = useMemo(() => {
    let filtered = data?.pages.flatMap((page) => page.results) || [];

    if (actveTab !== "all") {
      filtered = filtered.filter((u) => u.status.toLowerCase() === actveTab);
    }
    if (search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filtered = filtered.filter(
        (u) =>
          regex.test(u.category?.name) ||
          regex.test(u.subcategory?.name) ||
          regex.test(u.purpose) ||
          regex.test(u.price.toString()) ||
          regex.test(u.status) ||
          regex.test(u.address.city) ||
          regex.test(u.address.state)
      );
    }
    return filtered;
  }, [list, search, actveTab, data]);
  const tabs = useMemo(() => {
    const all = list.length;
    const rejected = list.filter((item) => item.status == "rejected").length;
    const approved = list.filter((item) => item.status === "approved").length;
    const pending = list.filter((item) => item.status === "pending").length;
    const sold = list.filter((item) => item.status === "sold").length;
    const flagged = list.filter((item) => item.status === "flagged").length;

    return [
      { title: "all", total: all },
      { title: "pending", total: pending },
      { title: "approved", total: approved },
      { title: "sold", total: sold },
      { title: "rejected", total: rejected },
      { title: "flagged", total: flagged },
    ];
  }, [list]);
  const isOwner = useMemo(() => userId == me?.id, [me, userId]);
  useRefreshOnFocus(refetch);
  const headerComponent = useMemo(() => {
    return (
      <FilterComponent
        search={search}
        onSearch={setSearch}
        tabs={isOwner ? tabs : []}
        tab={actveTab}
        onUpdate={setActiveTab}
        searchPlaceholder="Search by location, category or price "
      />
    );
  }, [search, setSearch, tabs, isOwner, actveTab]);
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: isOwner
            ? () => (
                <View className=" flex-row">
                  <Pressable
                    className="p-2 bg-background-muted rounded-full"
                    onPress={() =>
                      router.push({
                        pathname: "/agents/[userId]/properties/add",
                        params: {
                          userId,
                        },
                      })
                    }
                  >
                    <Icon as={PlusCircle} className="w-6 text-primary h-6" />
                  </Pressable>
                </View>
              )
            : undefined,
        }}
      />
      <Box className="flex-1 px-2 py-2">
        <VerticalProperties
          isLoading={isLoading}
          data={filteredData}
          showStatus={isOwner}
          showLike={!isOwner}
          listType={["agent-property"]}
          headerTopComponent={
            filteredData.length > 0 ? headerComponent : undefined
          }
          onPress={(data) => {
            router.push({
              pathname: "/property/[propertyId]",
              params: {
                propertyId: data.id,
              },
            });
          }}
          refetch={async () => await refetch()}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          className="pb-24"
        />
      </Box>
    </>
  );
}
