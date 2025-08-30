import { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import {
  VideoPlayer,
  VideoPlayerHandle,
} from "@/components/custom/VideoPlayer";
import { FlashList } from "@shopify/flash-list";
import { generateMediaUrl } from "@/lib/api";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box } from "@/components/ui";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

const { height: h, width } = Dimensions.get("window");
interface VideoRef {
  id: string;
  video: Media;
  property: Property;
}

export default function ReelScreen() {
  const {
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage: loading,
    isRefetching: refetching,
  } = useInfinityQueries({ type: "reels" });

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  const height = useMemo(() => h / 1.2, [h]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videos = useMemo(() => {
    return properties
      .map((p) => {
        return {
          id: p.id,
          video: p.media.find((m) => m.media_type == "VIDEO"),
          property: p,
        };
      })
      .filter((vp) => !!vp.video);
  }, [properties]) as VideoRef[];
  const playersRef = useRef<Record<string, VideoPlayerHandle | null>>({});
  const setActiveIndex = useCallback(
    (nextIndex: number) => {
      // Guard
      if (nextIndex == null || nextIndex < 0 || nextIndex >= videos.length)
        return;

      setCurrentIndex(nextIndex);

      // Pause all, play only the active one
      videos.forEach((v, i) => {
        const ref = playersRef.current[v.id];
        if (!ref) return;
        if (i === nextIndex) ref.play();
        else ref.pause();
      });
    },
    [videos]
  );
  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.y / height);
      setActiveIndex(idx);
    },
    [setActiveIndex]
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
    }
  }).current;
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { viewAreaCoveragePercentThreshold: 80 },
      onViewableItemsChanged,
    },
  ]).current;
  const renderItem = useCallback(
    ({ item, index }: { item: VideoRef; index: number }) => (
      <View className=" flex-1" style={{ height, width }}>
        <VideoPlayer
          uri={generateMediaUrl(item.video).uri}
          style={{ height, width }}
          property={item.property}
          fullScreen
          shouldPlay={index === currentIndex}
        />
      </View>
    ),
    [currentIndex]
  );
  useRefreshOnFocus(refetch);
  return (
    <>
      <Box className="flex-1 pb-24">
        <FlashList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={currentIndex}
          pagingEnabled
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumEnd}
          estimatedItemSize={height}
          snapToInterval={height}
          snapToAlignment="start"
          contentInsetAdjustmentBehavior="automatic"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
          ListEmptyComponent={() => (
            <MiniEmptyState className=" mt-10" title={"No Reel Found"} />
          )}
          contentContainerStyle={{ padding: 0 }}
          onEndReached={() => {
            if (hasNextPage && !loading) fetchNextPage?.();
          }}
          onEndReachedThreshold={0.2}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
        />
      </Box>
    </>
  );
}
