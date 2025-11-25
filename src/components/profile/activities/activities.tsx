import { getUserActivities } from "@/actions/user";
import ActivityListItem from "@/components/admin/users/ActivityListItem";
import VerticalAgentLoaderWrapper from "@/components/loaders/VerticalAgentLoader";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react-native";
import { useMemo } from "react";
import { RefreshControl } from "react-native";

export function ActivitiesList({ userId }: { userId: string }) {
  const { data, isLoading, refetch, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["activities", userId],
      queryFn: ({ pageParam = 1 }) => getUserActivities({ userId, pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, pages } = lastPage;
        return page < pages ? page + 1 : undefined;
      },
    });
  const activities = useMemo(
    () => data?.pages.flatMap((item) => item.results) || [],
    [data]
  );

  return (
    <VerticalAgentLoaderWrapper loading={isLoading || false}>
      <FlashList
        data={activities}
        refreshControl={
          <RefreshControl
            progressViewOffset={30}
            colors={["#fff"]}
            refreshing={false}
            onRefresh={refetch}
          />
        }
        decelerationRate="fast"
        contentContainerClassName="px-2"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityListItem onPress={(data) => {}} activity={item} />
        )}
        onEndReached={() => {
          if (hasNextPage && !isLoading) fetchNextPage?.();
        }}
        ItemSeparatorComponent={() => <View className="h-1" />}
        ListEmptyComponent={() => (
          <MiniEmptyState
            icon={Activity}
            title="No Activity Found"
            description="Activity will appear here soon."
            className="px-4"
          />
        )}
      />
    </VerticalAgentLoaderWrapper>
  );
}
