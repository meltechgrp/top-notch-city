import { View } from "@/components/ui";
import { RefreshControl } from "react-native-gesture-handler";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import PropertyListItem from "./PropertyListItem";
import { useRouter } from "expo-router";
import { cn } from "@/lib/utils";
import VerticalPropertyLoaderWrapper from "@/components/loaders/VerticalPropertyLoader";
import { EmptyState } from "@/components/property/EmptyPropertyCard";
import { House } from "lucide-react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { toUiProperties, UiProperty } from "@/lib/propertyAdapter";

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
  properties?: UiProperty[];
  total?: number;
  disableHeader?: boolean;
  refetch?: () => Promise<any>;
  fetchPrevPage?: React.Dispatch<React.SetStateAction<number>>;
  fetchNextPage?: React.Dispatch<React.SetStateAction<number>>;
  headerTopComponent?: any;
  headerHeight?: number;
  ListEmptyComponent?: ReactNode;
  onPress?: (data: UiProperty) => void;
  likeQueryKey?: unknown[];
  role?: "user" | "agent" | "admin" | "staff" | "staff_agent";
}

const VerticalProperties = forwardRef<any, Props>(function VerticalProperties(
  {
    scrollEnabled = true,
    properties: propProperties,
    isLoading: propLoading,
    showsVerticalScrollIndicator = false,
    refetch: propRefetch,
    fetchNextPage: propFetchNextPage,
    isHorizontal = false,
    headerTopComponent,
    disableHeader,
    className,
    onPress,
    headerHeight,
    perPage = 10,
    showStatus = false,
    ListEmptyComponent,
    isRefetching: propRefetching,
    showLike = true,
    likeQueryKey,
    tab,
    search,
    agentId,
    role,
  },
  ref,
) {
  const listRef = useRef<FlashListRef<any>>(null);
  const router = useRouter();
  const queryType =
    role === "admin" ? "admin" : agentId ? "agent-property" : "latest";
  const defaultLikeQueryKey = useMemo(() => {
    if (likeQueryKey) return likeQueryKey;
    if (propProperties) return undefined;
    if (queryType === "admin") {
      return ["admin-properties", tab, search, agentId];
    }
    if (queryType === "agent-property") {
      return ["agent-properties", agentId, tab, search];
    }
    return ["latest"];
  }, [agentId, likeQueryKey, propProperties, queryType, search, tab]);
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({
    type: queryType,
    profileId: agentId,
    agentId,
    search,
    status: tab,
    perPage,
    enabled: !propProperties,
  });

  const queriedProperties = useMemo(
    () => toUiProperties(data?.pages.flatMap((page) => page.results) ?? []),
    [data],
  );
  const properties = propProperties ?? queriedProperties;
  const loading = propLoading ?? isLoading;
  const refreshing = propRefetching ?? isRefetching;
  const refresh = propRefetch ?? (async () => void refetch());

  const renderItem = useCallback(
    ({ item }: { item: UiProperty; index: number }) => (
      <PropertyListItem
        onPress={(data) => {
          if (onPress) return onPress(data);
          router.push({
            pathname: `/property/[propertyId]`,
            params: {
              propertyId: data.slug || data.property_server_id,
            },
          });
        }}
        isList={true}
        showLike={showLike}
        showStatus={showStatus}
        isHorizontal={isHorizontal}
        property={item}
        likeQueryKey={defaultLikeQueryKey}
        rounded={true}
      />
    ),
    [
      defaultLikeQueryKey,
      onPress,
      router,
      showStatus,
      isHorizontal,
      showLike,
    ],
  );

  return (
    <VerticalPropertyLoaderWrapper
      className={className}
      headerHeight={headerHeight}
      loading={loading || false}
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
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          ) : undefined
        }
        contentContainerStyle={{ paddingTop: headerHeight }}
        ListHeaderComponent={
          !isHorizontal && !disableHeader ? (
            <>{headerTopComponent}</>
          ) : undefined
        }
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (propFetchNextPage) {
            propFetchNextPage((p) => p + 1);
            return;
          }
          if (!hasNextPage || isFetchingNextPage) return;
          void fetchNextPage();
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
                onPress={refresh}
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

export default VerticalProperties;
