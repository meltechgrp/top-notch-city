import BackgroundView from "@/components/layouts/BackgroundView";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { ReelPhotoViewer } from "@/components/reel/ReelPhotoViewer";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, View } from "@/components/ui";
import Platforms from "@/constants/Plaforms";
import { usePhotos } from "@/hooks/usePhotos";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { Dimensions, RefreshControl } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { height: h, width } = Dimensions.get("window");
export default function ReelPhotoList({ visible }: { visible: boolean }) {
  const { photos, refetch, loading, fetching, hasNextPage, fetchNextPage } =
    usePhotos();
  const insets = useSafeAreaInsets();
  const bottomHeight = useBottomTabBarHeight();
  const height = useMemo(
    () => (Platforms.isIOS() ? h - insets.top - bottomHeight : h - insets.top),
    [h, insets, bottomHeight]
  );
  const renderItem = useCallback(
    ({ item, index }: { item: Reel; index: number }) => (
      <ReelPhotoViewer width={width} reel={item} fullScreen height={height} />
    ),
    []
  );
  return (
    <Box className="flex-1">
      <SafeAreaView edges={["top"]} className="flex-1">
        <FlashList
          data={photos}
          estimatedItemSize={height}
          snapToInterval={height}
          pagingEnabled
          refreshControl={
            <RefreshControl
              progressViewOffset={30}
              colors={["#fff"]}
              refreshing={fetching}
              onRefresh={refetch}
            />
          }
          decelerationRate="fast"
          removeClippedSubviews
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !loading) fetchNextPage?.();
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={() =>
            loading ? (
              <BackgroundView style={{ height: height }}>
                <View className="flex-1 bg-black/20 justify-center items-center">
                  <SpinningLoader color="#FF4C00" size={40} />
                </View>
              </BackgroundView>
            ) : (
              <BackgroundView style={{ height: height }}>
                <MiniEmptyState title="No Property Found" />
              </BackgroundView>
            )
          }
        />
      </SafeAreaView>
    </Box>
  );
}
