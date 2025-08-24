import * as React from "react";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import PropertyMedia from "./PropertyMedia";
import { Colors } from "@/constants/Colors";
import { useResolvedTheme, View } from "../ui";
import Layout from "@/constants/Layout";
import { useSharedValue } from "react-native-reanimated";
import { Dimensions } from "react-native";
import { ImageContentFit } from "expo-image";

const SCREEN_WIDTH = Dimensions.get("window").width;
const INTERACTIVE_ZONE_WIDTH = SCREEN_WIDTH / 2.8;

type Props = {
  media: Media[];
  width: number;
  factor?: number;
  pointerPosition?: number;
  withBackdrop?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  paginationLenght?: number;
  scrollAnimationDuration?: number;
  rounded?: boolean;
  stackMode?: boolean;
  fullScreen?: boolean;
  isOwner?: boolean;
  withPagination?: boolean;
  canPlayVideo?: boolean;
  setSelectedIndex?: (val: number) => void;
  selectedIndex?: number;
  paginationsize?: number;
  isList?: boolean;
  enabled?: boolean;
  contentFit?: ImageContentFit;
};

function PropertyCarousel({
  media,
  width,
  factor,
  pointerPosition = 10,
  paginationsize = 8,
  withBackdrop,
  loop = false,
  scrollAnimationDuration = 800,
  autoPlay = false,
  stackMode = false,
  withPagination = true,
  canPlayVideo,
  paginationLenght,
  setSelectedIndex,
  selectedIndex,
  isOwner,
  isList = false,
  rounded,
  contentFit,
  enabled = true,
  fullScreen = false,
}: Props) {
  const { bannerHeight, window } = Layout;
  const theme = useResolvedTheme();
  const progress = useSharedValue<number>(0);
  const carouselRef = React.useRef<ICarouselInstance>(null);
  const baseOptions = {
    vertical: false,
    width: width,
    height: fullScreen ? window.height : bannerHeight,
  } as const;

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View
      style={{ height: baseOptions.height }}
      className="relative bg-background w-full flex-row items-center justify-center"
    >
      {/* center zone */}
      {isList && (
        <View
          className="absolute left-1/2 bg-background/0 h-full z-20"
          style={{
            width: INTERACTIVE_ZONE_WIDTH,
            transform: [{ translateX: -(INTERACTIVE_ZONE_WIDTH / 2) }],
          }}
        />
      )}
      <View className="flex-1 overflow-hidden">
        <Carousel
          ref={carouselRef}
          {...baseOptions}
          loop={loop}
          enabled={enabled}
          autoPlay={autoPlay}
          autoPlayInterval={2000}
          scrollAnimationDuration={scrollAnimationDuration}
          defaultIndex={selectedIndex}
          onProgressChange={progress}
          onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
            "worklet";
            g.enabled(false);
          }}
          onSnapToItem={setSelectedIndex}
          style={{ width: width }}
          data={media}
          renderItem={(props) => (
            <PropertyMedia
              style={{ height: 500, flex: 1 }}
              withBackdrop={withBackdrop}
              source={props.item}
              isOwner={isOwner}
              isVisible
              contentFit={contentFit}
              rounded={rounded}
              canPlayVideo={canPlayVideo}
              {...props}
            />
          )}
          pagingEnabled={true}
          mode={stackMode ? "horizontal-stack" : undefined}
          modeConfig={
            stackMode
              ? {
                  snapDirection: "left",
                  stackInterval: 18,
                }
              : undefined
          }
          customConfig={
            stackMode ? () => ({ type: "positive", viewCount: 5 }) : undefined
          }
        />
        {withPagination && (
          <Pagination.Basic<Media>
            progress={progress}
            data={media?.slice(0, paginationLenght)}
            size={paginationsize}
            dotStyle={{
              borderRadius: 100,
              backgroundColor:
                theme == "dark"
                  ? Colors.light.background
                  : Colors.dark.background,
            }}
            activeDotStyle={{
              borderRadius: 100,
              overflow: "hidden",
              backgroundColor: Colors.primary,
            }}
            containerStyle={[
              {
                position: "absolute",
                bottom: pointerPosition,
                gap: 5,
              },
            ]}
            horizontal
            onPress={onPressPagination}
          />
        )}
      </View>
    </View>
  );
}

export default PropertyCarousel;
