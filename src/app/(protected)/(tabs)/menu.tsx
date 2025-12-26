import { Text, View } from "@/components/ui";
import { useRouter } from "expo-router";
import { Share2, User, UserPlus } from "lucide-react-native";
import { getQuickMenuItems } from "@/components/menu/menuitems";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import AdminCards from "@/components/admin/dashboard/AdminCards";
import AgentCards from "@/components/agent/dashboard/AgentCards";
import { MenuListItem } from "@/components/menu/MenuListItem";
import CampaignCard from "@/components/profile/CampaignCard";
import SearchWrapper from "@/components/search/SearchWrapper";
import { useMe } from "@/hooks/useMe";
import { RefreshControl } from "react-native";
import eventBus from "@/lib/eventBus";

export default function Menu() {
  const { me, isAdmin, isAgent } = useMe();
  const router = useRouter();
  const quickMenuItems = getQuickMenuItems({ me, isAdmin, isAgent });
  if (me?.role == "user") {
    return <SearchWrapper disableBack isTab />;
  }
  return (
    <>
      <BodyScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => eventBus.dispatchEvent("REFRESH_DASHBOARD", null)}
          />
        }
        withBackground
        className="pt-2"
      >
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
        {isAgent && (
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
        )}
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
