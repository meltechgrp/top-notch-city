import { fetchFollowedAgents } from "@/actions/user";
import { FilterComponent } from "@/components/admin/shared/FilterComponent";
import VerticalAgentLoaderWrapper from "@/components/loaders/VerticalAgentLoader";
import AgentListItem from "@/components/profile/activities/AgentlistItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react-native";
import { memo, useMemo, useState } from "react";
import { RefreshControl } from "react-native";

function FollowingList({ userId }: { userId: string }) {
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["following"],
    queryFn: fetchFollowedAgents,
  });
  const agents = useMemo(() => data?.followed_agents || [], [data]);
  const filteredData = useMemo(() => {
    let filtered = agents;

    if (search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filtered = filtered.filter(
        (u) =>
          regex.test(u.agent.first_name) ||
          regex.test(u.agent.last_name) ||
          regex.test(u.agent.email) ||
          regex.test(u.agent.phone)
      );
    }
    return filtered;
  }, [agents, search]);
  const headerComponent = useMemo(() => {
    return (
      <FilterComponent
        search={search}
        onSearch={setSearch}
        className="mt-2"
        searchPlaceholder="Search by name"
      />
    );
  }, [search, setSearch]);
  return (
    <VerticalAgentLoaderWrapper headerHeight={0} loading={isLoading || false}>
      <FlashList
        data={filteredData}
        refreshControl={
          <RefreshControl
            colors={["#fff"]}
            refreshing={false}
            onRefresh={refetch}
          />
        }
        ListHeaderComponent={headerComponent}
        decelerationRate="fast"
        contentContainerClassName="px-1"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AgentListItem queryKey={["following"]} data={item} />
        )}
        ItemSeparatorComponent={() => <View className="h-1" />}
        ListEmptyComponent={() => (
          <MiniEmptyState
            icon={Users}
            className="mt-8"
            title="No followers Found"
            description="Become an agent to see your followers"
          />
        )}
      />
    </VerticalAgentLoaderWrapper>
  );
}
export default memo(FollowingList);
