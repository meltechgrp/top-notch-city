import {
  Box,
  ChevronLeftIcon,
  Icon,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import PropertyHeader from "@/components/property/PropertyHeader";
import { usePropertyStore } from "@/store/propertyStore";
import PropertyDetails from "@/components/property/PropertyDetails";
import { useLayout } from "@react-native-community/hooks";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProperty, viewProperty } from "@/actions/property";
import Platforms from "@/constants/Plaforms";
import { SafeAreaView } from "react-native-safe-area-context";
import { PropertyHeroSection } from "@/components/property/PropertyHeroSection";
import { Dimensions, LayoutChangeEvent } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ParallaxScrollView, {
  ParallaxScrollViewRefProps,
} from "@/components/custom/ParallaxScrollView";

const { height } = Dimensions.get("window");
const HERO_HEIGHT = height / 2.1;

export default function PropertyItem() {
  const { propertyId } = useLocalSearchParams() as { propertyId: string };
  const { updateProperty } = usePropertyStore();
  const ref = useRef<ParallaxScrollViewRefProps>(null);
  const { width, onLayout } = useLayout();
  const detailsY = useSharedValue(0);
  const [hasScrolledToDetails, setHasScrolledToDetails] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", propertyId],
    queryFn: () => fetchProperty({ id: propertyId }),
  });

  const { mutate } = useMutation({
    mutationFn: () => viewProperty({ id: propertyId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", propertyId] });
    },
  });

  const onDetailsLayout = (e: LayoutChangeEvent) => {
    detailsY.value = e.nativeEvent.layout.y;
  };
  const property = useMemo(() => {
    return data?.id ? data : null;
  }, [propertyId, data]);

  useEffect(() => {
    if (property) {
      updateProperty(property);
      setTimeout(() => {
        mutate();
      }, 200);
    }
  }, [property]);

  const headerBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      ref?.current?.scrollOffset.value || 0,
      [detailsY.value - 60, detailsY.value + 60],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      backgroundColor: `rgba(22,24,25,${opacity})`,
    };
    // return {
    //   backgroundColor: `rgba(${theme == "dark" ? "22,24,25" : "238,236,240"},${opacity})`,
    // };
  });
  if (!isLoading && (error || !property)) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text>Error occurred. Please try again.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: Platforms.isIOS(),
          headerTitle: "",
          headerLeft: undefined,
          header: () =>
            Platforms.isIOS() ? (
              <Animated.View
                style={headerBgStyle}
                className={"absolute top-0 py-2 z-30 pl-4 left-0 w-full"}
              >
                <SafeAreaView edges={["top"]} className="bg-transparent">
                  <View className="flex-row justify-between items-center flex-1">
                    <Pressable
                      onPress={() => {
                        if (router.canGoBack()) router.back();
                        else router.push("/");
                      }}
                      className="p-1 bg-black/20 rounded-full flex-row items-center"
                    >
                      <Icon
                        className="w-8 h-8"
                        as={ChevronLeftIcon}
                        color="white"
                      />
                    </Pressable>
                    {property && (
                      <PropertyHeader
                        hasScrolledToDetails={hasScrolledToDetails}
                        property={property}
                      />
                    )}
                  </View>
                </SafeAreaView>
              </Animated.View>
            ) : undefined,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          statusBarStyle: "light",
        }}
      />

      {Platforms.isAndroid() && (
        <Animated.View
          style={headerBgStyle}
          className={"absolute top-0 py-2 z-30 pl-4 left-0 w-full"}
        >
          <SafeAreaView edges={["top"]} className="bg-transparent">
            <View className="flex-row justify-between items-center flex-1">
              <Pressable
                onPress={() => {
                  if (router.canGoBack()) router.back();
                  else router.push("/");
                }}
                className="p-1 bg-black/20 rounded-full flex-row items-center"
              >
                <Icon className="w-8 h-8" as={ChevronLeftIcon} color="white" />
              </Pressable>
              {property && (
                <PropertyHeader
                  hasScrolledToDetails={hasScrolledToDetails}
                  property={property}
                />
              )}
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
      <FullHeightLoaderWrapper loading={isLoading}>
        <Box onLayout={onLayout} className="flex-1 relative">
          <ParallaxScrollView
            headerHeight={HERO_HEIGHT}
            headerComponent={
              <PropertyHeroSection property={property} width={width} />
            }
            setHasScrolledToDetails={setHasScrolledToDetails}
            ref={ref}
          >
            <View onLayout={onDetailsLayout}>
              <PropertyDetails />
            </View>
          </ParallaxScrollView>
        </Box>
      </FullHeightLoaderWrapper>
    </>
  );
}
