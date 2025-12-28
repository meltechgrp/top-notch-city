import CreateButton from "@/components/custom/CreateButton";
import DiscoverProperties from "@/components/home/DiscoverProperties";
import TopLocations from "@/components/home/topLocations";
import { Box, View } from "@/components/ui";
import { ListRenderItem, RefreshControl } from "react-native";
import ShortletProperties from "@/components/home/shortlet";
import FeaturedProperties from "@/components/home/featured";
import ApartmentProperties from "@/components/home/recent";
import Lands from "@/components/home/lands";
import { FlashList } from "@shopify/flash-list";
import { useMe } from "@/hooks/useMe";
import { router } from "expo-router";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import React, { useCallback } from "react";
const MAP_HEIGHT = 400;

export default function HomeScreen() {
  const { me } = useMe();
  const { refreshAll, refetching } = useHomeFeed();
  const feedList = React.useMemo(() => {
    const topLocations = {
      id: "locations",
      _typename: "Locations",
    } as any;
    const featured = {
      id: "featured",
      __typename: "Featured",
    } as any;
    const shortlets = {
      id: "shortlet",
      __typename: "Shortlet",
    } as any;
    const apartment = {
      id: "apartment",
      _typename: "Apartments",
    } as any;
    const lands = {
      id: "lands",
      _typename: "Lands",
    } as any;
    const bottomPlaceHolder = {
      id: "bottomPlaceHolder",
      __typename: "bottomPlaceHolder",
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
  const renderItem: ListRenderItem<FeedList> = useCallback(({ item }) => {
    if (item.id === "locations") {
      return <TopLocations />;
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
  }, []);
  const onNewChat = () => {
    router.push("/start");
  };

  return (
    <>
      <Box className="flex-1">
        <FlashList
          refreshControl={
            <RefreshControl refreshing={refetching} onRefresh={refreshAll} />
          }
          ListHeaderComponent={<DiscoverProperties mapHeight={MAP_HEIGHT} />}
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
