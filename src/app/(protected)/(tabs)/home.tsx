import CreateButton from "@/components/custom/CreateButton";
import DiscoverProperties from "@/components/home/DiscoverProperties";
import { Box, View } from "@/components/ui";
import { ListRenderItem, RefreshControl } from "react-native";
import ShortletProperties from "@/components/home/shortlet";
import FeaturedProperties from "@/components/home/featured";
import ApartmentProperties from "@/components/home/recent";
import Lands from "@/components/home/lands";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import NearbyProperties from "@/components/home/topLocations";
import useGetLocation from "@/hooks/useGetLocation";
import { useQueryClient } from "@tanstack/react-query";
const MAP_HEIGHT = 400;

const Separator = () => (
  <View style={[{ height: 1 }]} className="bg-background" />
);

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const { location, retryGetLocation } = useGetLocation();
  const [refreshing, setRefreshing] = React.useState(false);
  const feedList = React.useMemo(() => {
    const topLocations = {
      id: "locations",
      type: "Locations",
    } as any;
    const featured = {
      id: "featured",
      type: "Featured",
    } as any;
    const shortlets = {
      id: "shortlet",
      type: "Shortlet",
    } as any;
    const apartment = {
      id: "apartment",
      type: "Apartments",
    } as any;
    const lands = {
      id: "lands",
      type: "Lands",
    } as any;
    const bottomPlaceHolder = {
      id: "bottomPlaceHolder",
      type: "bottomPlaceHolder",
    } as any;
    return [
      topLocations,
      featured,
      shortlets,
      apartment,
      lands,
      bottomPlaceHolder,
    ];
  }, []);
  type FeedList = any;
  const renderItem: ListRenderItem<FeedList> = useCallback(
    ({ item }) => {
      if (item.id === "locations") {
        return (
          <NearbyProperties
            latitude={location?.latitude || 0}
            longitude={location?.longitude || 0}
          />
        );
      }
      if (item.id === "featured") {
        return <FeaturedProperties />;
      }
      if (item.id === "shortlet") {
        return <ShortletProperties />;
      }
      if (item.id === "apartment") {
        return <ApartmentProperties />;
      }
      if (item.id === "lands") {
        return <Lands />;
      }
      if (item.id === "bottomPlaceHolder") {
        return <View className="h-24" />;
      }
      return <View></View>;
    },
    [location],
  );
  const onNewChat = () => {
    router.push("/start");
  };
  useEffect(() => {
    retryGetLocation();
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["home-properties"] });
      await queryClient.invalidateQueries({ queryKey: ["featured"] });
      await queryClient.invalidateQueries({ queryKey: ["shortlet"] });
      await queryClient.invalidateQueries({ queryKey: ["trending-lands"] });
      await queryClient.invalidateQueries({ queryKey: ["latest"] });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);
  return (
    <>
      <Box className="flex-1">
        <FlashList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <DiscoverProperties
              latitude={location?.latitude || 0}
              longitude={location?.longitude || 0}
              mapHeight={MAP_HEIGHT}
            />
          }
          getItemType={(item) => item.id}
          showsVerticalScrollIndicator={false}
          data={feedList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem as any}
          ItemSeparatorComponent={Separator}
        />
      </Box>
      <CreateButton className="" onPress={onNewChat} />
    </>
  );
}
