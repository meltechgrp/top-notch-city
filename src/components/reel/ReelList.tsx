import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from "react-native";
import { VideoPlayer } from "@/components/custom/VideoPlayer";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, View } from "@/components/ui";
import Platforms from "@/constants/Plaforms";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useReels } from "@/hooks/useReel";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import BackgroundView from "@/components/layouts/BackgroundView";
import LoadingLine from "@/components/custom/HorizontalLoader";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { useDebouncedVisibility } from "@/hooks/useDebouncedVisibility";

const { height: h, width } = Dimensions.get("window");

function ReelList() {
  const {
    reels,
    hasNextPage,
    loading,
    fetchNextPage,
    isFetchingNextPage: fetching,
    refetch,
  } = useReels();
  const bottomHeight = useBottomTabBarHeight();
  const listRef = useRef<FlashListRef<Reel>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentRef = useRef<VideoPlayerHandle>(null);
  const playersRef = useRef<Record<string, VideoPlayerHandle | null>>({});
  const height = useMemo(
    () => (Platforms.isIOS() ? h - bottomHeight : h),
    [h, bottomHeight]
  );
  const setActiveIndex = useCallback(
    (nextIndex: number) => {
      if (nextIndex == null || nextIndex < 0 || nextIndex >= reels.length)
        return;

      // Pause and reset all other players
      reels.forEach((reel, i) => {
        const ref = playersRef.current[reel.id];
        if (!ref || i === nextIndex) return;
        ref.reset?.();
      });

      // Update current index after cleanup
      setCurrentIndex(nextIndex);
    },
    [reels]
  );
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setActiveIndex(index);
    }
  }).current;
  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.y / height);
      setActiveIndex(idx);
    },
    [setActiveIndex]
  );
  const renderItem = useCallback(
    ({ item, index }: { item: Reel; index: number }) => (
      <VideoPlayer
        style={{
          height: height,
          width,
        }}
        ref={(ref) => {
          playersRef.current[item.id] = ref;
          if (index === currentIndex) currentRef.current = ref;
        }}
        reel={item}
        fullScreen
        shouldPlay={index === currentIndex}
      />
    ),
    [currentIndex]
  );
  useDebouncedVisibility({ visible: true, currentIndex, reels, playersRef });
  return (
    <>
      <Box className="flex-1">
        <FlashList
          data={reels}
          ref={listRef}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={currentIndex}
          pagingEnabled
          refreshControl={
            <RefreshControl
              progressViewOffset={30}
              colors={["#fff"]}
              refreshing={fetching}
              onRefresh={refetch}
            />
          }
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumEnd}
          snapToInterval={height}
          ListEmptyComponent={() =>
            loading ? (
              <BackgroundView style={{ height: height }}>
                <View className="flex-1 bg-black/20 justify-center items-center">
                  <SpinningLoader color="#FF4C00" size={40} />
                </View>
              </BackgroundView>
            ) : (
              <BackgroundView style={{ height: height }}>
                <MiniEmptyState title="No Reels Found" />
              </BackgroundView>
            )
          }
          contentContainerStyle={{ padding: 0 }}
          onEndReached={() => {
            if (hasNextPage && !loading) fetchNextPage?.();
          }}
          onEndReachedThreshold={0.3}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ListFooterComponent={<LoadingLine />}
        />
      </Box>
    </>
  );
}

export default memo(ReelList);
