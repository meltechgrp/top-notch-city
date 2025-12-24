import {
  Box,
  ChevronLeftIcon,
  Icon,
  Pressable,
  Text,
  useResolvedTheme,
  View,
} from "@/components/ui";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import PropertyHeader from "@/components/property/PropertyHeader";
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
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { useTempStore } from "@/store";
import { scheduleOnRN } from "react-native-worklets";
import { normalizePropertyServer } from "@/db/normalizers/property";

const { height } = Dimensions.get("window");
const HERO_HEIGHT = height / 2.2;

export default function PropertyItem() {
  const { propertyId } = useLocalSearchParams() as { propertyId: string };
  const { updateListing } = useTempStore();
  const { width, onLayout } = useLayout();
  const theme = useResolvedTheme();
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
    return data ? normalizePropertyServer(data) : null;
  }, [propertyId, data]);

  useEffect(() => {
    if (property) {
      mutate();
    }
  }, [property]);

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

  const heroAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HERO_HEIGHT, 0, HERO_HEIGHT],
            [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.4]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HERO_HEIGHT, 0, HERO_HEIGHT],
            [1.3, 1, 1]
          ),
        },
      ],
    };
  });
  const headerBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [detailsY.value - 50, detailsY.value + 50],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      backgroundColor: `rgba(${theme == "dark" ? "22,24,25" : "238,236,240"},${opacity})`,
    };
  });
  useEffect(() => {
    if (property) {
      setTimeout(() => {
        updateListing({
          title: property.title,
          description: property?.description || "",
          duration: property?.duration,
          purpose: property?.purpose,
          category: property?.category,
          bedroom: property?.bedroom,
          bathroom: property?.bathroom,
          bedType: property?.bedType,
          guests: property?.guests,
          landarea: property?.landarea?.toString(),
          plots: property?.plots,
          viewType: property?.viewType,
          discount: property?.discount,
          caution_fee: property?.cautionFee,
          owner_type: property?.ownership?.ownerType || undefined,
          listing_role: property?.ownership?.listingRole || undefined,
          subCategory: property?.subCategory,
          companies: property?.companies,
          // ownershipDocuments: property?.ownership?.documents?.map((d) => ({
          //   media_type: d.document_type?.toUpperCase() as Media["mediaType"],
          //   id: d.id,
          //   url: d.url,
          // })),
          price: property.price.toString(),
          photos: property?.media?.filter((img) => img.mediaType == "IMAGE"),
          videos: property?.media?.filter((img) => img.mediaType == "VIDEO"),
          currency: property.currency || "NGN",
          availabilityPeriod: property?.availabilities?.map((a) => ({
            start: a.start,
            end: a.end,
          })),
          facilities: property?.amenities?.map((f) => f.name),
          address: {
            displayName: property.address.displayAddress,
            addressComponents: {
              country: property.address.country,
              state: property.address.state,
              city: property.address.city,
              street: property.address.street,
            },
            location: {
              latitude: property.address.latitude,
              longitude: property.address.longitude,
            },
          },
        });
      }, 50);
    }
  }, [property]);
  if (error) {
    return (
      <Box className="flex-1 justify-center items-center">
        <MiniEmptyState
          title="Property not found"
          description="This property seems to be removed or not available"
        />
      </Box>
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
                      className="p-1.5 bg-background/50 rounded-full flex-row items-center"
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
                className="p-1.5 bg-background/50 rounded-full flex-row items-center"
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
          <Animated.ScrollView
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            showsVerticalScrollIndicator={false}
          >
            {property && (
              <Animated.View
                style={[{ width, height: HERO_HEIGHT }, heroAnimatedStyle]}
              >
                <PropertyHeroSection media={property?.media} width={width} />
              </Animated.View>
            )}
            {property && (
              <View onLayout={onDetailsLayout}>
                <PropertyDetails property={property} />
              </View>
            )}
          </Animated.ScrollView>
          {property && <PropertyFooter property={property} />}
        </Box>
      </FullHeightLoaderWrapper>
    </>
  );
}
