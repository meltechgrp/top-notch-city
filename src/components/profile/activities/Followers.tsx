import { fetchFollowersAgents } from "@/actions/user";
import { FilterComponent } from "@/components/admin/shared/FilterComponent";
import VerticalAgentLoaderWrapper from "@/components/loaders/VerticalAgentLoader";
import { UserListItem } from "@/components/profile/activities/UserListItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react-native";
import { memo, useMemo, useState } from "react";
import { RefreshControl } from "react-native";

function FollowersList({ userId }: { userId: string }) {
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["followers"],
    queryFn: () => fetchFollowersAgents({ agent_id: userId }),
  });
  const followers = useMemo(() => data?.followers || [], [data]);

  const filteredData = useMemo(() => {
    let filtered = followers;

    if (search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filtered = filtered.filter(
        (u) => regex.test(u.first_name) || regex.test(u.last_name)
      );
    }
    return filtered;
  }, [followers, search]);
  const headerComponent = useMemo(() => {
    return (
      <FilterComponent
        search={search}
        onSearch={setSearch}
        className={cn("mt-2", followers?.length < 1 && " hidden")}
        searchPlaceholder="Search by name"
      />
    );
  }, [search, setSearch]);
  return (
    <VerticalAgentLoaderWrapper loading={isLoading || false}>
      <FlashList
        data={filteredData}
        refreshControl={
          <RefreshControl
            progressViewOffset={30}
            colors={["#fff"]}
            refreshing={false}
            onRefresh={refetch}
          />
        }
        ListHeaderComponent={headerComponent}
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserListItem user={item} />}
        ItemSeparatorComponent={() => <View className="h-1" />}
        ListEmptyComponent={() => (
          <MiniEmptyState
            icon={Users}
            className="mt-8"
            title="No followers Found"
            description="Followers will be displayed here"
          />
        )}
      />
    </VerticalAgentLoaderWrapper>
  );
}
export default memo(FollowersList);
