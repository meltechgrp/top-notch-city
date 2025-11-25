import React, { useMemo, useState } from "react";
import { FlashList } from "@shopify/flash-list";

import { Box, Icon, Pressable, Text, View } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { getMe, getUser } from "@/actions/user";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";

import ProfileTabHeaderSection from "@/components/profile/ProfileTabHeaderSection";
import PropertiesTabView from "@/components/profile/PropertiesTab";
import BeachPersonWaterParasolIcon from "@/components/icons/BeachPersonWaterParasolIcon";
import { Stack, useLocalSearchParams } from "expo-router";
import { MoreHorizontal } from "lucide-react-native";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import ReviewsTabView from "@/components/profile/ReviewsTabView";
import ActivityTabView from "@/components/profile/activities/ActivityList";
import { AdminProfileDetails } from "@/components/admin/users/ProfileDetails";
import { AdminProfileTopSection } from "@/components/admin/users/ProfileTopSection";
import { UserActionsBottomSheet } from "@/components/admin/users/UserBottomSheet";
import { RefreshControl } from "react-native";

const TABS = ["All", "Properties", "Reviews", "Activities"] as const;

export default function AdminProfile() {
  const { userId } = useLocalSearchParams() as { userId: string };
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const user = useMemo(() => data ?? null, [data]);
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");

  if (!isLoading && !user) return <EmptyProfile />;

  const dataForTab = useMemo(() => {
    switch (activeTab) {
      case "Properties":
        return [{ type: "properties" }];

      case "Activities":
        return [{ type: "activity" }];

      case "Reviews":
        return [{ type: "reviews" }];

      case "All":
      default:
        return [{ type: "all" }];
    }
  }, [activeTab]);

  const stickyHeaderIndices = [0, 1];

  useRefreshOnFocus(refetch);
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View className="px-4 flex-row gap-6">
              <Pressable onPress={() => setShowActions(true)}>
                <Icon as={MoreHorizontal} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
        }}
      />
      <FullHeightLoaderWrapper loading={isLoading}>
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
                      <AdminProfileDetails me={user} />
                    </View>
                  );

                case "properties":
                  return (
                    <View className="mt-4">
                      {user && <PropertiesTabView profileId={user.id} />}
                    </View>
                  );

                case "reviews":
                  return (
                    <View className="mt-4">
                      {user && <ReviewsTabView profileId={user.id} />}
                    </View>
                  );

                case "activity":
                  return (
                    <View className="mt-4">
                      {user && <ActivityTabView profileId={user.id} />}
                    </View>
                  );
                default:
                  return null;
              }
            }}
            ListHeaderComponent={
              <View>
                {user && (
                  <AdminProfileTopSection
                    setShowActions={() => setShowActions(true)}
                    userData={user}
                  />
                )}

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
                        label: "Reviews",
                        key: "reviews",
                      },
                      {
                        label: "Activities",
                        key: "activity",
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
      {user && (
        <UserActionsBottomSheet
          user={user}
          visible={showActions}
          onDismiss={() => setShowActions(false)}
        />
      )}
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
