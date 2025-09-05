import {
  forwardRef,
  memo,
  type PropsWithChildren,
  ReactElement,
  useImperativeHandle,
} from "react";
import Animated, {
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { Box, View } from "@/components/ui";
import { RefreshControl } from "react-native";

type Props = PropsWithChildren<{
  headerComponent: ReactElement;
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
  headerHeight: number;
  setHasScrolledToDetails: (val: boolean) => void;
}>;
export interface ParallaxScrollViewRefProps {
  scrollOffset: SharedValue<number>;
}
const ParallaxScrollView = memo(
  forwardRef<ParallaxScrollViewRefProps, Props>(
    (
      {
        children,
        headerComponent,
        refreshing = false,
        onRefresh,
        headerHeight: HEADER_HEIGHT,
        setHasScrolledToDetails,
      },
      ref
    ) => {
      const scrollRef = useAnimatedRef<Animated.ScrollView>();
      const scrollOffset = useScrollViewOffset(scrollRef);
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

      const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
          if (event.contentOffset.y >= scrollOffset.value) {
            runOnJS(setHasScrolledToDetails)(true);
          } else {
            runOnJS(setHasScrolledToDetails)(false);
          }
        },
      });
      useImperativeHandle(
        ref,
        () => ({
          scrollOffset: scrollOffset,
        }),
        [scrollOffset]
      );
      return (
        <Box className="flex-1 bg-background">
          <Animated.ScrollView
            ref={scrollRef}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
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
  )
);

export default ParallaxScrollView;
