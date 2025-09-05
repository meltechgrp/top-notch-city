import { getAgents } from "@/actions/agent";
import BackgroundView from "@/components/layouts/BackgroundView";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { ReelAgentListItem } from "@/components/reel/ReelAgentListItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Dimensions, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");
export default function AgentList({ visible }: { visible: boolean }) {
  const {
    data,
    refetch,
    isLoading: loading,
    isRefetching: fetching,
  } = useQuery({
    queryKey: ["reel-agents"],
    queryFn: getAgents,
    enabled: !visible,
  });
  const agents = useMemo(() => data?.results || [], [data]);
  return (
    <SafeAreaView edges={["bottom", "top"]} className="flex-1 mt-14">
      <FlashList
        data={agents}
        estimatedItemSize={90}
        refreshControl={
          <RefreshControl
            progressViewOffset={30}
            colors={["#fff"]}
            refreshing={fetching}
            onRefresh={refetch}
          />
        }
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReelAgentListItem account={item} />}
        // onEndReached={() => {
        //   if (hasNextPage && !loading) fetchNextPage?.();
        // }}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() =>
          loading ? (
            <BackgroundView style={{ height: height }}>
              <View className="flex-1 bg-black/20 justify-center items-center">
                <SpinningLoader color="#FF4C00" size={40} />
              </View>
            </BackgroundView>
          ) : (
            <BackgroundView style={{ height: height }}>
              <MiniEmptyState title="No Agent Found" />
            </BackgroundView>
          )
        }
      />
    </SafeAreaView>
  );
}
