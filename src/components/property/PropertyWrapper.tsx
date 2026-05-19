import {
  Box,
  ChevronLeftIcon,
  Icon,
  Pressable,
  useResolvedTheme,
  View,
} from "@/components/ui";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertyDetails from "@/components/property/PropertyDetails";
import { useLayout } from "@react-native-community/hooks";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";
import Platforms from "@/constants/Plaforms";
import { SafeAreaView } from "react-native-safe-area-context";
import PropertyHeroSection from "@/components/property/PropertyHeroSection";
import { Dimensions, LayoutChangeEvent } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { scheduleOnRN } from "react-native-worklets";
import { PropertySkeletonScreen } from "@/components/property/PropertySkeletonScreen";
import { useMe } from "@/hooks/useMe";
import { viewProperty, fetchProperty } from "@/actions/property";
import { listingStore } from "@/store/listing";
import { useQuery } from "@tanstack/react-query";
import { toUiProperty } from "@/lib/propertyAdapter";

const { height } = Dimensions.get("window");
const HERO_HEIGHT = height / 2.2;

interface PropertyWrapperProps {
  slug: string;
}

function PropertyWrapper({ slug }: PropertyWrapperProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["property", slug],
    queryFn: () => fetchProperty({ id: slug }),
    enabled: !!slug,
  });
  const { width, onLayout } = useLayout();
  const property = useMemo(() => (data ? toUiProperty(data) : null), [data]);
  const theme = useResolvedTheme();
  const detailsY = useSharedValue(0);
  const [hasScrolledToDetails, setHasScrolledToDetails] = useState(false);
  const router = useRouter();
  const { me } = useMe();
  const onDetailsLayout = (e: LayoutChangeEvent) => {
    detailsY.value = e.nativeEvent.layout.y;
  };

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      if (event.contentOffset.y >= detailsY.value) {
        scheduleOnRN(setHasScrolledToDetails, true);
      } else {
        scheduleOnRN(setHasScrolledToDetails, false);
      }
    },
  });

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-HERO_HEIGHT, 0, HERO_HEIGHT],
          [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.4],
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [-HERO_HEIGHT, 0, HERO_HEIGHT],
          [1.3, 1, 1],
        ),
      },
    ],
  }));
  const headerBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [detailsY.value - 50, detailsY.value + 50],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      backgroundColor: `rgba(${theme == "dark" ? "22,24,25" : "238,236,240"},${opacity})`,
    };
  });
  useEffect(() => {
    if (!property?.property_server_id) return;
    (async () => await viewProperty({ id: property.property_server_id }))();
  }, [property?.property_server_id]);

  useEffect(() => {
    if (property) {
      listingStore.getState().updateListing({
        step: 1,
        title: property.title,
        description: property?.description || "",
        duration: property?.duration,
        purpose: property?.purpose,
        category: property?.category,
        bedroom: property?.bedroom?.toString(),
        bathroom: property?.bathroom?.toString(),
        bedType: property?.bed_type,
        guests: property?.guests?.toString(),
        landarea: property?.landarea?.toString(),
        plots: property?.plots?.toString(),
        viewType: property?.view_type,
        discount: property?.discount?.toString(),
        caution_fee: property?.caution_fee?.toString(),
        subCategory: property?.subcategory,
        price: property.price?.toString(),
        address: {
          displayName: property?.address,
          addressComponents: {
            country: property?.country,
            state: property?.state,
            city: property?.city,
            street: property?.street,
          },
          location: {
            latitude: property?.latitude || 0,
            longitude: property?.longitude || 0,
          },
        },
      });
    }
  }, [property]);

  if (!property && !isLoading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <MiniEmptyState
          title="Property not found"
          description="This property seems to be removed or not available"
        />
      </Box>
    );
  }

  const header = property ? (
    <PropertyHeader
      hasScrolledToDetails={hasScrolledToDetails}
      property={property}
      me={me}
    />
  ) : null;

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
                      className="p-1.5 bg-background/50 rounded-full flex-row items-center"
                    >
                      <Icon
                        className="w-8 h-8"
                        as={ChevronLeftIcon}
                        color="white"
                      />
                    </Pressable>
                    {header}
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
                className="p-1.5 bg-background/50 rounded-full flex-row items-center"
              >
                <Icon className="w-8 h-8" as={ChevronLeftIcon} color="white" />
              </Pressable>
              {header}
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
      <FullHeightLoaderWrapper
        LoaderComponent={<PropertySkeletonScreen />}
        loading={isLoading || !property}
      >
        {property && (
          <Box onLayout={onLayout} className="flex-1 relative">
            <Animated.ScrollView
              scrollEventThrottle={16}
              onScroll={scrollHandler}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View
                style={[{ width, height: HERO_HEIGHT }, heroAnimatedStyle]}
              >
                <PropertyHeroSection
                  propertyId={property?.property_server_id}
                  thumbnail={property?.thumbnail || ""}
                  media={property.media}
                  width={width}
                />
              </Animated.View>
              <View onLayout={onDetailsLayout}>
                <PropertyDetails me={me} property={property} />
              </View>
            </Animated.ScrollView>
            <PropertyFooter me={me} property={property} />
          </Box>
        )}
      </FullHeightLoaderWrapper>
    </>
  );
}

export default PropertyWrapper;
