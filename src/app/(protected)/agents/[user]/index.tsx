import React, { useCallback, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  scrollTo,
  useAnimatedRef,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import PagerView from "react-native-pager-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Box, Text, View } from "@/components/ui";
import { ProfileTopSection } from "@/components/profile/ProfileTopSection";
import ProfileTabHeaderSection from "@/components/profile/ProfileTabHeaderSection";
import PropertiesTabView from "@/components/profile/PropertiesTab";
import AgentProfileList from "@/components/profile/agents";
import BeachPersonWaterParasolSingleColorIcon from "@/components/icons/BeachPersonWaterParasolIcon";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";

const TABS = ["Properties", "Reviews"];
export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useLocalSearchParams() as { user: string };
  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["user", user],
    queryFn: () => getUser(user),
  });
  const userData = useMemo(() => data || null, [data]);
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAgents, setShowAgents] = useState(false);
  const scrollYs = useRef(TABS.map(() => useSharedValue(0))).current;
  const scrollRefs = useRef(TABS.map(() => useAnimatedRef())).current;

  const [headerOnlyHeight, setHeaderOnlyHeight] = useState(0);
  const [tabBarHeight, setTabBarHeight] = useState(0);
  const fullHeaderHeight = headerOnlyHeight + tabBarHeight;
  const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    setHeaderOnlyHeight(Math.round(e.nativeEvent.layout.height));
  }, []);

  const lastTitleState = useSharedValue<"profile" | "name">("profile");

  const onTabBarLayout = useCallback((e: LayoutChangeEvent) => {
    setTabBarHeight(Math.round(e.nativeEvent.layout.height));
  }, []);

  const onTabChange = React.useCallback((index: number) => {
    setCurrentPage(index);
    pagerRef.current?.setPage(index);
  }, []);
  if (!isLoading && !userData) return <EmptyProfile />;
  return (
    <>
      <FullHeightLoaderWrapper loading={isLoading}>
        <Box className="flex-1">
          <View>
            {userData && (
              <ProfileTopSection
                setShowAgents={setShowAgents}
                showAgents={showAgents}
                userData={userData}
              />
            )}
          </View>
          <View>
            {userData && (
              <ProfileTabHeaderSection
                activeIndex={currentPage}
                onTabChange={onTabChange}
                profile={userData}
              />
            )}
          </View>

          <PagerView
            style={{ flex: 1 }}
            initialPage={0}
            ref={pagerRef}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          >
            {TABS.map((tab, index) => {
              switch (tab) {
                case "Properties":
                  return (
                    <View style={{ flex: 1 }} key={index}>
                      {user && currentPage === index ? (
                        <PropertiesTabView
                          key={index}
                          refetch={refetch}
                          profileId={user}
                        />
                      ) : null}
                    </View>
                  );
                case "Reviews":
                  return (
                    <View style={{ flex: 1 }} key={index}>
                      {user && currentPage === index ? (
                        <PropertiesTabView
                          key={index}
                          refetch={refetch}
                          profileId={user}
                          type={false}
                        />
                      ) : null}
                    </View>
                  );
                default:
                  return null;
              }
            })}
          </PagerView>
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
