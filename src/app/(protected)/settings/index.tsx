import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Pressable,
  Text,
  useResolvedTheme,
  View,
} from "@/components/ui";
import { useRouter } from "expo-router";
import { Alert, Share } from "react-native";
import {
  HelpCircle,
  House,
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
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { getImageUrl } from "@/lib/api";
import { openAccessModal } from "@/components/globals/AuthModals";
import useResetAppState from "@/hooks/useResetAppState";
import { Fetch } from "@/actions/utills";
import { getUniqueIdSync } from "react-native-device-info";
import { useUser } from "@/hooks/useUser";
import LogoutButton from "@/components/settings/LogoutButton";

export default function Setting() {
  const resetAppState = useResetAppState();
  const { hasAuth, isAdmin, isAgent, isStaff, me } = useUser();
  const router = useRouter();
  const deviceId = getUniqueIdSync();
  const theme = useResolvedTheme();

  async function logout() {
    await Fetch("/logout", {
      method: "POST",
      data: { device_id: deviceId },
    });
    resetAppState();
    router.dismissTo("/home");
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

      const result = await Share.share({
        title: "Join TopNotch City Estate",
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      alert(error.message);
    }
  }
  return (
    <>
      <BodyScrollView withBackground={true}>
        <View className="pt-8 flex-1 px-4">
          <View className="flex-1 mt-2">
            {isAgent && (
              <MenuListItem
                title="My Properties"
                description="View all your saved properties"
                onPress={() => {
                  if (!hasAuth) {
                    openAccessModal({ visible: true });
                  } else {
                    router.push("/agent");
                  }
                }}
                icon={House}
                iconColor="blue-500"
                className=" py-2 pb-3"
              />
            )}
            {(isAdmin || isAgent) && (
              <Divider className=" h-[0.3px] bg-background-info mb-4" />
            )}
            {/* <MenuListItem
              title="Settings"
              description="Change your theme and other settings"
              onPress={() => {
                router.push("/settings");
              }}
              icon={Settings}
              iconColor="gray-500"
              className=" py-2 pb-3"
            />
            <Divider className=" h-[0.3px] bg-background-info mb-4" /> */}
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
              onPress={() => router.push("/share")}
            />
            <Divider className=" h-[0.3px] bg-background-info mb-4" />
            {me?.role == "user" && (
              <MenuListItem
                title="Become an Agent"
                description={`Join us as an agent to earn more`}
                icon={Sparkle}
                className="py-2"
                iconColor="gray-600"
                onPress={() => {
                  if (hasAuth) {
                    openAccessModal({ visible: true });
                  } else {
                    router.push(`/forms/${me?.id}/agent`);
                  }
                }}
              />
            )}
            {me?.role == "user" && (
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

            {hasAuth && <LogoutButton onLogout={onLogout} />}
          </View>
        </View>
      </BodyScrollView>
    </>
  );
}
