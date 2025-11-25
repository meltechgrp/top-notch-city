import { fetchFollowersAgents } from "@/actions/user";
import VerticalAgentLoaderWrapper from "@/components/loaders/VerticalAgentLoader";
import { UserListItem } from "@/components/profile/activities/UserListItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react-native";
import { memo, useMemo } from "react";
import { RefreshControl } from "react-native";

function FollowersList({ userId }: { userId: string }) {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["followers"],
    queryFn: () => fetchFollowersAgents({ agent_id: userId }),
  });
  const followers = useMemo(() => data?.followers || [], [data]);
  return (
    <VerticalAgentLoaderWrapper loading={isLoading || false}>
      <FlashList
        data={followers}
        refreshControl={
          <RefreshControl
            progressViewOffset={30}
            colors={["#fff"]}
            refreshing={false}
            onRefresh={refetch}
          />
        }
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserListItem user={item} />}
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
export default memo(FollowersList);
