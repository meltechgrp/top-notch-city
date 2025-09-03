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
import { Alert, Platform, Share } from "react-native";
import React, { useMemo } from "react";
import {
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquareMore,
  NotebookText,
  Settings,
  Share2,
  Sparkle,
} from "lucide-react-native";
import { MenuListItem } from "@/components/menu/MenuListItem";
import config from "@/config";
import { Divider } from "@/components/ui/divider";
import { cn, fullName } from "@/lib/utils";
import { useStore } from "@/store";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { getImageUrl } from "@/lib/api";
import { openSignInModal } from "@/components/globals/AuthModals";
import useResetAppState from "@/hooks/useResetAppState";
// import * as FileSystem from "expo-file-system";

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
      const message =
        `🏘️ Invite your friends to join *TopNotch City Estate*.\n\n` +
        `Discover amazing apartments and real estate opportunities near you.\n\n` +
        `👉 Tap here to join: ${config.websiteUrl}/home `;

      // Optionally prepare an image for sharing
      // const imageUrl = "https://yourdomain.com/invite-banner.jpg"; // <-- replace with your image URL
      // const imageName = FileSystem.documentDirectory + "invite-banner.jpg";

      // Download image locally
      // const download = await FileSystem.downloadAsync(imageUrl, imageName);

      // Share with image if supported
      // if (Platform.OS !== "web" && (await Sharing.isAvailableAsync())) {
      //   await Sharing.shareAsync(download.uri, {
      //     mimeType: "image/jpeg",
      //     dialogTitle: "Invite to TopNotch City Estate",
      //   });
      // } else {
      // Fallback to basic text sharing
      const result = await Share.share({
        title: "Join TopNotch City Estate",
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
      // }
    } catch (error: any) {
      alert(error.message);
    }
  }
  const isAgent = false;
  const isAdmin = useMemo(() => me?.role == "admin" || me?.is_superuser, [me]);
  //   useMemo(
  //   () => data?.some((ap) => ap.status == "approved"),
  //   [data]
  // );
  return (
    <>
      <BodyScrollView withBackground={true}>
        <View
          className={cn(
            "px-4 py-2.5 mt-2 to-50%",
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
                    console.log("logged in");
                  },
                });
              } else if (me.role == "agent") {
                router.push({
                  pathname: "/profile/[user]",
                  params: { user: me.id },
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
            {me && (me?.role != "user" || me?.is_superuser) && (
              <MenuListItem
                title={
                  me.role == "admin" || me?.is_superuser
                    ? "Dashboard"
                    : "Analytics"
                }
                description={
                  me.role == "admin" || me?.is_superuser
                    ? "View admin dashboard"
                    : "View your dashboard"
                }
                onPress={() => {
                  if (isAdmin) {
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
              title="Messages"
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
                  router.push("/messages");
                }
              }}
              icon={MessageSquareMore}
              iconColor="primary"
              className=" py-2 pb-3"
            />
            <Divider className=" h-[0.3px] bg-background-info mb-4" />
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
              title="Send us a feedback"
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
            <Divider className=" h-[0.3px] bg-background-info mb-4" />
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
            {!isAgent && me?.role == "user" && (
              <Divider className=" h-[0.3px] bg-background-info mb-4" />
            )}
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
      </BodyScrollView>
    </>
  );
}
