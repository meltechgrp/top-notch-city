"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import {
  VideoPlayer,
  VideoPlayerHandle,
} from "@/components/custom/VideoPlayer";
import { FlashList } from "@shopify/flash-list";
import { generateMediaUrl } from "@/lib/api";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, Icon, Pressable } from "@/components/ui";
import { ChevronLeft } from "lucide-react-native";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { router, Stack } from "expo-router";

const { height, width } = Dimensions.get("screen");
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
  } = useInfinityQueries({ type: "all" });

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
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
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Box className="flex-1">
        <View className=" absolute top-4 z-50 w-full left-0 px-4">
          <SafeAreaView edges={["top"]}>
            <View className="flex-row justify-between">
              <Pressable
                onPress={() => router.push("/search")}
                className="p-2 bg-black/20 rounded-full"
              >
                <Icon size="xl" as={ChevronLeft} className=" w-6 h-6" />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
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
