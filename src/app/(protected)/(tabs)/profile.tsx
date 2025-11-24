import React, { useMemo, useState } from "react";
import { FlashList } from "@shopify/flash-list";

import { Box, Button, Icon, Pressable, Text, View } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { getMe, getUser } from "@/actions/user";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";

import { ProfileTopSection } from "@/components/profile/ProfileTopSection";
import ProfileTabHeaderSection from "@/components/profile/ProfileTabHeaderSection";
import PropertiesTabView from "@/components/profile/PropertiesTab";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { router, Stack } from "expo-router";
import { LogIn, Plus, Search, Settings, User } from "lucide-react-native";
import SavedPropertiesTabView from "@/components/profile/SavedProperties";
import ReviewsTabView from "@/components/profile/ReviewsTabView";
import { useStore } from "@/store";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import { RefreshControl } from "react-native";

const TABS = ["All", "Properties", "Saved", "Reviews"] as const;

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const me = useStore.getState().me;
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["user", me?.id],
    queryFn: () => getUser(me?.id!),
    enabled: !!me,
  });

  const user = useMemo(() => data ?? null, [data]);

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

  if (!isLoading && !user) return <NotLoggedInProfile />;
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () =>
            user ? (
              <View className="px-4 flex-row gap-6">
                <Pressable
                  className="p-2 bg-background-muted rounded-full"
                  onPress={() => {}}
                >
                  <Icon as={Plus} className="w-6 h-6" />
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
              {user && (
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
      <FullHeightLoaderWrapper
        LoaderComponent={<ProfileSkeleton />}
        loading={isLoading || isRefetching}
      >
        <Box className="flex-1">
          <FlashList
            data={dataForTab}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            keyExtractor={(_, idx) => `${activeTab}-${idx}`}
            renderItem={({ item }) => {
              switch (item.type) {
                case "all":
                  return (
                    <View className="mt-4">
                      <ProfileDetails me={user} />
                    </View>
                  );

                case "properties":
                  return (
                    <View className="mt-4">
                      {user && <PropertiesTabView profileId={user.id} />}
                    </View>
                  );

                case "saved":
                  return (
                    <View className="mt-4">
                      {user && <SavedPropertiesTabView />}
                    </View>
                  );

                case "reviews":
                  return (
                    <View className="mt-4">
                      {user && <ReviewsTabView profileId={user.id} />}
                    </View>
                  );

                default:
                  return null;
              }
            }}
            ListHeaderComponent={
              <View>
                {user && <ProfileTopSection userData={user} />}

                {user && (
                  <ProfileTabHeaderSection
                    activeIndex={TABS.indexOf(activeTab)}
                    onTabChange={(index) => setActiveTab(TABS[index])}
                    profile={user}
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
