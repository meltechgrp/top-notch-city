import CreateButton from "@/components/custom/CreateButton";
import DiscoverProperties from "@/components/home/DiscoverProperties";
import TopLocations from "@/components/home/topLocations";
import { Box, View } from "@/components/ui";
import StartChatBottomSheet from "@/components/modals/StartChatBottomSheet";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import eventBus from "@/lib/eventBus";
import { useStore } from "@/store";
import React, { useEffect, useState } from "react";
import CustomerCareBottomSheet from "@/components/modals/CustomerCareBottomSheet";
import { FlatList, ListRenderItem, RefreshControl } from "react-native";
import FeaturedProperties from "@/components/home/featured";
import ApartmentProperties from "@/components/home/recent";
import Lands from "@/components/home/lands";
const MAP_HEIGHT = 400;

export default function HomeScreen() {
  const { me } = useStore();
  const { refreshAll, refetching } = useHomeFeed();
  useEffect(() => {
    setTimeout(() => eventBus.dispatchEvent("REFRESH_PROFILE", null), 1000);
  }, []);

  const [friendsModal, setFriendsModal] = React.useState(false);
  const [staffs, setStaffs] = useState(false);
  const feedList = React.useMemo(() => {
    const topLocations = {
      id: "locations",
      _typename: "Locations",
    } as any;
    const populerCommunities = {
      id: "featured",
      __typename: "Featured",
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
      populerCommunities,
      apartment,
      lands,
      bottomPlaceHolder,
    ];
  }, []);

  type FeedList = any;
  const renderItem: ListRenderItem<FeedList> = ({ item }) => {
    if (item.id === "locations") {
      return <TopLocations />;
    }
    if (item.id === "featured") {
      return <FeaturedProperties />;
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
  };
  const onNewChat = () => {
    setFriendsModal(true);
  };

  return (
    <>
      <Box className="flex-1">
        <FlatList
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
      {me && <CreateButton className="" onPress={onNewChat} />}
      {me && friendsModal && (
        <StartChatBottomSheet
          visible={friendsModal}
          onDismiss={() => setFriendsModal(false)}
          setStaffs={() => setStaffs(true)}
          me={me}
        />
      )}
      <CustomerCareBottomSheet
        visible={staffs}
        onDismiss={() => {
          setStaffs(false);
        }}
      />
    </>
  );
}
