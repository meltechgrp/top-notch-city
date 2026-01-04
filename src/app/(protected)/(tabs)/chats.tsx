import { Box, Button, Icon, Pressable, Text, View } from "@/components/ui";
import { router, Tabs, useFocusEffect } from "expo-router";
import { LogIn, MessageSquare, Plus, Search } from "lucide-react-native";
import { useMe } from "@/hooks/useMe";
import { TabView } from "react-native-tab-view";
import BookingList from "@/components/bookings/BookingList";
import VisitationList from "@/components/bookings/VisitationList";
import React, { useCallback } from "react";
import { Dimensions } from "react-native";
import ChatList from "@/components/chat/ChatList";
import { SmallTabBar } from "@/components/custom/CustomTabbarHeader";

export default function MessagesScreen() {
  const { me, isLoading } = useMe();
  const layout = Dimensions.get("window");
  const [index, setIndex] = React.useState(0);
  const routes = React.useMemo(
    () => [
      { key: "chats", title: "Chats" },
      {
        key: "reservation",
        title: "Reservations",
        count: 0,
      },
      {
        key: "inspection",
        title: "Inspections",
        count: 0,
      },
    ],
    []
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

  if (!isLoading && !me) return <NotLoggedInProfile />;
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
    </>
  );
}

export function NotLoggedInProfile() {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-background">
      <View className="bg-background-muted p-6 items-center justify-center border border-outline-100 rounded-2xl">
        <View className="mb-6">
          <Icon as={MessageSquare} size={"xl"} className="text-gray-400" />
        </View>
        <Text className="text-xl font-semibold text-typography mb-2">
          You’re not logged in
        </Text>
        <Text className="text-sm text-center text-typography/80 mb-6">
          Log in to view and manage your messages, inspections and reservations.
        </Text>
        <Button
          onPress={() => router.push("/signin")}
          className=" rounded-lg px-10 h-12 justify-center"
        >
          <Icon as={LogIn} />
          <Text className="text-white font-medium">Login</Text>
        </Button>
      </View>
    </View>
  );
}
