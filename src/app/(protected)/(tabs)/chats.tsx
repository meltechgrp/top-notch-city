import StartChatBottomSheet from "@/components/modals/StartChatBottomSheet";
import CustomerCareBottomSheet from "@/components/modals/CustomerCareBottomSheet";
import { Box, Icon, Pressable, View } from "@/components/ui";
import { router, Tabs, useFocusEffect } from "expo-router";
import { Plus, Search } from "lucide-react-native";
import { useMe } from "@/hooks/useMe";
import { TabView, SceneMap } from "react-native-tab-view";
import BookingList from "@/components/bookings/BookingList";
import VisitationList from "@/components/bookings/VisitationList";
import React, { useCallback, useMemo } from "react";
import { Dimensions } from "react-native";
import ChatList from "@/components/chat/ChatList";
import { SmallTabBar } from "@/components/custom/CustomTabbarHeader";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Bookings } from "@/actions/bookings";

export default function MessagesScreen() {
  const { me, isAgent } = useMe();
  const layout = Dimensions.get("window");
  const [index, setIndex] = React.useState(0);
  const { data } = useInfiniteQuery({
    queryKey: ["bookings"],
    queryFn: ({}) => Bookings(isAgent),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage;
      return page < pages ? page + 1 : undefined;
    },
  });
  const bookings = useMemo(() => {
    const total = data?.pages.flatMap((page) => page.results) || [];
    return {
      rev: total.filter(
        (b) => b.booking_type == "reservation" && b.status == "pending"
      ).length,
      insp: total.filter(
        (b) => b.booking_type == "inspection" && b.status == "pending"
      ).length,
    };
  }, [data]);
  const routes = React.useMemo(
    () => [
      { key: "chats", title: "Chats" },
      {
        key: "reservation",
        title: "Reservations",
        count: bookings.rev,
      },
      {
        key: "inspection",
        title: "Inspections",
        count: bookings.insp,
      },
    ],
    [bookings]
  );
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "chats":
        return <ChatList />;
      case "reservation":
        return <BookingList />;
      case "inspection":
        return <VisitationList />;
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIndex(0);
    }, [])
  );
  const [friendsModal, setFriendsModal] = React.useState(false);
  const [staffs, setStaffs] = React.useState(false);
  return (
    <>
      <Tabs.Screen
        options={{
          headerLeft: me
            ? () => (
                <View className="px-4 flex-row gap-4">
                  <Pressable
                    className="p-2 bg-background-muted rounded-full"
                    onPress={() => router.push("/start")}
                  >
                    <Icon as={Plus} className="w-6 h-6" />
                  </Pressable>
                </View>
              )
            : undefined,
          headerRight: () => (
            <View className="px-4 flex-row gap-4">
              <Pressable className="p-2 bg-background-muted rounded-full">
                <Icon as={Search} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
        }}
      />
      <Box className="flex-1">
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          swipeEnabled={false}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => <SmallTabBar {...props} />}
        />
      </Box>
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
