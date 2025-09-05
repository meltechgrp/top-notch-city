import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Box, View } from "@/components/ui";
import PagerView from "react-native-pager-view";
import ReelList from "@/components/reel/ReelList";
import ReelTabs from "@/components/reel/ReelTabs";
import AgentList from "@/components/reel/ReelAgents";
import ReelPhotoList from "@/components/reel/ReelPhotos";

const TABS = ["Photos", "Videos", "Agents"];

export default function ReelScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(1);
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
          initialPage={1}
          style={StyleSheet.absoluteFill}
          ref={pagerRef}
          offscreenPageLimit={1}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {/* Photos */}
          <View key="photos" style={{ flex: 1 }}>
            <ReelPhotoList visible={currentPage == 0} />
          </View>

          {/* Videos */}
          <View key="videos" style={{ flex: 1 }}>
            <ReelList visible={currentPage == 1} />
          </View>

          {/* Agents */}
          <View key="agents" style={{ flex: 1 }}>
            <AgentList visible={currentPage == 2} />
          </View>
        </PagerView>
      </Box>
    </>
  );
}
