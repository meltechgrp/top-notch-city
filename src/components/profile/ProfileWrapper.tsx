import React, { useCallback, useMemo, useState } from "react";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

import { Box, Button, Icon, Pressable, Text, View } from "@/components/ui";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";

import { ProfileTopSection } from "@/components/profile/ProfileTopSection";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { router, Stack } from "expo-router";
import {
  ArrowRightLeft,
  ChevronLeftIcon,
  LogIn,
  Settings,
  User,
} from "lucide-react-native";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import { RefreshControl } from "react-native";
import { UserActionsBottomSheet } from "@/components/admin/users/UserBottomSheet";
import { openAccountsModal } from "@/components/globals/AuthModals";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/useMe";
import { Campaigns } from "@/components/profile/campaigns";
import PropertiesTabView from "@/components/profile/PropertiesTab";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";

export type UserType = "visitor" | "owner" | "admin";

interface ProfileWrapperProps {
  userId?: string;
  userType: UserType;
}

export function ProfileWrapper({
  userType = "visitor",
  userId,
}: ProfileWrapperProps) {
  const { isAgent, me } = useMe();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });
  const [showActions, setShowActions] = useState(false);
  const user = useMemo(
    () => (userType == "owner" && me ? me : data),
    [me, data, userType]
  );
  const feedList = React.useMemo(() => {
    const camps = {
      id: "camps",
    } as any;
    const properties = {
      id: "properties",
    } as any;
    const details = {
      id: "details",
    } as any;
    const bottomPlaceHolder = {
      id: "bottomPlaceHolder",
    } as any;
    return [camps, properties, details, bottomPlaceHolder];
  }, []);
  type FeedList = any;
  const renderItem: ListRenderItem<FeedList> = useCallback(
    ({ item }) => {
      if (item.id === "camps") {
        return <Campaigns isAgent={isAgent} userType={userType} user={user} />;
      }
      if (item.id === "properties" && (userType == "visitor" || isAgent)) {
        return (
          <PropertiesTabView
            showStatus={userType == "owner" && isAgent}
            isAgent={isAgent}
            isOwner={userType == "owner"}
            profileId={user?.id}
          />
        );
      }
      if (item.id === "details") {
        return (
          <ProfileDetails isAgent={isAgent} userType={userType} user={user} />
        );
      }
      if (item.id === "bottomPlaceHolder") {
        return <View className="h-24" />;
      }
      return <View></View>;
    },
    [isAgent, userType, user]
  );

  if (!user && userType == "owner")
    return <NotLoggedInProfile userType={"owner"} />;
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
                          className="p-2 flex-row bg-background-info rounded-full"
                          onPress={() => openAccountsModal({ visible: true })}
                        >
                          <Icon as={ArrowRightLeft} className="w-6 h-6" />
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
        <Box className={cn("flex-1", userType == "owner" && "pb-24")}>
          <FlashList
            data={feedList}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refetch} />
            }
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
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
              </View>
            }
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
