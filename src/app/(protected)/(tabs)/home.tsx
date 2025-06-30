import DiscoverProperties from "@/components/home/DiscoverProperties";
import TopProperties from "@/components/home/properties";
import TopLocations from "@/components/home/topLocations";
import BeachPersonWaterParasolIcon from "@/components/icons/BeachPersonWaterParasolIcon";
import { Box, Text, View } from "@/components/ui";
import eventBus from "@/lib/eventBus";
import { useStore } from "@/store";
import { useProductQueries } from "@/tanstack/queries/useProductQueries";
import { ListRenderItem } from "@shopify/flash-list";
import React, { useMemo, useState } from "react";
import { FlatList, RefreshControl } from "react-native";

export default function HomeScreen() {
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductQueries({ type: "all" });
  const me = useStore((v) => v.me);
  const [refreshing, setRefreshing] = useState(false);
  const feedList = React.useMemo(() => {
    const topLocations = {
      id: "locations",
      _typename: "Locations",
    } as any;
    // const featured = {
    // 	id: 'featured',
    // 	__typename: 'Featured',
    // } as any;
    const properties = {
      id: "properties",
      _typename: "Properties",
    } as any;
    const bottomPlaceHolder = {
      id: "bottomPlaceHolder",
      __typename: "bottomPlaceHolder",
    } as any;
    return [topLocations, properties, bottomPlaceHolder];
  }, [data]);
  type FeedList = any;
  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  async function onRefresh() {
    try {
      setRefreshing(true);
      await refetch();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }
  const renderItem: ListRenderItem<FeedList> = ({ item }) => {
    if (item.id === "locations") {
      return <TopLocations />;
    }
    // if (item.id === 'featured') {
    // 	return <FeaturedProperties />;
    // }
    if (item.id === "properties") {
      return <TopProperties data={properties} refetch={refetch} />;
    }
    if (item.id === "bottomPlaceHolder") {
      return <View className="h-24" />;
    }
    return <View></View>;
  };
  return (
    <Box className="flex-1 ">
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              onRefresh();
              eventBus.dispatchEvent("PROPERTY_HORIZONTAL_LIST_REFRESH", null);
            }}
          />
        }
        ListHeaderComponent={<DiscoverProperties />}
        showsVerticalScrollIndicator={false}
        data={feedList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem as any}
        ItemSeparatorComponent={() => (
          <View style={[{ height: 1 }]} className="bg-background" />
        )}
        ListEmptyComponent={refreshing ? null : EmptyFeed}
      />
    </Box>
  );
}

function EmptyFeed() {
  return (
    <View className="flex-1 items-center justify-center pt-16">
      <BeachPersonWaterParasolIcon width={64} height={64} />
      <Text className="text-black-900 pt-4">Wow, it's lonely here</Text>
      <Text className="text-gray-600 text-sm text-center w-11/12 mx-auto mt-1">
        Try creating a Property to feature them here.
      </Text>
    </View>
  );
}
