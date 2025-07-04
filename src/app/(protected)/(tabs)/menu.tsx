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
import { Stack, usePathname, useRouter } from "expo-router";
import { Share } from "react-native";
import React from "react";
import {
  ChevronRight,
  Heart,
  HelpCircle,
  LayoutDashboard,
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

export default function More() {
  const me = useStore((v) => v.me);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useResolvedTheme();
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
  return (
    <>
      {/* <Stack.Screen
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
      /> */}
      <BodyScrollView withBackground={true}>
        <View
          className={cn(
            "px-4 py-2 mt-2",
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
            className={"flex-row items-center"}
          >
            <Avatar className=" w-14 h-14">
              <AvatarFallbackText>{fullName(me)}</AvatarFallbackText>
              <AvatarBadge size="md" />
              <AvatarImage source={getImageUrl(me?.profile_image)} />
            </Avatar>
            <View className="flex-1 pl-3">
              <Text className="text-base text-typography font-medium">
                {me ? fullName(me) : "Sign in to view profile"}
              </Text>
              <Text className="text-sm text-typography/80">
                {me ? me?.email : "Account details"}
              </Text>
            </View>
            <Icon as={ChevronRight} className="" />
          </Pressable>
        </View>
        <View className="pt-8 flex-1 px-4">
          <Text className="text-sm text-typography/80 uppercase px-4 mb-2">
            Menu
          </Text>
          <View className="flex-1 mt-2">
            {me && me?.role != "user" && (
              <MenuListItem
                title="Dashboard"
                description={
                  me.role == "admin"
                    ? "View admin dashboard"
                    : "View your dashboard"
                }
                onPress={() => {
                  if (me?.role === "admin") {
                    router.dismissTo({
                      pathname: "/admin",
                    });
                  } else if (me?.role == "agent") {
                    router.push({
                      pathname: "/(protected)/agent/[agentId]",
                      params: {
                        agentId: me?.id,
                      },
                    });
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
            {/* <Divider className=" h-[0.3px] bg-background-info mb-4" />
            <MenuListItem
              title="Write a review"
              description="Let's improve the app"
              onPress={() => {}}
              icon={NotebookText}
              className="py-2"
              iconColor="yellow-600"
            /> */}
            {/* <Divider className=" h-[0.3px] bg-background-info mb-4" />
            <MenuListItem
              title="Invite friends"
              description={`Invite your friends to join ${config.appName} app`}
              icon={Share2}
              className=" py-2 pb-3"
              iconColor="primary"
              onPress={onInvite}
            /> */}
            {(!me || me?.role !== "admin") && (
              <Divider className=" h-[0.3px] bg-background-info mb-4" />
            )}
            {(!me || me?.role !== "admin") && (
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
                        router.push("/agent/form");
                      },
                    });
                  } else {
                    router.push("/agent/form");
                  }
                }}
              />
            )}
            {/* <Divider className=" h-[0.3px] bg-background-info mb-4" /> */}
            {/* <MenuListItem
              title="Help and Support"
              description="Get help and support"
              onPress={() => {
                router.push("/support");
              }}
              icon={HelpCircle}
              className="py-2"
              iconColor="yellow-600"
            /> */}
          </View>
        </View>
      </BodyScrollView>
    </>
  );
}
