import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "@/components/search/Loading";
import BackgroundView from "@/components/layouts/BackgroundView";
import LoadingLine from "@/components/custom/HorizontalLoader";
import { router, useGlobalSearchParams, usePathname } from "expo-router";

const { height: h, width } = Dimensions.get("window");

export default function ReelScreen() {
  const { propertyId } = useGlobalSearchParams() as { propertyId: string };
  const {
    reels,
    videos,
    hasNextPage,
    loading,
    fetchNextPage,
    isFetchingNextPage: fetching,
    forceRefresh,
  } = useReels();
  const bottomHeight = useBottomTabBarHeight();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlashList<ReelVideo>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playersRef = useRef<Record<string, VideoPlayerHandle | null>>({});
  const height = useMemo(
    () => (Platforms.isIOS() ? h - bottomHeight : h - insets.bottom),
    [h, bottomHeight, insets]
  );
  const isVisible = useMemo(() => path.includes("/reels"), [path]);
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
  useEffect(() => {
    if (videos?.length < 1) {
      setTimeout(() => forceRefresh(), 300);
    }
  }, [videos]);
  useEffect(() => {
    if (reels?.length < 1) {
      forceRefresh();
    }
  }, [reels]);
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
  const scrollToReelById = (reelId: string) => {
    const index = reels.findIndex((reel) => reel.id === reelId);
    if (index !== -1 && listRef.current) {
      listRef.current.scrollToIndex({ index, animated: true });
    }
  };
  useEffect(() => {
    if (propertyId && isVisible) {
      scrollToReelById(propertyId);
      router.setParams({});
    }
  }, [propertyId, isVisible]);
  return (
    <>
      <Box
        className="flex-1"
        style={{ paddingBottom: Platforms.isIOS() ? bottomHeight : undefined }}
      >
        <FlashList
          data={reels}
          ref={listRef}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={currentIndex}
          pagingEnabled
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={forceRefresh} />
          }
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumEnd}
          estimatedItemSize={height}
          snapToInterval={height}
          ListEmptyComponent={() =>
            loading ? (
              <BackgroundView style={{ height: height }}>
                <View className="flex-1 bg-black/60 justify-center items-center">
                  <Loading />
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
          ListFooterComponent={<LoadingLine />}
        />
      </Box>
    </>
  );
}
