import BackgroundView from "@/components/layouts/BackgroundView";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import ReelLandViewer from "@/components/reel/ReelLandViewer";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, View } from "@/components/ui";
import Platforms from "@/constants/Plaforms";
import { useLand } from "@/hooks/useLand";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useMemo } from "react";
import { Dimensions, RefreshControl } from "react-native";

const { height: h, width } = Dimensions.get("window");
function ReelLandList({ visible }: { visible: boolean }) {
  const { lands, refetch, loading, fetching, hasNextPage, fetchNextPage } =
    useLand();
  const bottomHeight = useBottomTabBarHeight();
  const height = useMemo(
    () => (Platforms.isIOS() ? h - bottomHeight : h),
    [h, bottomHeight]
  );
  const renderItem = useCallback(
    ({ item, index }: { item: Reel; index: number }) => (
      <ReelLandViewer width={width} reel={item} fullScreen height={height} />
    ),
    []
  );
  return (
    <Box className="flex-1">
      <FlashList
        data={lands}
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
    </Box>
  );
}
export default memo(ReelLandList);
