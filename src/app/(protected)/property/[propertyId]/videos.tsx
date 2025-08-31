import { Box } from "@/components/ui";
import { usePropertyStore } from "@/store/propertyStore";
import { useCallback, useMemo, useRef, useState } from "react";
import { generateMediaUrl } from "@/lib/api";
import { composeFullAddress } from "@/lib/utils";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { VideoPlayer } from "@/components/custom/VideoPlayer";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: h, width } = Dimensions.get("screen");

export default function Images() {
  const { getVideos, details: p } = usePropertyStore();
  if (!p) return;
  const reels = useMemo(
    () =>
      getVideos().map((v) => ({
        id: p.id,
        uri: generateMediaUrl(v).uri,
        title: "",
        description: p.description || "",
        interations: p.interaction,
        owner_interaction: p.owner_interaction,
        created_at: p.created_at,
        owner: p?.owner,
        price: p.price,
        location: composeFullAddress(p.address, false, "short"),
        purpose: p.purpose,
      })),
    [getVideos, p]
  );
  const insets = useSafeAreaInsets();

  const height = useMemo(() => h - insets.top - insets.bottom, [h, insets]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playersRef = useRef<Record<string, VideoPlayerHandle | null>>({});
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
        inTab={false}
        reel={item}
        fullScreen
        shouldPlay={index === currentIndex}
      />
    ),
    [currentIndex]
  );
  return (
    <>
      <Box className="flex-1">
        <FlatList
          data={reels}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={currentIndex}
          pagingEnabled
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumEnd}
          initialNumToRender={1}
          snapToInterval={height}
          ListEmptyComponent={() => (
            <MiniEmptyState className=" mt-10" title={"No Video Found"} />
          )}
          contentContainerStyle={{ padding: 0 }}
        />
      </Box>
    </>
  );
}
