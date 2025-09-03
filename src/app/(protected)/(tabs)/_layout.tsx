import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/TabBarBackground";
import { Home, Menu, MonitorPlay, Plus, Search } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useResolvedTheme, Pressable } from "@/components/ui";
import { useReels } from "@/hooks/useReel";

export const unstable_settings = {
  initialRouteName: "home",
};
export default function TabLayout() {
  const theme = useResolvedTheme();
  const { forceRefresh } = useReels();

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
        name="reels"
        options={{
          title: "Reels",
          headerShown: false,
          tabBarButton: (props) => (
            <Pressable {...(props as any)} onDoublePress={forceRefresh} />
          ),
          tabBarIcon: ({ color }) => <MonitorPlay size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="properties"
        options={() => ({
          title: "Properties",
          tabBarIcon: ({ color }) => <Plus size={24} color={color} />,
        })}
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
