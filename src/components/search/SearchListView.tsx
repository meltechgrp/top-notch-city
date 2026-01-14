import React, { memo, useCallback } from "react";
import { RefreshControl, View } from "react-native";
import { Property } from "@/db/models/properties";
import { House } from "lucide-react-native";
import VerticalPropertyLoaderWrapper from "@/components/loaders/VerticalPropertyLoader";
import { FlashList } from "@shopify/flash-list";
import PropertyListItem from "@/components/property/PropertyListItem";
import { router } from "expo-router";
import { EmptyState } from "@/components/property/EmptyPropertyCard";

type IProps = {
  properties: Property[];
  isLoading: boolean;
  hasNextPage: boolean;
  refetch: () => Promise<any>;
  fetchNextPage: () => Promise<any>;
  headerOnlyHeight: number;
  setShowFilter: () => void;
};
function SearchListView(props: IProps) {
  const {
    properties,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    headerOnlyHeight,
    setShowFilter,
  } = props;
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return (
        <PropertyListItem
          onPress={(data: any) => {
            router.push({
              pathname: `/property/[propertyId]`,
              params: {
                propertyId: data.slug,
              },
            });
          }}
          isList={true}
          showLike={false}
          showStatus={false}
          property={item}
          rounded={true}
        />
      );
    },
    [router]
  );
  return (
    <>
      <View className="flex-1 px-4 bg-background">
        <VerticalPropertyLoaderWrapper
          headerHeight={headerOnlyHeight}
          loading={isLoading || false}
        >
          <FlashList
            data={properties}
            renderItem={renderItem}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            className={"flex-1"}
            ItemSeparatorComponent={() => <View className={"h-5"} />}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refetch} />
            }
            contentContainerStyle={{ paddingTop: headerOnlyHeight }}
            keyExtractor={(item) => item.id}
            onEndReached={() => {
              if (!hasNextPage) return;

              fetchNextPage();
            }}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={() => (
              <EmptyState
                icon={House}
                title="No Properties Found"
                description="You're all caught up. New properties will appear here soon."
                buttonLabel="Try again"
                onPress={refetch}
              />
            )}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            removeClippedSubviews={false}
          />
        </VerticalPropertyLoaderWrapper>
      </View>
    </>
  );
}
export default memo(SearchListView);
