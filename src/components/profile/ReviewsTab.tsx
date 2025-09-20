import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { NativeScrollEvent, View } from "react-native";
import { SharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import { RefreshControl } from "react-native-gesture-handler";
import { AnimatedFlashList } from "@/components/shared/AnimatedFlashList";
import { cn } from "@/lib/utils";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";

type IProps = {
  profileId: string;
  onScroll?: (e: NativeScrollEvent) => any;
  headerHeight: number;
  scrollElRef: any;
  listRef: any;
  scrollY?: SharedValue<number>;
  className?: string;
};
const ReviewsTabView = forwardRef<any, IProps>(function ReviewsTabView(
  { scrollY, headerHeight, scrollElRef, className },
  ref
) {
  const [refreshing, setRefreshing] = useState(false);

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
      setRefreshing(true);
      // await refetch();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
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
      return <View></View>;
    },
    []
  );
  return (
    <>
      <View className="flex-1 p-4">
        <AnimatedFlashList
          data={[]}
          renderItem={renderItem}
          refreshing={refreshing}
          onScroll={scrollHandler}
          className={"flex-1"}
          contentContainerClassName={cn("", className)}
          ref={scrollElRef}
          ItemSeparatorComponent={() => <View className={"h-5"} />}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingTop: headerHeight }}
          // onEndReached={() => {
          //   if (hasNextPage && !isLoading) fetchNextPage?.();
          // }}
          onEndReachedThreshold={0.2}
          contentInsetAdjustmentBehavior="automatic"
          ListEmptyComponent={() => (
            <MiniEmptyState className=" mt-10" title={"No review found"} />
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

export default ReviewsTabView;
