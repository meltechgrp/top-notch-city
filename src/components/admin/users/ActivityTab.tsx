import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { NativeScrollEvent, View } from "react-native";
import { SharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import { RefreshControl } from "react-native-gesture-handler";
import { AnimatedFlashList } from "@/components/shared/AnimatedFlashList";
import { cn } from "@/lib/utils";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserActivities } from "@/actions/user";
import ActivityListItem from "@/components/admin/users/ActivityListItem";

type IProps = {
  profileId: string;
  onScroll?: (e: NativeScrollEvent) => any;
  headerHeight: number;
  scrollElRef: any;
  listRef: any;
  scrollY?: SharedValue<number>;
  className?: string;
};
const ActivityTabView = forwardRef<any, IProps>(function ActivityTabView(
  { scrollY, headerHeight, scrollElRef, className, profileId },
  ref
) {
  const { data, isLoading, refetch, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["activities", profileId],
      queryFn: ({ pageParam = 1 }) =>
        getUserActivities({ userId: profileId!, pageParam }),
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
  const onScrollToTop = useCallback(() => {
    scrollElRef?.current?.scrollToOffset({
      animated: true,
      offset: headerHeight || 0,
    });
  }, [scrollElRef, headerHeight]);

  useImperativeHandle(ref, () => ({
    scrollToTop: onScrollToTop,
  }));

  async function onRefresh() {
    try {
      await refetch();
    } catch (error) {}
  }
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      if (scrollY) {
        scrollY.value = event.contentOffset.y;
      }
    },
  });
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return <ActivityListItem activity={item} onPress={(data) => {}} />;
    },
    []
  );
  return (
    <>
      <View className="flex-1 p-4">
        <AnimatedFlashList
          data={activities}
          renderItem={renderItem}
          refreshing={isFetching}
          onScroll={scrollHandler}
          className={"flex-1"}
          contentContainerClassName={cn("pb-40", className)}
          ref={scrollElRef}
          ItemSeparatorComponent={() => <View className={"h-5"} />}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingTop: headerHeight }}
          onEndReached={() => {
            if (hasNextPage && (!isLoading || !isFetching)) fetchNextPage?.();
          }}
          onEndReachedThreshold={0.2}
          contentInsetAdjustmentBehavior="automatic"
          ListEmptyComponent={() => (
            <MiniEmptyState className=" mt-10" title={"No activities found"} />
          )}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          removeClippedSubviews={false}
        />
      </View>
    </>
  );
});

export default ActivityTabView;
