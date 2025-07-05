import UserDetailsBottomSheet from "@/components/admin/users/UserBottomSheet";
import UserListItem from "@/components/admin/users/UserListItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, View } from "@/components/ui";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import eventBus from "@/lib/eventBus";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { RefreshControl } from "react-native";
import { FilterComponent } from "@/components/admin/shared/FilterComponent";
import AdminCreateButton from "@/components/admin/shared/AdminCreateButton";
import { User2, UserCog2, UserSearch } from "lucide-react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "@/actions/user";

export default function Users() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeUser, setActiveUser] = useState<Me | null>(null);
  const [userBottomSheet, setUserBottomSheet] = useState(false);
  const [actveTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const { data, refetch } = useInfiniteQuery({
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
      if (actveTab == "pending") filtered = filtered.filter((u) => !u.verified);
      else filtered = filtered.filter((u) => u.role.toLowerCase() === actveTab);
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

    return [
      { title: "all", total: all },
      { title: "pending", total: pending },
      { title: "verified", total: verified },
      { title: "agents", total: agents },
      { title: "admin", total: admins },
    ];
  }, [usersData]);
  async function onRefresh() {
    try {
      setRefreshing(true);
      await refetch();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }
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

  const BUTTONS = [
    { icon: User2, value: "user" },
    { icon: UserCog2, value: "admin" },
    { icon: UserSearch, value: "agent" },
  ];
  function handleButtonPress(val: string) {}
  useRefreshOnFocus(refetch);
  return (
    <Box className=" flex-1 px-2 pt-2">
      <View className="flex-1">
        <FlashList
          data={filteredData}
          keyExtractor={(item) => item.id}
          estimatedItemSize={200}
          keyboardDismissMode="on-drag"
          onScroll={() => eventBus.dispatchEvent("SWIPEABLE_OPEN", null)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<MiniEmptyState title="No user found" />}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <UserListItem
              user={item}
              onPress={(user) => {
                setActiveUser(user);
                setUserBottomSheet(true);
              }}
            />
          )}
          ListHeaderComponent={headerComponent}
        />
      </View>
      {activeUser && (
        <UserDetailsBottomSheet
          visible={userBottomSheet}
          user={activeUser}
          onDismiss={() => setUserBottomSheet(false)}
        />
      )}
      <AdminCreateButton buttons={BUTTONS} onPress={handleButtonPress} />
    </Box>
  );
}
