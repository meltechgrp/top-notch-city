"use client";

import { AgentCTA } from "@/components/menu/AgentCTA";
import { Box, Icon, Pressable, Text, View } from "@/components/ui";
import { useUser } from "@/hooks/useUser";
import { Stack, useRouter } from "expo-router";
import { MoreHorizontal, Search, Settings } from "lucide-react-native";
import { chunk } from "lodash-es";
import { FeatureCard } from "@/components/menu/FeaturedCard";
import { getQuickMenuItems } from "@/components/menu/menuitems";
import { cn } from "@/lib/utils";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import AdminCards from "@/components/admin/dashboard/AdminCards";

export default function Menu() {
  const router = useRouter();
  const { me, hasAuth, isAdmin, isAgent } = useUser();
  const quickMenuItems = getQuickMenuItems();
  return (
    <>
      <Stack.Screen
        options={{
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
            ) : undefined,
          headerRight: () => (
            <View className="px-4 flex-row gap-4">
              <Pressable
                className="p-2 bg-background-muted rounded-full"
                onPress={() => router.push("/(protected)/explore")}
              >
                <Icon as={Search} className="w-6 h-6" />
              </Pressable>
              {me && (
                <Pressable
                  className="p-2 bg-background-muted rounded-full"
                  onPress={() => router.push("/(protected)/settings")}
                >
                  <Icon as={Settings} className="w-6 h-6" />
                </Pressable>
              )}
            </View>
          ),
        }}
      />
      <BodyScrollView withBackground className="pt-2">
        <AgentCTA />
        {isAdmin && <AdminCards />}
        <View className="mt-6">
          <Text className="mb-2 px-4">Shortcuts</Text>
          <View className="flex-wrap gap-4">
            {chunk(quickMenuItems, 2).map((row, i) => (
              <View className={cn("flex-row gap-4 px-4")} key={i}>
                {row.map((item) => (
                  <FeatureCard
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    onPress={() => {
                      router.push(item.link as any);
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </BodyScrollView>
    </>
  );
}
