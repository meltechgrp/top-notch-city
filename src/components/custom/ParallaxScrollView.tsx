import type { PropsWithChildren, ReactElement } from "react";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { useBottomTabOverflow } from "@/components/TabBarBackground";
import { Box, View } from "@/components/ui";
import { RefreshControl } from "react-native";

type Props = PropsWithChildren<{
  headerComponent: ReactElement;
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
  headerHeight: number;
}>;

export default function ParallaxScrollView({
  children,
  headerComponent,
  refreshing = false,
  onRefresh,
  headerHeight: HEADER_HEIGHT,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.3]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [1.1, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <Box className="flex-1 bg-background">
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh?.()}
          />
        }
      >
        <Animated.View
          style={[
            {
              height: HEADER_HEIGHT,
              overflow: "hidden",
            },
            headerAnimatedStyle,
          ]}
          className={"bg-background"}
        >
          {headerComponent}
        </Animated.View>
        <View className="flex-1 gap-4 bg-background overflow-hidden">
          {children}
        </View>
      </Animated.ScrollView>
    </Box>
  );
}
