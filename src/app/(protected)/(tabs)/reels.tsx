import React, { useCallback, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Box, View } from "@/components/ui";
import PagerView from "react-native-pager-view";
import ReelList from "@/components/reel/ReelList";
import ReelTabs from "@/components/reel/ReelTabs";
import { useFocusEffect } from "expo-router";

const TABS = ["Videos"];

export default function ReelScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const onTabChange = React.useCallback((index: number) => {
    setCurrentPage(index);
    pagerRef.current?.setPage(index);
  }, []);
  return (
    <>
      <Box className="flex-1 relative">
        <ReelTabs
          currentPage={currentPage}
          setCurrentPage={onTabChange}
          tabs={TABS}
        />
        <PagerView
          initialPage={0}
          style={StyleSheet.absoluteFill}
          ref={pagerRef}
          offscreenPageLimit={1}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          <View key="videos" style={{ flex: 1 }}>
            <ReelList visible={currentPage == 1} />
          </View>
        </PagerView>
      </Box>
    </>
  );
}
