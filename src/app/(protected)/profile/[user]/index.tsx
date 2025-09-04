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
import BeachPersonWaterParasolSingleColorIcon from "@/components/icons/BeachPersonWaterParasolIcon";
import ReviewsTabView from "@/components/profile/ReviewsTab";
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

  const headerTranslateY = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -Math.min(scrollYs[currentPage].value, headerOnlyHeight),
        },
      ],
    };
  }, [currentPage, headerOnlyHeight]);

  const scrollToTop = React.useCallback((index: number) => {
    const ref = scrollRefs[index];
    if (ref) {
      scrollTo(ref, 0, 0, true);
    }
  }, []);

  const onTabChange = React.useCallback(
    (index: number) => {
      setCurrentPage(index);
      pagerRef.current?.setPage(index);
      scrollToTop(index);
    },
    [scrollToTop]
  );
  useAnimatedReaction(
    () => scrollYs[currentPage].value,
    (scroll) => {
      if (!userData) return;

      const threshold = headerOnlyHeight / 4;

      if (scroll > threshold && lastTitleState.value !== "name") {
        lastTitleState.value = "name";
        runOnJS(router.setParams)({
          title: userData.first_name + " " + userData.last_name,
        });
      } else if (scroll <= threshold && lastTitleState.value !== "profile") {
        lastTitleState.value = "profile";
        runOnJS(router.setParams)({
          title: "Profile",
        });
      }
    },
    [currentPage, headerOnlyHeight, userData]
  );
  if (!isLoading && !userData) return <EmptyProfile />;
  return (
    <>
      <FullHeightLoaderWrapper loading={isLoading}>
        <Box className="flex-1">
          <Animated.View
            style={[
              headerTranslateY,
              {
                zIndex: 10,
                position: "absolute",
                width: "100%",
              },
            ]}
            pointerEvents="box-none"
          >
            <View onLayout={onHeaderLayout} pointerEvents="box-none">
              {userData && <ProfileTopSection userData={userData} />}
            </View>
            <View onLayout={onTabBarLayout} className=" bg-background">
              {userData && (
                <ProfileTabHeaderSection
                  activeIndex={currentPage}
                  onTabChange={onTabChange}
                  profile={userData}
                />
              )}
            </View>
          </Animated.View>

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
                          listRef={scrollRefs[index]}
                          profileId={user}
                          scrollElRef={scrollRefs[index]}
                          headerHeight={fullHeaderHeight}
                          scrollY={scrollYs[index]}
                        />
                      ) : null}
                    </View>
                  );
                case "Reviews":
                  return (
                    <View style={{ flex: 1 }} key={index}>
                      {user && currentPage === index ? (
                        <ReviewsTabView
                          key={index}
                          listRef={scrollRefs[index]}
                          profileId={user}
                          scrollElRef={scrollRefs[index]}
                          headerHeight={fullHeaderHeight}
                          scrollY={scrollYs[index]}
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
