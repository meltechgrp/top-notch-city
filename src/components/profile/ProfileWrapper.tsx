import React, { useEffect, useMemo, useState } from "react";
import { FlashList } from "@shopify/flash-list";

import { Box, Button, Icon, Pressable, Text, View } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";

import { ProfileTopSection } from "@/components/profile/ProfileTopSection";
import ProfileTabHeaderSection from "@/components/profile/ProfileTabHeaderSection";
import PropertiesTabView from "@/components/profile/PropertiesTab";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { router, Stack } from "expo-router";
import {
  ChevronLeftIcon,
  LogIn,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react-native";
import SavedPropertiesTabView from "@/components/profile/SavedProperties";
import ReviewsTabView from "@/components/profile/ReviewsTabView";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import { RefreshControl } from "react-native";
import { UserActionsBottomSheet } from "@/components/admin/users/UserBottomSheet";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import eventBus from "@/lib/eventBus";
import { useUser } from "@/hooks/useUser";
import { openAccountsModal } from "@/components/globals/AuthModals";

export type UserType = "visitor" | "owner" | "admin";

interface ProfileWrapperProps {
  tabs: {
    label: string;
    key: string;
  }[];
  userId?: string;
  userType: UserType;
  isAgent?: boolean;
}

export function ProfileWrapper({
  tabs,
  userType = "visitor",
  userId,
}: ProfileWrapperProps) {
  const { isAgent } = useUser();
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
    staleTime: 0,
  });

  const user = useMemo(() => data ?? null, [data]);

  const dataForTab = useMemo(() => {
    switch (activeTab.label) {
      case "Properties":
      case "Houses":
        return [{ type: "properties" }];
      case "Lands":
        return [{ type: "lands" }];

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
  useEffect(() => {
    eventBus.dispatchEvent("REFRESH_PROFILE", null);
  }, [data?.role]);
  useRefreshOnFocus(refetch);
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: user
            ? () => {
                switch (userType) {
                  case "owner":
                    return (
                      <View className="px-4 flex-row gap-6">
                        <Pressable
                          className="p-2 bg-background-muted rounded-full"
                          onPress={() => openAccountsModal({ visible: true })}
                        >
                          <Icon as={Plus} className="w-6 h-6" />
                        </Pressable>
                      </View>
                    );
                  default:
                    return (
                      <Pressable
                        onPress={() => {
                          if (router.canGoBack()) router.back();
                          else router.push("/");
                        }}
                        className="py-1 flex-row items-center pr-2 android:pr-4"
                      >
                        <Icon className=" w-8 h-8" as={ChevronLeftIcon} />
                      </Pressable>
                    );
                }
              }
            : undefined,
          headerRight: () => (
            <View className="px-2 flex-row gap-4">
              {userType == "owner" ? (
                <Pressable
                  className="p-2 bg-background-muted rounded-full"
                  onPress={() => router.push("/(protected)/explore")}
                >
                  <Icon as={Search} className="w-6 h-6" />
                </Pressable>
              ) : (
                <Pressable className="p-2 android:bg-background-muted rounded-full">
                  <Icon as={MoreHorizontal} className="w-6 h-6" />
                </Pressable>
              )}
              {user && userType == "owner" && (
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
        loading={isLoading}
      >
        <Box className="flex-1">
          <FlashList
            data={dataForTab}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refetch} />
            }
            keyExtractor={(_, idx) => `${activeTab}-${idx}`}
            renderItem={({ item }) => {
              switch (item.type) {
                case "all":
                  return (
                    <View className="mt-4">
                      {user && (
                        <ProfileDetails
                          isAgent={isAgent}
                          userType={userType}
                          user={user}
                        />
                      )}
                    </View>
                  );

                case "properties":
                  return (
                    <View className="mt-4">
                      {user && (
                        <PropertiesTabView
                          isAgent={isAgent}
                          isOwner={userType == "owner"}
                          profileId={user.id}
                        />
                      )}
                    </View>
                  );
                case "lands":
                  return (
                    <View className="mt-4">
                      {user && (
                        <PropertiesTabView
                          isAgent={isAgent}
                          isOwner={userType == "owner"}
                          profileId={user.id}
                          type="lands"
                        />
                      )}
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
                {user && (
                  <ProfileTopSection
                    user={user}
                    userType={userType}
                    isAgent={isAgent}
                    setShowActions={() => setShowActions(true)}
                  />
                )}

                {user && (
                  <ProfileTabHeaderSection
                    activeIndex={tabs.indexOf(activeTab)}
                    onTabChange={(index) => setActiveTab(tabs[index])}
                    profile={user}
                    profileTabs={tabs}
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

export function NotLoggedInProfile({ userType }: { userType: UserType }) {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-background">
      <View className="bg-background-muted p-6 items-center justify-center border border-outline-100 rounded-2xl">
        <View className="mb-6">
          <Icon as={User} size={"xl"} className="text-gray-400" />
        </View>
        <Text className="text-xl font-semibold text-typography mb-2">
          {userType !== "owner" ? "Account not found" : "You’re not logged in"}
        </Text>
        <Text className="text-sm text-center text-typography/80 mb-6">
          {userType !== "owner"
            ? "this account seems to have been removed"
            : "Log in to view and manage your profile, properties, wishlist and reviews."}
        </Text>
        {userType === "owner" && (
          <Button
            onPress={() => router.push("/signin")}
            className=" rounded-lg px-10 h-12 justify-center"
          >
            <Icon as={LogIn} />
            <Text className="text-white font-medium">Login</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
