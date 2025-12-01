import UserListItem from "@/components/admin/users/UserListItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, View } from "@/components/ui";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import eventBus from "@/lib/eventBus";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { RefreshControl } from "react-native";
import { FilterComponent } from "@/components/admin/shared/FilterComponent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "@/actions/user";
import { router } from "expo-router";

export default function Users() {
  const [refreshing, setRefreshing] = useState(false);
  const [actveTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const { data, refetch, hasNextPage, isRefetching, fetchNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["users"],
      queryFn: ({ pageParam = 1 }) => getUsers({ pageParam }),
      getNextPageParam: (lastPage) => {
        const { page, pages } = lastPage;
        return page < pages ? page + 1 : undefined;
      },
      initialPageParam: 1,
    });
  const usersData = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);
  const filteredData = useMemo(() => {
    let filtered = usersData?.slice() ?? [];

    // Filter by role
    if (actveTab !== "all") {
      if (actveTab == "verified") filtered = filtered.filter((u) => u.verified);
      else if (actveTab == "pending")
        filtered = filtered.filter((u) => !u.verified);
      else filtered = filtered.filter((u) => u.role === actveTab);
    }

    // Search by name or email
    if (search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filtered = filtered.filter(
        (u) =>
          regex.test(u.first_name) ||
          regex.test(u.last_name) ||
          regex.test(u.phone ?? "") ||
          regex.test(u.email)
      );
    }

    return filtered;
  }, [usersData, actveTab, search]);
  const tabs = useMemo(() => {
    const all = usersData.length;
    const verified = usersData.filter((user) => user.verified).length;
    const pending = usersData.filter((user) => !user.verified).length;
    const agents = usersData.filter((user) => user.role === "agent").length;
    const admins = usersData.filter((user) => user.role === "admin").length;
    const users = usersData.filter((user) => user.role === "user").length;

    return [
      { title: "all", total: all },
      { title: "pending", total: pending },
      { title: "verified", total: verified },
      { title: "agent", total: agents },
      { title: "admin", total: admins },
      { title: "user", total: users },
    ];
  }, [usersData]);
  const headerComponent = useMemo(() => {
    return (
      <FilterComponent
        search={search}
        onSearch={setSearch}
        onUpdate={setActiveTab}
        tabs={tabs}
        tab={actveTab}
      />
    );
  }, [tabs, actveTab, search, setSearch]);

  useRefreshOnFocus(refetch);
  return (
    <Box className=" flex-1 px-2 pt-2">
      <View className="flex-1">
        <FlashList
          data={filteredData}
          keyExtractor={(item) => item.id}
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          contentContainerClassName="pb-40"
          ListEmptyComponent={<MiniEmptyState title="No user found" />}
          ItemSeparatorComponent={() => <View className="h-2" />}
          onEndReached={() => {
            if (hasNextPage && !isLoading) fetchNextPage();
          }}
          renderItem={({ item }) => (
            <UserListItem
              user={item}
              onPress={(user) => {
                router.push({
                  pathname: "/admin/users/[userId]",
                  params: { userId: user.id },
                });
              }}
            />
          )}
          ListHeaderComponent={headerComponent}
        />
      </View>
    </Box>
  );
}
