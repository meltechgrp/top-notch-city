import { Icon, Pressable, Text, View } from "@/components/ui";
import { useUser } from "@/hooks/useUser";
import { Stack, useRouter } from "expo-router";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Share2,
  User,
  UserPlus,
} from "lucide-react-native";
import { getQuickMenuItems } from "@/components/menu/menuitems";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import AdminCards from "@/components/admin/dashboard/AdminCards";
import AgentCards from "@/components/agent/dashboard/AgentCards";
import { MenuListItem } from "@/components/menu/MenuListItem";
import CampaignCard from "@/components/profile/CampaignCard";
import { useStore } from "@/store";

export default function Menu() {
  const router = useRouter();
  const { me } = useStore.getState();
  const { isAdmin, isAgent } = useUser({ me });
  const quickMenuItems = getQuickMenuItems({ me });
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () =>
            isAdmin ? (
              <View className={"px-4 flex-row gap-6"}>
                <Pressable
                  className="p-2 bg-background-muted rounded-full"
                  onPress={() => {}}
                >
                  <Icon as={MoreHorizontal} className="w-6 h-6" />
                </Pressable>
              </View>
            ) : isAgent ? (
              <View className={"px-4 flex-row gap-6"}>
                <Pressable
                  className="p-2 bg-background-muted rounded-full"
                  onPress={() =>
                    router.push(`/agents/${me?.id}/properties/add`)
                  }
                >
                  <Icon as={PlusCircle} className="w-6 h-6" />
                </Pressable>
              </View>
            ) : undefined,
          headerRight: () => (
            <View className="px-4 flex-row gap-4">
              <Pressable
                className="p-2 bg-background-muted rounded-full"
                onPress={() => router.push("/(protected)/explore")}
              >
                <Icon as={Search} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
        }}
      />
      <BodyScrollView withBackground className="pt-2">
        {isAdmin && <AdminCards />}
        {isAgent && <AgentCards userId={me?.id!} />}
        {!me && (
          <CampaignCard
            title="Ready to buy/rent/sell?"
            subtitle="Upload listings / explore amazing properties around you with one account."
            actionLabel="Login"
            className="mt-8 mx-4"
            actionRoute={`/signin`}
          />
        )}
        <View className="mt-6 px-4">
          <Text className="mb-2 font-medium">
            {isAgent ? "Grow your bussiness" : "Explore"}
          </Text>
          <View className="gap-4 bg-background-muted p-4 rounded-xl border border-outline-100">
            {quickMenuItems.map((item, i) => (
              <MenuListItem
                key={item.label}
                title={item.label}
                icon={item.icon}
                description={item.description}
                withBorder={i != quickMenuItems.length - 1}
                onPress={() => item.link && router.push(item.link as any)}
              />
            ))}
          </View>
        </View>
        {isAgent && (
          <View className="mt-6 px-4">
            <Text className="mb-2 font-medium">Manage your account</Text>
            <View className="gap-4 bg-background-muted p-4 rounded-xl border border-outline-100">
              <MenuListItem
                title="Profile"
                icon={User}
                description="Manage address, hours, websites"
                onPress={() =>
                  router.push({
                    pathname: "/agents/[userId]/account",
                    params: {
                      userId: me?.id!,
                    },
                  })
                }
              />
              <MenuListItem
                title="Followers"
                icon={UserPlus}
                description="View followers, following and activities"
                onPress={() =>
                  router.push({
                    pathname: "/agents/[userId]/activities",
                    params: {
                      userId: me?.id!,
                    },
                  })
                }
              />
              <MenuListItem
                title="Share profile Link"
                icon={Share2}
                description="Invite clients and grow your network."
                withBorder={false}
                onPress={() =>
                  router.push({
                    pathname: "/agents/[userId]/qrcode",
                    params: {
                      userId: me?.id!,
                    },
                  })
                }
              />
            </View>
          </View>
        )}
      </BodyScrollView>
    </>
  );
}
