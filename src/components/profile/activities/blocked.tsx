import { getAgents } from "@/actions/agent";
import BackgroundView from "@/components/layouts/BackgroundView";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import VerticalAgentLoaderWrapper from "@/components/loaders/VerticalAgentLoader";
import ReelAgentListItem from "@/components/reel/ReelAgentListItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import { Dimensions, RefreshControl } from "react-native";

const { height, width } = Dimensions.get("window");
function BlockedList({ userId }: { userId: string }) {
  const {
    data,
    refetch,
    isLoading: loading,
    isRefetching: fetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["blocked"],
    queryFn: ({ pageParam = 1 }) => getAgents({ pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
  const agents = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
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
        renderItem={({ item }) => <ReelAgentListItem account={item} />}
        ItemSeparatorComponent={() => <View className="h-1" />}
        contentContainerStyle={{ paddingTop: 20 }}
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
    </VerticalAgentLoaderWrapper>
  );
}
export default memo(BlockedList);
