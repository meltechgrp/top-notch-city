import { fetchFollowedAgents } from "@/actions/user";
import Users from "@/app/(protected)/admin/users";
import VerticalAgentLoaderWrapper from "@/components/loaders/VerticalAgentLoader";
import AgentListItem from "@/components/profile/activities/AgentlistItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import { RefreshControl } from "react-native";

function FollowingList({ userId }: { userId: string }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["following"],
    queryFn: fetchFollowedAgents,
  });
  const agents = useMemo(() => data?.followed_agents || [], [data]);
  return (
    <VerticalAgentLoaderWrapper headerHeight={0} loading={isLoading || false}>
      <FlashList
        data={agents}
        refreshControl={
          <RefreshControl
            colors={["#fff"]}
            refreshing={false}
            onRefresh={refetch}
          />
        }
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
