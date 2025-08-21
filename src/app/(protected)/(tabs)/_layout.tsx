import { Tabs, usePathname } from "expo-router";
import React, { useMemo } from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/TabBarBackground";
import {
  Home,
  Menu,
  MessageSquareMore,
  Plus,
  Search,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useResolvedTheme } from "@/components/ui";
import { useStore } from "@/store";

export const unstable_settings = {
  initialRouteName: "home",
};
export default function TabLayout() {
  const theme = useResolvedTheme();
  const { me } = useStore();
  const pathname = usePathname();
  const isChat = useMemo(() => pathname.split("/").length > 2, [pathname]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF4C00",
        headerShown: false,
        tabBarButton: HapticTab,
        headerTitleAlign: "center",
        tabBarHideOnKeyboard: true,
        tabBarBackground: TabBarBackground,
        tabBarStyle: [
          Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {
              backgroundColor:
                theme == "dark"
                  ? Colors.light.background
                  : Colors.dark.background,
            },
          }),
          { display: isChat ? "none" : "flex" },
        ],
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
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: "Properties",
          tabBarIcon: ({ color }) => <Plus size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Message",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MessageSquareMore size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: true,
          tabBarIcon: ({ color }) => <Menu size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
