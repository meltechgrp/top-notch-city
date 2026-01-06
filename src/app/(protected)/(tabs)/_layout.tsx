import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { HapticTab } from "@/components/HapticTab";
import {
  Home,
  LayoutDashboard,
  MessageSquareMore,
  MonitorPlay,
  MoreHorizontal,
  PlusCircle,
  Search,
  UserCircle,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Icon, Pressable, Text, useResolvedTheme, View } from "@/components/ui";
import { useMe } from "@/hooks/useMe";
import { useQuery } from "@tanstack/react-query";
import { getTotal } from "@/actions/message";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

export const unstable_settings = {
  initialRouteName: "/home",
};
export default function TabLayout() {
  const theme = useResolvedTheme();
  const { isInternetReachable, isOffline } = useNetworkStatus();
  const { me, isAdmin, isAgent } = useMe();
  const { data, refetch } = useQuery({
    queryKey: ["total-pending"],
    queryFn: getTotal,
    enabled: !!me,
  });
  const total = data?.total_unread || 0;
  useEffect(() => {
    if (me) {
      refetch();
    }
  }, [me]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF4C00",
        headerShown: true,
        tabBarButton: HapticTab,
        headerTitleAlign: "center",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          zIndex: 10000,
          backgroundColor:
            theme == "dark" ? Colors.light.background : Colors.dark.background,
        },
        headerStyle: {
          backgroundColor:
            theme == "dark" ? Colors.light.background : Colors.dark.background,
        },
        headerTitleStyle: {
          color: theme == "dark" ? Colors.dark.text : Colors.light.text,
          fontWeight: 600,
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={() => ({
          title: "Messages",
          headerTitle: () => (
            <View>
              {!isInternetReachable || isOffline ? (
                <View className="flex-row items-center -mt-1 gap-2">
                  <SpinningLoader size={20} />
                  <Text className="text-base font-medium">
                    {isOffline
                      ? "Waiting for network"
                      : !isInternetReachable
                        ? "Connecting..."
                        : ""}
                  </Text>
                </View>
              ) : (
                <Text className="text-lg font-medium">Messages</Text>
              )}
            </View>
          ),
          tabBarIcon: ({ color }) => (
            <MessageSquareMore size={22} color={color} />
          ),
          tabBarBadge: (total > 99 ? "99+" : total) || undefined,
          tabBarBadgeStyle: { fontSize: 10 },
        })}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: "Reels",
          headerShown: false,
          tabBarIcon: ({ color }) => <MonitorPlay size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={() => ({
          title: isAdmin ? "Dashboard" : isAgent ? "Tools" : "Explore",
          headerShown: isAdmin || isAgent,
          tabBarIcon: ({ color }) =>
            isAdmin ? (
              <LayoutDashboard size={22} color={color} />
            ) : isAgent ? (
              <PlusCircle size={22} color={color} />
            ) : (
              <Search size={22} color={color} />
            ),
          headerLeft: () =>
            isAdmin ? (
              <View className={"px-4 flex-row gap-6"}>
                <Pressable
                  className="p-2 bg-background-muted rounded-full"
                  onPress={() => {}}
                >
                  <Icon as={MoreHorizontal} className="w-6 h-6" />
                </Pressable>
              </View>
            ) : isAgent ? (
              <View className={"px-4 flex-row gap-6"}>
                <Pressable
                  className="p-2 bg-background-muted rounded-full"
                  onPress={() =>
                    router.push(`/agents/${me?.id}/properties/add`)
                  }
                >
                  <Icon as={PlusCircle} className="w-6 h-6" />
                </Pressable>
              </View>
            ) : undefined,
        })}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <UserCircle size={22} color={color} />,
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
