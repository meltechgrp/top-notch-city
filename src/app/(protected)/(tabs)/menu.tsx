import { Text, View } from "@/components/ui";
import { useRouter } from "expo-router";
import { Share2, User, UserPlus } from "lucide-react-native";
import { getQuickMenuItems } from "@/components/menu/menuitems";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import AdminCards from "@/components/admin/dashboard/AdminCards";
import AgentCards from "@/components/agent/dashboard/AgentCards";
import { MenuListItem } from "@/components/menu/MenuListItem";
import CampaignCard from "@/components/profile/CampaignCard";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";
import SearchListView from "@/components/search/SearchListView";
import SearchHeader from "@/components/search/Searchheader";
import { useMe } from "@/hooks/useMe";
import { useSearch } from "@/hooks/useSearch";
import { RefreshControl } from "react-native";
import eventBus from "@/lib/eventBus";
import React from "react";

function UserExploreList() {
  const [showFilter, setShowFilter] = React.useState(false);
  const { search, results, query, properties } = useSearch();

  return (
    <View className="flex-1 bg-background">
      <SearchHeader
        filter={search.filter}
        onUpdate={search.setFilters}
        setLocationBottomSheet={() => {}}
        setShowFilter={() => setShowFilter(true)}
        refetch={query.refetchAndApply}
        disableBack
      />

      <SearchListView
        setShowFilter={() => setShowFilter(true)}
        headerOnlyHeight={104}
        isLoading={query.loading}
        refetch={query.refetchAndApply}
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        properties={properties}
      />

      <SearchFilterBottomSheet
        show={showFilter}
        onDismiss={() => setShowFilter(false)}
        onApply={query.applyCachedResults as any}
        onReset={search.resetSome as any}
        onUpdate={search.setFilters}
        loading={query.loading}
        filter={search.filter}
        total={results.total}
        showPurpose
      />
    </View>
  );
}

export default function Menu() {
  const { me, isAdmin, isAgent } = useMe();
  const router = useRouter();
  const quickMenuItems = getQuickMenuItems({ me, isAdmin, isAgent });
  if (me?.role === "user") {
    return <UserExploreList />;
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
                  withBorder={i !== quickMenuItems.length - 1}
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
