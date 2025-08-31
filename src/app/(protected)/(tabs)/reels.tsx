import { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from "react-native";
import { VideoPlayer } from "@/components/custom/VideoPlayer";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box } from "@/components/ui";
import Platforms from "@/constants/Plaforms";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useReels } from "@/hooks/useReel";

const { height: h, width } = Dimensions.get("window");

export default function ReelScreen() {
  const {
    reels,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage: loading,
  } = useReels();
  const bottomHeight = useBottomTabBarHeight();
  const [currentIndex, setCurrentIndex] = useState(0);
  const playersRef = useRef<Record<string, VideoPlayerHandle | null>>({});
  const height = useMemo(
    () => (Platforms.isIOS() ? h - bottomHeight : h),
    [h, bottomHeight]
  );
  const setActiveIndex = useCallback(
    (nextIndex: number) => {
      // Guard
      if (nextIndex == null || nextIndex < 0 || nextIndex >= reels.length)
        return;

      setCurrentIndex(nextIndex);

      reels.forEach((v, i) => {
        const ref = playersRef.current[v.id];
        if (!ref) return;
        ref.reset();
      });
    },
    [reels]
  );
  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.y / height);
      setActiveIndex(idx);
    },
    [setActiveIndex]
  );
  const renderItem = useCallback(
    ({ item, index }: { item: ReelVideo; index: number }) => (
      <VideoPlayer
        style={{
          height: height,
          width,
        }}
        reel={item}
        fullScreen
        shouldPlay={index === currentIndex}
      />
    ),
    [currentIndex]
  );
  return (
    <>
      <Box
        className="flex-1"
        style={{ paddingBottom: Platforms.isIOS() ? bottomHeight : undefined }}
      >
        <FlatList
          data={reels}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={currentIndex}
          pagingEnabled
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumEnd}
          initialNumToRender={1}
          snapToInterval={height}
          ListEmptyComponent={() => (
            <MiniEmptyState className=" mt-10" title={"No Reel Found"} />
          )}
          contentContainerStyle={{ padding: 0 }}
          onEndReached={() => {
            if (hasNextPage && !loading) fetchNextPage?.();
          }}
          onEndReachedThreshold={0.3}
        />
      </Box>
    </>
  );
}
