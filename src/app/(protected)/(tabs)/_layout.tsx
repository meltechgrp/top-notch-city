import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/HapticTab";
import {
  Home,
  LayoutDashboard,
  MessageSquareMore,
  MonitorPlay,
  Plus,
  UserCircle,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useResolvedTheme } from "@/components/ui";
import { useUser } from "@/hooks/useUser";

export const unstable_settings = {
  initialRouteName: "/home",
};
export default function TabLayout() {
  const theme = useResolvedTheme();
  const { isAdmin, isAgent } = useUser();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF4C00",
        headerShown: false,
        tabBarButton: HapticTab,
        headerTitleAlign: "center",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "static",
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
          fontSize: 22,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
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
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <UserCircle size={22} color={color} />,
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="menu"
        options={() => ({
          tabBarIcon: ({ color }) =>
            isAdmin ? (
              <LayoutDashboard size={22} color={color} />
            ) : (
              <Plus size={22} color={color} />
            ),
        })}
      />
    </Tabs>
  );
}
