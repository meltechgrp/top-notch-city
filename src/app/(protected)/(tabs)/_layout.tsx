import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/HapticTab";
import {
  Home,
  LayoutDashboard,
  MessageSquareMore,
  MonitorPlay,
  Plus,
  PlusCircle,
  Search,
  UserCircle,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useResolvedTheme } from "@/components/ui";
import { useStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { useHomeFeed } from "@/hooks/useHomeFeed";

export const unstable_settings = {
  initialRouteName: "/home",
};
export default function TabLayout() {
  const theme = useResolvedTheme();
  const { me, isAdmin, isAgent } = useStore(
    useShallow((s) => s.getCurrentUser())
  );
  const { total } = useHomeFeed();
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
          title: isAdmin ? "Dashboard" : isAgent ? "Tools" : "Menu",
          tabBarIcon: ({ color }) =>
            isAdmin ? (
              <LayoutDashboard size={22} color={color} />
            ) : isAgent ? (
              <PlusCircle size={22} color={color} />
            ) : (
              <Plus size={22} color={color} />
            ),
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
