import { router, Tabs } from "expo-router";
import React from "react";
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
import { Icon, Pressable, useResolvedTheme, View } from "@/components/ui";
import { useMe } from "@/hooks/useMe";

export const unstable_settings = {
  initialRouteName: "/home",
};
export default function TabLayout() {
  const theme = useResolvedTheme();
  const { me, isAdmin, isAgent } = useMe();
  const total = 0;
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
