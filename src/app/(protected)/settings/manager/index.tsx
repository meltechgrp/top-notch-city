import { Text, View } from "@/components/ui";
import { useRouter } from "expo-router";
import { Link, Lock, Trash2, Users } from "lucide-react-native";
import { MenuListItem } from "@/components/menu/MenuListItem";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { NotLoggedInProfile } from "@/components/profile/ProfileWrapper";
import { openAccountsModal } from "@/components/globals/AuthModals";
import { useMe } from "@/hooks/useMe";

export default function Setting() {
  const { me } = useMe();
  const router = useRouter();

  if (!me) return <NotLoggedInProfile userType={"owner"} />;
  return (
    <>
      <BodyScrollView>
        <View className="pt-4 flex-1 gap-4">
          <View className="gap-4 px-4">
            <Text className="font-medium text-typography/80">Your account</Text>
            <View className="gap-4 bg-background-muted p-4 rounded-xl border border-outline-100">
              <MenuListItem
                title="Linked accounts"
                onPress={() => openAccountsModal({ visible: true })}
                icon={Link}
              />
              <MenuListItem
                title="Update profile"
                onPress={() =>
                  router.push({
                    pathname: "/agents/[userId]/account",
                    params: {
                      userId: me.id,
                    },
                  })
                }
                withBorder={false}
                icon={Users}
              />
              {/* <MenuListItem
                title="Devices"
                onPress={() => router.push("/notification")}
                icon={Bell}
              /> */}
            </View>
            <View className="gap-4 p-4 bg-background-muted border border-outline-100 rounded-xl">
              <MenuListItem
                title="Change Password"
                onPress={() => router.push("/settings/manager/change-password")}
                icon={Lock}
              />
              <MenuListItem
                title="Delete Account"
                onPress={() => router.push("/settings/manager/delete-account")}
                icon={Trash2}
                withBorder={false}
              />
            </View>
          </View>
        </View>
      </BodyScrollView>
    </>
  );
}
