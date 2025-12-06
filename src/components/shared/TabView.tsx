import Layout from "@/constants/Layout";
import React, { useEffect, useMemo, useRef } from "react";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import Animated, { runOnJS, useSharedValue } from "react-native-reanimated";
import { Dimensions, Platform } from "react-native";

interface Props {
  activeTab: number;
  scrollEnabled?: boolean;
  onTabSelected?: (tab: number) => void;
  style?: any;
  scrollAnimationDuration?: number;
  mode?: "parallax" | "horizontal-stack" | "vertical-stack";
  children: React.ReactNode;
}
export default function TabView(props: Props) {
  const {
    activeTab,
    onTabSelected,
    scrollEnabled = true,
    children,
    mode,
    scrollAnimationDuration = 400,
  } = props;

  const { height: totalHeight } = Dimensions.get("screen");
  const carouselRef = useRef<ICarouselInstance>(null);

  const filteredChildren = useMemo(
    () => React.Children.toArray(children).filter(Boolean),
    [children]
  );
  const handleSnapToItem = (index: number) => {
    onTabSelected?.(index);
  };

  const progress = useSharedValue<number>(0);
  useEffect(() => {
    carouselRef.current?.scrollTo({
      count: activeTab - progress.value,
      animated: true,
    });
  }, [activeTab]);
  return (
    <Carousel
      ref={carouselRef}
      width={Layout.window.width}
      loop={false}
      height={totalHeight}
      data={filteredChildren}
      onProgressChange={progress}
      defaultIndex={activeTab}
      scrollAnimationDuration={scrollAnimationDuration}
      pagingEnabled={true}
      enabled={scrollEnabled}
      snapEnabled={scrollEnabled}
      onSnapToItem={(index) => runOnJS(handleSnapToItem)(index)}
      renderItem={({ item }) => <>{item}</>}
    />
  );
}
