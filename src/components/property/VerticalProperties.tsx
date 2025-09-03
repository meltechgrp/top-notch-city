import { View } from "@/components/ui";
import { RefreshControl } from "react-native-gesture-handler";
import { NativeScrollEvent } from "react-native";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import PropertyListItem from "./PropertyListItem";
import { MiniEmptyState } from "../shared/MiniEmptyState";
import { useRouter } from "expo-router";
import { useAnimatedScrollHandler } from "react-native-reanimated";
import { AnimatedFlashList } from "../shared/AnimatedFlashList";
import FullHeightLoaderWrapper from "../loaders/FullHeightLoaderWrapper";
import { cn, deduplicate } from "@/lib/utils";
import LoadingLine from "@/components/custom/HorizontalLoader";

interface Props {
  category?: string;
  className?: string;
  isEmptyTitle?: string;
  scrollY?: any;
  disableCount?: boolean;
  isAdmin?: boolean;
  profileId?: string;
  onScroll?: (e: NativeScrollEvent) => any;
  scrollEnabled?: boolean;
  isHorizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  isLoading?: boolean;
  hasNextPage?: boolean;
  showStatus?: boolean;
  data: Property[];
  scrollElRef?: any;
  disableHeader?: boolean;
  refetch: () => Promise<any>;
  fetchNextPage?: () => Promise<any>;
  headerTopComponent?: any;
  headerHeight?: number;
  listRef?: any;
  ListEmptyComponent?: ReactNode;
  onPress?: (data: Props["data"][0]) => void;
}
const VerticalProperties = forwardRef<any, Props>(function VerticalProperties(
  {
    category,
    scrollY,
    disableCount = false,
    scrollEnabled = true,
    data,
    isLoading,
    showsVerticalScrollIndicator = false,
    refetch,
    fetchNextPage,
    isHorizontal = false,
    headerTopComponent,
    disableHeader,
    isAdmin,
    onScroll,
    className,
    onPress,
    scrollElRef,
    headerHeight,
    isEmptyTitle,
    hasNextPage,
    showStatus = false,
    ListEmptyComponent,
  },
  ref
) {
  const router = useRouter();
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
      await refetch();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <PropertyListItem
          onPress={(data) => {
            if (onPress) return onPress(data);
            router.push({
              pathname: `/property/[propertyId]`,
              params: {
                propertyId: data.id,
              },
            });
          }}
          isList={true}
          showStatus={showStatus}
          isHorizontal={isHorizontal}
          data={item}
          rounded={true}
        />
      );
    },
    [onPress, router, showStatus, isHorizontal]
  );
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      if (scrollY) {
        scrollY.value = event.contentOffset.y;
      }
    },
  });

  return (
    <FullHeightLoaderWrapper loading={isLoading || false}>
      <AnimatedFlashList
        data={deduplicate(data, "id")}
        renderItem={renderItem}
        scrollEnabled={scrollEnabled}
        horizontal={isHorizontal}
        refreshing={refreshing}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onScroll={scrollHandler}
        className={"flex-1"}
        contentContainerClassName={cn("", className)}
        ref={scrollElRef}
        ItemSeparatorComponent={() => <View className={"h-5"} />}
        scrollEventThrottle={16}
        refreshControl={
          scrollEnabled ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        contentContainerStyle={{ paddingTop: headerHeight }}
        ListHeaderComponent={
          !isHorizontal && !disableHeader ? (
            <>{headerTopComponent}</>
          ) : undefined
        }
        keyExtractor={(item: any, index) => item.id}
        estimatedItemSize={340}
        onEndReached={() => {
          if (hasNextPage && !isLoading) fetchNextPage?.();
        }}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={() => (
          <>
            {ListEmptyComponent ? (
              ListEmptyComponent
            ) : (
              <MiniEmptyState
                className=" mt-10"
                title={isEmptyTitle || "No property found"}
              />
            )}
          </>
        )}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        removeClippedSubviews={false}
        ListFooterComponent={<LoadingLine />}
      />
    </FullHeightLoaderWrapper>
  );
});

export default VerticalProperties;
