import React, { useRef, useState } from "react";
import { Box, View } from "@/components/ui";
import PagerView from "react-native-pager-view";
import { useLocalSearchParams } from "expo-router";
import { ActivitiesTabs } from "@/components/profile/activities/ActivitiesTab";
import BlockedList from "@/components/profile/activities/blocked";
import FollowersList from "@/components/profile/activities/Followers";
import FollowingList from "@/components/profile/activities/Following";
import { ActivitiesList } from "@/components/profile/activities/activities";

const TABS = ["Followers", "Following", "Blocked", "Activities"];

export default function Activities() {
  const { userId } = useLocalSearchParams() as {
    userId: string;
  };
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const onTabChange = React.useCallback((index: number) => {
    setCurrentPage(index);
    pagerRef.current?.setPage(index);
  }, []);

  return (
    <>
      <Box className="flex-1 relative">
        <ActivitiesTabs
          currentPage={currentPage}
          setCurrentPage={onTabChange}
          tabs={TABS}
        />
        <PagerView
          initialPage={0}
          style={{ flex: 1 }}
          ref={pagerRef}
          offscreenPageLimit={1}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          <View key="followers" style={{ flex: 1 }}>
            {currentPage == 0 && <FollowersList userId={userId} />}
          </View>

          <View key="following" style={{ flex: 1 }}>
            {currentPage == 1 && <FollowingList userId={userId} />}
          </View>

          <View key="blocked" style={{ flex: 1 }}>
            {currentPage == 2 && <BlockedList userId={userId} />}
          </View>
          <View key="activity" style={{ flex: 1 }}>
            {currentPage == 3 && <ActivitiesList userId={userId} />}
          </View>
        </PagerView>
      </Box>
    </>
  );
}
