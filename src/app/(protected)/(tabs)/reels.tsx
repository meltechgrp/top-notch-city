import React, { useCallback, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Box, View } from "@/components/ui";
import PagerView from "react-native-pager-view";
import ReelList from "@/components/reel/ReelList";
import ReelTabs from "@/components/reel/ReelTabs";
import AgentList from "@/components/reel/ReelAgents";
import ReelPhotoList from "@/components/reel/ReelLands";
import { useFocusEffect } from "expo-router";

const TABS = ["Lands", "Videos", "Agents"];

export default function ReelScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const onTabChange = React.useCallback((index: number) => {
    setCurrentPage(index);
    pagerRef.current?.setPage(index);
  }, []);

  useFocusEffect(
    useCallback(() => {
      onTabChange(1);
    }, [])
  );
  return (
    <>
      <Box className="flex-1 relative">
        <ReelTabs
          currentPage={currentPage}
          setCurrentPage={onTabChange}
          tabs={TABS}
        />
        <PagerView
          initialPage={1}
          style={StyleSheet.absoluteFill}
          ref={pagerRef}
          offscreenPageLimit={1}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          <View key="lands" style={{ flex: 1 }}>
            <ReelPhotoList visible={currentPage == 0} />
          </View>

          <View key="videos" style={{ flex: 1 }}>
            <ReelList visible={currentPage == 1} />
          </View>

          <View key="agents" style={{ flex: 1 }}>
            <AgentList visible={currentPage == 2} />
          </View>
        </PagerView>
      </Box>
    </>
  );
}
