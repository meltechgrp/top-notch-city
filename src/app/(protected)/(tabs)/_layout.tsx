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
import { getTotal } from "@/actions/message";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { tempStore } from "@/store/tempStore";
import { useMainStore } from "@/store";

export const unstable_settings = {
  initialRouteName: "/home",
};

function MessagesTabIcon({ color, total }: { color: string; total: number }) {
  const hasPending = total > 0;
  const label = total > 99 ? "99+" : String(total);

  return (
    <View className="relative h-7 w-7 items-center justify-center">
      <MessageSquareMore size={22} color={color} />
      {hasPending && (
        <View className="absolute -right-1 -top-1 min-w-4 h-4 px-1 rounded-full bg-primary items-center justify-center border border-background">
          <Text className="text-[9px] leading-none font-bold text-white">
            {label}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const theme = useResolvedTheme();
  const { isInternetReachable, isOffline } = useNetworkStatus();
  const [total, setTotal] = React.useState(() => {
    return Number(tempStore.getState().totalUnreadChat) || 0;
  });
  const me = useMainStore((state) => {
    const userId = state.activeUserId;
    return userId ? (state.accounts?.[userId]?.user ?? null) : null;
  });
  const isAgent = me?.role == "agent" || me?.role == "staff_agent";
  const isAdmin = me?.role == "admin" || me?.is_superuser || false;

  useEffect(() => {
    return tempStore.subscribe((state) => {
      setTotal(Number(state.totalUnreadChat) || 0);
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!me || isOffline || !isInternetReachable) {
      return () => {
        mounted = false;
      };
    }

    getTotal()
      .then((result) => {
        if (mounted && result?.total_unread !== undefined) {
          tempStore.getState().updatetotalUnreadChat(result.total_unread);
        }
      })
      .catch((error) => {
        console.log("Failed to fetch unread chat count", error);
      });

    return () => {
      mounted = false;
    };
  }, [isInternetReachable, isOffline, me?.id]);
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
            <MessagesTabIcon color={color} total={total} />
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
