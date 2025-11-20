import React, { useMemo, useState } from "react";
import { FlashList } from "@shopify/flash-list";

import { Box, Icon, Pressable, Text, View } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/actions/user";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";

import { ProfileTopSection } from "@/components/profile/ProfileTopSection";
import ProfileTabHeaderSection from "@/components/profile/ProfileTabHeaderSection";
import PropertiesTabView from "@/components/profile/PropertiesTab";
import BeachPersonWaterParasolIcon from "@/components/icons/BeachPersonWaterParasolIcon";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { router, Stack } from "expo-router";
import { Plus, Search, Settings } from "lucide-react-native";

const TABS = ["All", "Properties", "Saved", "Reviews"] as const;

export default function ProfileScreen() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
  });

  const me = useMemo(() => data ?? null, [data]);

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");

  if (!isLoading && !me) return <EmptyProfile />;

  // 🔥 Return data for each tab
  const dataForTab = useMemo(() => {
    switch (activeTab) {
      case "Properties":
        return [{ type: "properties" }];

      case "Saved":
        return [{ type: "saved" }];

      case "Reviews":
        return [{ type: "reviews" }];

      case "All":
      default:
        return [{ type: "all" }];
    }
  }, [activeTab]);

  const stickyHeaderIndices = [0, 1];

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <View className="px-4 flex-row gap-6">
              <Pressable onPress={() => {}}>
                <Icon as={Plus} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
          headerRight: () => (
            <View className="px-4 flex-row gap-6">
              <Pressable onPress={() => router.push("/(protected)/explore")}>
                <Icon as={Search} className="w-6 h-6" />
              </Pressable>
              <Pressable onPress={() => router.push("/(protected)/settings")}>
                <Icon as={Settings} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
        }}
      />
      <FullHeightLoaderWrapper loading={isLoading}>
        <Box className="flex-1">
          <FlashList
            data={dataForTab}
            keyExtractor={(_, idx) => `${activeTab}-${idx}`}
            renderItem={({ item }) => {
              switch (item.type) {
                case "all":
                  return (
                    <View className="mt-4">
                      <ProfileDetails me={me} />
                    </View>
                  );

                case "properties":
                  return (
                    <View className="mt-4">
                      {me && (
                        <PropertiesTabView
                          profileId={me.id}
                          refetch={refetch}
                        />
                      )}
                    </View>
                  );

                case "saved":
                  return (
                    <View className="h-40 bg-gray-100 rounded-xl mt-4 mx-3" />
                  );

                case "reviews":
                  return <View className="mt-4"></View>;

                default:
                  return null;
              }
            }}
            ListHeaderComponent={
              <View>
                {me && <ProfileTopSection userData={me} />}

                {me && (
                  <ProfileTabHeaderSection
                    activeIndex={TABS.indexOf(activeTab)}
                    onTabChange={(index) => setActiveTab(TABS[index])}
                    profile={me}
                  />
                )}
              </View>
            }
            stickyHeaderIndices={stickyHeaderIndices}
            contentContainerStyle={{
              paddingBottom: 50,
            }}
          />
        </Box>
      </FullHeightLoaderWrapper>
    </>
  );
}

function EmptyProfile() {
  return (
    <View className="flex-1 bg-background-muted justify-center items-center px-4">
      <BeachPersonWaterParasolIcon
        width={64}
        height={64}
        className="text-gray-500"
      />
      <Text className="text-gray-500 mt-2">Nothing to see here</Text>
    </View>
  );
}
