import { View } from "@/components/ui";
import { RefreshControl } from "react-native-gesture-handler";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropertyListItem from "./PropertyListItem";
import { useRouter } from "expo-router";
import { cn } from "@/lib/utils";
import VerticalPropertyLoaderWrapper from "@/components/loaders/VerticalPropertyLoader";
import { EmptyState } from "@/components/property/EmptyPropertyCard";
import { House } from "lucide-react-native";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";
import { buildListQuery } from "@/store/searchStore";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { InteractionManager } from "react-native";

interface Props {
  className?: string;
  search?: string;
  tab?: string;
  isEmptyTitle?: string;
  showLike?: boolean;
  isAdmin?: boolean;
  agentId?: string;
  scrollEnabled?: boolean;
  isHorizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  isLoading?: boolean;
  isRefetching?: boolean;
  perPage?: number;
  page?: number;
  showStatus?: boolean;
  properties: any[];
  total: any;
  disableHeader?: boolean;
  refetch: () => Promise<any>;
  fetchPrevPage?: React.Dispatch<React.SetStateAction<number>>;
  fetchNextPage?: React.Dispatch<React.SetStateAction<number>>;
  headerTopComponent?: any;
  headerHeight?: number;
  ListEmptyComponent?: ReactNode;
  onPress?: (data: Props["properties"][0]) => void;
}
const VerticalProperties = forwardRef<any, Props>(function VerticalProperties(
  {
    scrollEnabled = true,
    properties,
    isLoading,
    showsVerticalScrollIndicator = false,
    refetch,
    fetchNextPage,
    isHorizontal = false,
    headerTopComponent,
    disableHeader,
    className,
    onPress,
    headerHeight,
    isEmptyTitle,
    perPage = 10,
    page = 1,
    showStatus = false,
    ListEmptyComponent,
    isRefetching,
    showLike = true,
    total,
    fetchPrevPage,
    tab,
    search,
  },
  ref
) {
  const listRef = useRef<FlashListRef<any>>(null);
  const router = useRouter();
  const loadingNextPageRef = useRef(false);
  const prevLength = useRef(0);
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    try {
      setRefreshing(true);
      await refetch();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }
  const hasNextPage = useMemo(() => {
    return page * perPage < total;
  }, [page, perPage, total]);
  const hasPrevPage = useMemo(() => {
    return page > 1;
  }, [page]);
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <PropertyListItem
          onPress={(data: any) => {
            if (onPress) return onPress(data);
            router.push({
              pathname: `/property/[propertyId]`,
              params: {
                propertyId: data.slug,
              },
            });
          }}
          isList={true}
          showLike={showLike}
          showStatus={showStatus}
          isHorizontal={isHorizontal}
          property={item}
          rounded={true}
        />
      );
    },
    [onPress, router, showStatus, isHorizontal]
  );
  useEffect(() => {
    if (
      properties?.length &&
      properties.length !== prevLength.current &&
      page == 1
    ) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      });
    }
    prevLength.current = properties?.length || 0;
  }, [properties, page]);
  return (
    <VerticalPropertyLoaderWrapper
      className={className}
      headerHeight={headerHeight}
      loading={isLoading || false}
    >
      <FlashList
        data={properties}
        ref={listRef}
        renderItem={renderItem}
        scrollEnabled={scrollEnabled}
        horizontal={isHorizontal}
        refreshing={refreshing}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        className={"flex-1"}
        contentContainerClassName={cn("", className)}
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
        keyExtractor={(item) => item.id}
        onStartReached={() => {
          if (hasPrevPage) fetchPrevPage?.((p) => p - 1);
        }}
        onEndReached={() => {
          if (!hasNextPage || loadingNextPageRef.current) return;

          loadingNextPageRef.current = true;
          fetchNextPage?.((p) => p + 1);

          setTimeout(() => {
            loadingNextPageRef.current = false;
          }, 300);
        }}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={() => (
          <>
            {ListEmptyComponent ? (
              ListEmptyComponent
            ) : (
              <EmptyState
                icon={House}
                title="No Properties Found"
                description="You're all caught up. New properties will appear here soon."
                buttonLabel="Try again"
                onPress={refetch}
              />
            )}
          </>
        )}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        removeClippedSubviews={false}
      />
    </VerticalPropertyLoaderWrapper>
  );
});

const enhance = withObservables(
  ["agentId", "role", "search", "tab", "page", "perPage"],
  ({ agentId, role, search, tab, page = 1, perPage = 10 }) => {
    return {
      properties: database.get("properties").query(
        ...buildListQuery({
          filter: search,
          role: role,
          agentId: agentId,
          tab: tab,
        }),
        Q.sortBy("updated_at", Q.desc),
        Q.take(page * perPage)
      ),
      total: database
        .get("properties")
        .query(
          ...buildListQuery({
            filter: search,
            role: role,
            agentId: agentId,
            tab: tab,
          })
        )
        .observeCount(),
    };
  }
);

export default enhance(VerticalProperties);
