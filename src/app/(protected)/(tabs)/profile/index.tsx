import React, { useMemo, useState } from "react";
import { FlashList } from "@shopify/flash-list";

import { Box, Button, Icon, Pressable, Text, View } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/actions/user";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";

import { ProfileTopSection } from "@/components/profile/ProfileTopSection";
import ProfileTabHeaderSection from "@/components/profile/ProfileTabHeaderSection";
import PropertiesTabView from "@/components/profile/PropertiesTab";
import BeachPersonWaterParasolIcon from "@/components/icons/BeachPersonWaterParasolIcon";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { router, Stack } from "expo-router";
import { LogIn, Plus, Search, Settings, User } from "lucide-react-native";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import SavedPropertiesTabView from "@/components/profile/SavedProperties";
import ReviewsTabView from "@/components/profile/ReviewsTabView";

const TABS = ["All", "Properties", "Saved", "Reviews"] as const;

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
  });

  const me = useMemo(() => data ?? null, [data]);

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

  useRefreshOnFocus(refetch);
  if (!isLoading && !me) return <NotLoggedInProfile />;
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
              {me && (
                <Pressable onPress={() => router.push("/(protected)/settings")}>
                  <Icon as={Settings} className="w-6 h-6" />
                </Pressable>
              )}
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
                      {me && <PropertiesTabView profileId={me.id} />}
                    </View>
                  );

                case "saved":
                  return (
                    <View className="mt-4">
                      {me && <SavedPropertiesTabView />}
                    </View>
                  );

                case "reviews":
                  return (
                    <View className="mt-4">
                      {me && <ReviewsTabView profileId={me.id} />}
                    </View>
                  );

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
                    profileTabs={[
                      {
                        label: "All",
                        key: "all",
                      },
                      {
                        label: "Properties",
                        key: "houses",
                      },
                      {
                        label: "Saved",
                        key: "saved",
                      },
                      {
                        label: "Reviews",
                        key: "reviews",
                      },
                    ]}
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

function NotLoggedInProfile() {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-background">
      <View className="bg-background-muted p-6 items-center justify-center border border-outline-100 rounded-2xl">
        <View className="mb-6">
          <Icon as={User} size={64} className="text-gray-400" />
        </View>
        <Text className="text-xl font-semibold text-typography mb-2">
          You’re not logged in
        </Text>
        <Text className="text-sm text-center text-typography/80 mb-6">
          Log in to view and manage your profile, properties, wishlist and
          reviews.
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
