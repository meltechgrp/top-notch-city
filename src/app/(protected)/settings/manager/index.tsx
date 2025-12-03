import { Button, Text, View } from "@/components/ui";
import { useRouter } from "expo-router";
import { Bell, House, Link, Users } from "lucide-react-native";
import { MenuListItem } from "@/components/menu/MenuListItem";
import { Divider } from "@/components/ui/divider";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { NotLoggedInProfile } from "@/components/profile/ProfileWrapper";
import { useStore } from "@/store";
import { openAccountsModal } from "@/components/globals/AuthModals";

export default function Setting() {
  const { me } = useStore();
  const router = useRouter();

  if (!me) return <NotLoggedInProfile userType={"owner"} />;
  return (
    <>
      <BodyScrollView>
        <View className="pt-4 flex-1 gap-4">
          <View className="gap-4 px-4">
            <Text className="font-medium text-typography/80">Your account</Text>
            <View className="gap-4">
              <MenuListItem
                title="Linked accounts"
                withBorder={false}
                onPress={() => openAccountsModal({ visible: true })}
                icon={Link}
              />
              <MenuListItem
                title="Update profile"
                withBorder={false}
                onPress={() =>
                  router.push({
                    pathname: "/agents/[userId]/account",
                    params: {
                      userId: me.id,
                    },
                  })
                }
                icon={Users}
              />
              {/* <MenuListItem
                title="Devices"
                withBorder={false}
                onPress={() => router.push("/notification")}
                icon={Bell}
              /> */}
            </View>
          </View>
          <Divider className="h-2 bg-background-muted" />
          <View className="gap-4 px-4 mt-4">
            <Button
              onPress={() => router.push("/settings/manager/change-password")}
              className="h-12 bg-background-muted"
            >
              <Text>Change Password</Text>
            </Button>
            <Button
              onPress={() => router.push("/settings/manager/delete-account")}
              className="h-12"
            >
              <Text>Delete Account</Text>
            </Button>
          </View>
        </View>
      </BodyScrollView>
    </>
  );
}
