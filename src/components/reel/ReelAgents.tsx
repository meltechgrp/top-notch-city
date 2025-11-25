import { getAgents } from "@/actions/agent";
import BackgroundView from "@/components/layouts/BackgroundView";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import VerticalAgentLoaderWrapper from "@/components/loaders/VerticalAgentLoader";
import ReelAgentListItem from "@/components/reel/ReelAgentListItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UserCog } from "lucide-react-native";
import { memo, useMemo } from "react";
import { Dimensions, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");
function AgentList({ visible }: { visible: boolean }) {
  const {
    data,
    refetch,
    isLoading: loading,
    isRefetching: fetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["agents"],
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
    <SafeAreaView edges={["top"]} className="flex-1 mt-12 android:pt-12">
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
          onEndReached={() => {
            if (hasNextPage && !loading) fetchNextPage?.();
          }}
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
                <MiniEmptyState icon={UserCog} title="No Agent Found" />
              </BackgroundView>
            )
          }
        />
      </VerticalAgentLoaderWrapper>
    </SafeAreaView>
  );
}
export default memo(AgentList);
