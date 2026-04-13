import { Text, View } from "@/components/ui";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import {
  Bell,
  HelpCircle,
  House,
  NotebookText,
  Share2,
  Sparkle,
  Trash2,
  UserCircle,
  Users,
  Zap,
} from "lucide-react-native";
import { MenuListItem } from "@/components/menu/MenuListItem";
import { Divider } from "@/components/ui/divider";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { openAccessModal } from "@/components/globals/AuthModals";
import { Fetch } from "@/actions/utills";
import { getUniqueIdSync } from "react-native-device-info";
import LogoutButton from "@/components/settings/LogoutButton";
import { useAccounts } from "@/hooks/useAccounts";
import { NotLoggedInProfile } from "@/components/profile/ProfileWrapper";
import { useMe } from "@/hooks/useMe";
import useResetAppState from "@/hooks/useResetAppState";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "@/actions/user";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { showErrorAlert } from "@/components/custom/CustomNotification";

export default function Setting() {
  const { removeAccount } = useAccounts();
  const { me, isAdmin, isAgent } = useMe();
  const resetAppState = useResetAppState();
  const router = useRouter();
  const deviceId = getUniqueIdSync();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutateAsync: deleteAccountMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteUser,
    });

  async function handleDeleteAccount() {
    if (!me?.id) return;
    const userId = me.id;
    try {
      await deleteAccountMutation({ user_id: userId });
      await removeAccount(userId);
      await resetAppState({ onlyCache: true });
      setShowDeleteModal(false);
      showErrorAlert({
        title: "Account deleted successfully",
        alertType: "success",
      });
      router.dismissTo("/home");
    } catch {
      showErrorAlert({
        title: "Failed to delete account. Try again.",
        alertType: "error",
      });
      throw new Error("delete failed");
    }
  }

  async function logout() {
    if (!me?.id) return;
    const userId = me.id;

    try {
      await Fetch("/logout", {
        method: "POST",
        data: { device_id: deviceId },
      });
    } catch {}

    await removeAccount(userId);
    await resetAppState({ onlyCache: true });
    router.dismissTo("/home");
  }
  async function onLogout() {
    if (!me) return;
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
  if (!me) return <NotLoggedInProfile userType={"owner"} />;
  return (
    <>
      <BodyScrollView>
        <View className="pt-4 flex-1 gap-4">
          <View className="gap-3 px-4">
            <Text className="font-medium text-typography/80">Your account</Text>
            <MenuListItem
              title="Account Manager"
              description="Password, email, personal details, linked accounts and devices"
              onPress={() => {
                if (!me) {
                  openAccessModal({ visible: true });
                } else {
                  router.push("/settings/manager");
                }
              }}
              withBorder={false}
              icon={UserCircle}
            />
            <Text className="text-sm text-typography/80">
              Manage your connected accounts, password and devices accross
              TopNotch City Applications
            </Text>
          </View>
          <Divider className="h-2 bg-background-muted" />
          <View className="gap-4 px-4">
            <Text className="font-medium text-typography/80">
              Your activities
            </Text>
            <View className="gap-4">
              {isAgent && (
                <MenuListItem
                  title="My Properties"
                  onPress={() => {
                    if (!me) {
                      openAccessModal({ visible: true });
                    } else {
                      router.push({
                        pathname: "/agents/[userId]/properties",
                        params: {
                          userId: me.id,
                        },
                      });
                    }
                  }}
                  icon={House}
                  withBorder={false}
                />
              )}
              <MenuListItem
                title="Followers"
                withBorder={false}
                onPress={() =>
                  router.push({
                    pathname: "/agents/[userId]/activities",
                    params: {
                      userId: me.id,
                    },
                  })
                }
                icon={Users}
              />
              {isAgent && (
                <MenuListItem
                  title="Greeting message"
                  withBorder={false}
                  onPress={() =>
                    router.push({
                      pathname: "/agents/[userId]/greeting",
                      params: {
                        userId: me.id,
                      },
                    })
                  }
                  icon={Zap}
                />
              )}
              <MenuListItem
                title="Saved"
                withBorder={false}
                onPress={() =>
                  router.push({
                    pathname: "/agents/[userId]/wishlist",
                    params: {
                      userId: me.id,
                    },
                  })
                }
                icon={House}
              />
              <MenuListItem
                title="Notifications"
                withBorder={false}
                onPress={() => router.push("/notification")}
                icon={Bell}
              />
              <MenuListItem
                title="Permissions"
                withBorder={false}
                onPress={() => router.push("/settings/permissions")}
                icon={Bell}
              />
            </View>
          </View>
          <Divider className="h-2 bg-background-muted" />
          <View className="gap-4 px-4">
            <Text className="font-medium text-typography/80">Help center</Text>
            <View className="gap-4">
              <MenuListItem
                title="Send us a feedback"
                withBorder={false}
                onPress={() => router.push("/report")}
                icon={NotebookText}
              />
              <MenuListItem
                title="Invite friends"
                withBorder={false}
                icon={Share2}
                onPress={() => router.push("/share")}
              />
              {me?.role == "user" && (
                <MenuListItem
                  title="Become an Agent"
                  withBorder={false}
                  icon={Sparkle}
                  onPress={() => {
                    if (me) {
                      openAccessModal({ visible: true });
                    } else {
                      router.push(`/forms/agent`);
                    }
                  }}
                />
              )}
              <MenuListItem
                title="Help and Support"
                withBorder={false}
                onPress={() => {
                  router.push("/support");
                }}
                icon={HelpCircle}
              />
            </View>
          </View>
          <Divider className="h-2 bg-background-muted" />
          <View className="gap-4 px-4">
            <MenuListItem
              title="Delete account"
              description="Permanently delete your account and all associated data"
              withBorder={false}
              icon={Trash2}
              onPress={() => setShowDeleteModal(true)}
            />
          </View>
          <Divider className="h-2 bg-background-muted" />
          <View className="px-4">
            {me && <LogoutButton onLogout={onLogout} />}
          </View>
        </View>
      </BodyScrollView>
      <ConfirmationModal
        visible={showDeleteModal}
        onDismiss={() => {
          if (isDeleting) return;
          setShowDeleteModal(false);
        }}
        header="Delete account"
        description="This will permanently delete your account, properties and message history on this device. This cannot be undone."
        confirmText="Delete"
        onDelete={handleDeleteAccount}
      />
    </>
  );
}
