import { fetchBlockedUsers } from "@/actions/user";
import VerticalAgentLoaderWrapper from "@/components/loaders/VerticalAgentLoader";
import { BlockListItem } from "@/components/profile/activities/BlockedListItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react-native";
import { memo, useMemo } from "react";
import { RefreshControl } from "react-native";

function BlockedList({ userId }: { userId: string }) {
  const {
    data,
    refetch,
    isLoading: loading,
    isRefetching: fetching,
  } = useQuery({
    queryKey: ["blocked"],
    queryFn: () => fetchBlockedUsers(),
  });
  const agents = useMemo(() => data || [], [data]);
  return (
    <VerticalAgentLoaderWrapper loading={loading || fetching || false}>
      <FlashList
        data={agents}
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
        renderItem={({ item }) => <BlockListItem user={item} />}
        ItemSeparatorComponent={() => <View className="h-1" />}
        contentContainerStyle={{ paddingTop: 20 }}
        ListEmptyComponent={() => (
          <MiniEmptyState
            icon={Users}
            title="You haven't blocked any one yet"
            description=""
          />
        )}
      />
    </VerticalAgentLoaderWrapper>
  );
}
export default memo(BlockedList);
