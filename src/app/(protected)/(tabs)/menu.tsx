import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Pressable,
  Text,
  useResolvedTheme,
  View,
} from "@/components/ui";
import { Stack, useRouter } from "expo-router";
import { Alert, Share } from "react-native";
import React, { useMemo } from "react";
import {
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  NotebookText,
  Settings,
  Share2,
  Sparkle,
} from "lucide-react-native";
import { MenuListItem } from "@/components/menu/MenuListItem";
import config from "@/config";
import { Divider } from "@/components/ui/divider";
import { cn, fullName } from "@/lib/utils";
import NotificationBarButton from "@/components/notifications/NotificationBarButton";
import { useStore } from "@/store";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { getImageUrl } from "@/lib/api";
import { openSignInModal } from "@/components/globals/AuthModals";
import LogoutAlertDialog from "@/components/modals/LogoutAlertDialog";
import useResetAppState from "@/hooks/useResetAppState";
import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "@/actions/agent";

export default function More() {
  const resetAppState = useResetAppState();
  const { me, hasAuth } = useStore();
  const router = useRouter();
  // const { data } = useQuery({
  //   queryKey: ["applications"],
  //   queryFn: getMyApplications,
  // });
  const theme = useResolvedTheme();

  const [openLogoutAlertDialog, setOpenLogoutAlertDialog] =
    React.useState(false);

  function logout() {
    resetAppState();
    router.dismissTo("/(protected)/(tabs)/home");
  }
  async function onLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
          },
        },
      ],
      {}
    );
  }
  async function onInvite() {
    try {
      const result = await Share.share({
        message: "Invite your friends to join TopNotch City Estate.",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      alert(error.message);
    }
  }
  const isAgent = false;
  //   useMemo(
  //   () => data?.some((ap) => ap.status == "approved"),
  //   [data]
  // );
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              className=" px-4"
            >
              <NotificationBarButton className=" bg-transparent rounded-none" />
            </View>
          ),
        }}
      />
      <BodyScrollView withBackground={true}>
        <View
          className={cn(
            "px-4 py-2.5 mt-2",
            theme == "dark"
              ? "bg-background-muted/95"
              : "bg-background-muted/60"
          )}
        >
          <Pressable
            onPress={() => {
              if (!me?.id) {
                openSignInModal({
                  visible: true,
                  onLoginSuccess: () => {
                    router.reload();
                  },
                });
              }
            }}
            className={"flex-row items-center"}
          >
            <Avatar className=" w-14 h-14">
              <AvatarFallbackText>{fullName(me)}</AvatarFallbackText>
              <AvatarBadge size="md" />
              <AvatarImage source={getImageUrl(me?.profile_image)} />
            </Avatar>
            <View className="flex-1 pl-3">
              <Text className="text-lg text-typography font-medium">
                {me ? fullName(me) : "Sign in to view profile"}
              </Text>
              <Text className="text-sm text-typography/80">
                {me ? me?.email : "Account details"}
              </Text>
            </View>
          </Pressable>
        </View>
        <View className="pt-8 flex-1 px-4">
          <Text className="text-base text-typography/80 uppercase px-4 mb-2">
            Menu
          </Text>
          <View className="flex-1 mt-2">
            {me && (
              <MenuListItem
                title="Account"
                description={
                  me.role == "admin"
                    ? "View admin dashboard"
                    : "View your dashboard"
                }
                onPress={() => {
                  if (!me?.id) {
                    openSignInModal({
                      visible: true,
                      onLoginSuccess: () => {
                        router.push({
                          pathname: "/(protected)/profile/[user]/account",
                          params: {
                            user: me?.id!,
                          },
                        });
                      },
                    });
                  } else {
                    router.push({
                      pathname: "/(protected)/profile/[user]/account",
                      params: {
                        user: me?.id!,
                      },
                    });
                  }
                }}
                icon={LayoutDashboard}
                iconColor="gray-500"
                className=" py-2 pb-3"
              />
            )}
            {me && <Divider className=" h-[0.3px] bg-background-info mb-4" />}
            {me && me?.role != "user" && (
              <MenuListItem
                title={me.role == "admin" ? "Dashboard" : "Analytics"}
                description={
                  me.role == "admin"
                    ? "View admin dashboard"
                    : "View your dashboard"
                }
                onPress={() => {
                  if (me?.role === "admin") {
                    router.dismissTo("/admin");
                  } else {
                    router.push("/dashboard");
                  }
                }}
                icon={LayoutDashboard}
                iconColor="gray-500"
                className=" py-2 pb-3"
              />
            )}
            {me && me?.role != "user" && (
              <Divider className=" h-[0.3px] bg-background-info mb-4" />
            )}
            <MenuListItem
              title="Wishlist"
              description="View all your saved properties"
              onPress={() => {
                if (!me?.id) {
                  openSignInModal({
                    visible: true,
                    onLoginSuccess: () => {
                      router.push({
                        pathname: "/(protected)/profile/[user]/wishlist",
                        params: {
                          user: me?.id!,
                        },
                      });
                    },
                  });
                } else {
                  router.push({
                    pathname: "/(protected)/profile/[user]/wishlist",
                    params: {
                      user: me?.id!,
                    },
                  });
                }
              }}
              icon={Heart}
              iconColor="primary"
              className=" py-2 pb-3"
            />
            <Divider className=" h-[0.3px] bg-background-info mb-4" />
            <MenuListItem
              title="Settings"
              description="Change your theme and other settings"
              onPress={() => {
                router.push("/settings");
              }}
              icon={Settings}
              iconColor="gray-500"
              className=" py-2 pb-3"
            />
            <Divider className=" h-[0.3px] bg-background-info mb-4" />
            <MenuListItem
              title="Send a report/review"
              description="Let's improve the app"
              onPress={() => router.push("/report")}
              icon={NotebookText}
              className="py-2"
              iconColor="yellow-600"
            />
            <Divider className=" h-[0.3px] bg-background-info mb-4" />
            <MenuListItem
              title="Invite friends"
              description={`Invite your friends to join ${config.appName} app`}
              icon={Share2}
              className=" py-2 pb-3"
              iconColor="primary"
              onPress={onInvite}
            />
            {(!isAgent || me?.role == "user") && (
              <Divider className=" h-[0.3px] bg-background-info mb-4" />
            )}
            {!isAgent && me?.role == "user" && (
              <MenuListItem
                title="Become an Agent"
                description={`Join us as an agent to earn more`}
                icon={Sparkle}
                className="py-2"
                iconColor="gray-600"
                onPress={() => {
                  if (!me?.id) {
                    openSignInModal({
                      visible: true,
                      onLoginSuccess: () => {
                        router.push("/forms/agent");
                      },
                    });
                  } else {
                    router.push("/forms/agent");
                  }
                }}
              />
            )}
            <Divider className=" h-[0.3px] bg-background-info mb-4" />
            <MenuListItem
              title="Help and Support"
              description="Get help and support"
              onPress={() => {
                router.push("/support");
              }}
              icon={HelpCircle}
              className="py-2"
              iconColor="yellow-600"
            />

            {hasAuth && (
              <Pressable
                onPress={onLogout}
                className="bg-background-muted h-14 mt-8 rounded-xl px-4 flex-row justify-center items-center gap-2"
              >
                <Text size="lg">Sign Out</Text>
                <Icon size="md" as={LogOut} className="text-primary" />
              </Pressable>
            )}
          </View>
        </View>

        <LogoutAlertDialog
          setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
          openLogoutAlertDialog={openLogoutAlertDialog}
        />
      </BodyScrollView>
    </>
  );
}
