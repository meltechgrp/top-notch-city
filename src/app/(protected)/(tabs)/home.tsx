import CreateButton from "@/components/custom/CreateButton";
import DiscoverProperties from "@/components/home/DiscoverProperties";
import { Box, View } from "@/components/ui";
import { ListRenderItem } from "react-native";
import ShortletProperties from "@/components/home/shortlet";
import FeaturedProperties from "@/components/home/featured";
import ApartmentProperties from "@/components/home/recent";
import Lands from "@/components/home/lands";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { useCallback } from "react";
import NearbyProperties from "@/components/home/topLocations";
import { use$ } from "@legendapp/state/react";
import { mainStore } from "@/store";
const MAP_HEIGHT = 400;

export default function HomeScreen() {
  const address = use$(mainStore.address);
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
          <NearbyProperties state={address?.state || ""} location={address} />
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
    [address]
  );
  const onNewChat = () => {
    router.push("/start");
  };

  return (
    <>
      <Box className="flex-1">
        <FlashList
          // refreshControl={
          //   <RefreshControl refreshing={refetching} onRefresh={refreshAll} />
          // }
          ListHeaderComponent={
            <DiscoverProperties
              state={address?.state || ""}
              city={address?.city || ""}
              mapHeight={MAP_HEIGHT}
            />
          }
          getItemType={(item) => {
            return item.id;
          }}
          showsVerticalScrollIndicator={false}
          data={feedList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem as any}
          ItemSeparatorComponent={() => (
            <View style={[{ height: 1 }]} className="bg-background" />
          )}
        />
      </Box>
      <CreateButton className="" onPress={onNewChat} />
    </>
  );
}
