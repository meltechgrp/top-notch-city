import React, { useMemo, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Box, Icon, Pressable, Text, View } from "@/components/ui";
import PropertiesTabView from "@/components/profile/PropertiesTab";
import BeachPersonWaterParasolSingleColorIcon from "@/components/icons/BeachPersonWaterParasolIcon";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";
import headerLeft from "@/components/shared/headerLeft";
import { MoreHorizontal, Share } from "lucide-react-native";
import { FlashList } from "@shopify/flash-list";
import { ProfileDetails } from "@/components/agents/ProfileDetails";
import { ProfileTopSection } from "@/components/agents/ProfileTopSection";
import ProfileTabHeaderSection from "@/components/profile/ProfileTabHeaderSection";
import ReviewsTabView from "@/components/profile/ReviewsTabView";

const TABS = ["All", "Houses", "Lands", "Reviews"] as const;
export default function ProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams() as { userId: string };
  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const user = useMemo(() => data || null, [data]);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");

  if (!isLoading && !user) return <EmptyProfile />;

  const dataForTab = useMemo(() => {
    switch (activeTab) {
      case "Houses":
        return [{ type: "houses" }];

      case "Lands":
        return [{ type: "lands" }];

      case "Reviews":
        return [{ type: "reviews" }];

      case "All":
      default:
        return [{ type: "all" }];
    }
  }, [activeTab]);

  const stickyHeaderIndices = [0, 1];

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: headerLeft(),
          headerRight: () => (
            <View className="px-4 flex-row gap-6">
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/agents/[userId]/qrcode",
                    params: {
                      userId,
                    },
                  })
                }
              >
                <Icon as={Share} className="w-6 h-6" />
              </Pressable>
              <Pressable onPress={() => {}}>
                <Icon as={MoreHorizontal} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
        }}
      />
      <FullHeightLoaderWrapper loading={isLoading}>
        <Box className="flex-1">
          <FlashList
            data={dataForTab}
            keyExtractor={(_, idx) => `${activeTab}-${idx}`}
            renderItem={({ item }) => {
              switch (item.type) {
                case "all":
                  return (
                    <View className="mt-4">
                      <ProfileDetails me={user} />
                    </View>
                  );

                case "houses":
                  return (
                    <View className="mt-4">
                      {user && <PropertiesTabView profileId={user.id} />}
                    </View>
                  );
                case "lands":
                  return (
                    <View className="mt-4">
                      {user && (
                        <PropertiesTabView profileId={user.id} type="lands" />
                      )}
                    </View>
                  );

                case "reviews":
                  return (
                    <View className="mt-4">
                      {user && <ReviewsTabView profileId={user.id} />}
                    </View>
                  );

                default:
                  return null;
              }
            }}
            ListHeaderComponent={
              <View>
                {user && <ProfileTopSection userData={user} />}

                {user && (
                  <ProfileTabHeaderSection
                    activeIndex={TABS.indexOf(activeTab)}
                    onTabChange={(index) => setActiveTab(TABS[index])}
                    profile={user}
                    profileTabs={[
                      {
                        label: "All",
                        key: "all",
                      },
                      {
                        label: "Houses",
                        key: "houses",
                      },
                      {
                        label: "Lands",
                        key: "lands",
                      },
                      {
                        label: "Reviews",
                        key: "reviews",
                      },
                    ]}
                  />
                )}
              </View>
            }
            stickyHeaderIndices={stickyHeaderIndices}
            contentContainerStyle={{
              paddingBottom: 50,
            }}
          />
        </Box>
      </FullHeightLoaderWrapper>
    </>
  );
}

function EmptyProfile() {
  return (
    <View className="flex-1 bg-background-muted justify-center items-center px-4">
      <BeachPersonWaterParasolSingleColorIcon
        width={64}
        height={64}
        className="text-gray-500"
      />
      <Text className="text-gray-500 mt-2">Nothing to see here</Text>
    </View>
  );
}
