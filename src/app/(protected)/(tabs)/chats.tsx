import StartChatBottomSheet from "@/components/modals/StartChatBottomSheet";
import CustomerCareBottomSheet from "@/components/modals/CustomerCareBottomSheet";
import { Box, Icon, Pressable, View } from "@/components/ui";
import { Tabs } from "expo-router";
import { Plus, Search } from "lucide-react-native";
import { useMe } from "@/hooks/useMe";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Colors } from "@/constants/Colors";
import BookingList from "@/components/bookings/BookingList";
import VisitationList from "@/components/bookings/VisitationList";
import React from "react";
import { Dimensions } from "react-native";
import ChatList from "@/components/chat/ChatList";
import { SmallTabBar } from "@/components/custom/CustomTabbarHeader";

export default function MessagesScreen() {
  const { me, isLoading } = useMe();
  const layout = Dimensions.get("window");
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "chats", title: "Chats" },
    { key: "reservation", title: "Reservation" },
    { key: "inspection", title: "Inspection" },
  ]);
  const renderScene = SceneMap({
    chats: ChatList,
    reservation: BookingList,
    inspection: VisitationList,
  });
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
                    onPress={() => setFriendsModal(true)}
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
