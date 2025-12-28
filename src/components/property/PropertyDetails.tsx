import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonText,
  Heading,
  Icon,
  Image,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import {
  Bath,
  Bed,
  BoxIcon,
  ChevronRight,
  Eye,
  Heart,
  Home,
  Images,
  LandPlot,
  MapPin,
  VectorSquare,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import {
  generateMediaUrl,
  generateMediaUrlSingle,
  getImageUrl,
} from "@/lib/api";
import { useLayout } from "@react-native-community/hooks";
import {
  formatDateDistance,
  formatMoney,
  formatNumberCompact,
  composeFullAddress,
  generateTitle,
  fullName,
} from "@/lib/utils";
import { LongDescription } from "@/components/custom/LongDescription";
import { CustomCenterSheet } from "@/components/property/CustomMapCenterSheet";
import PropertyNearbySection from "@/components/property/PropertyNearbySection";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { MiniVideoPlayer } from "@/components/custom/MiniVideoPlayer";
import { openBookingModal } from "@/components/globals/AuthModals";
import { SafeAreaView } from "react-native-safe-area-context";
import SimilarProperties from "@/components/property/SimilarProperites";
import { PropertyEnquiry } from "@/components/property/PropertyEnquiry";
import { KeyboardDismissPressable } from "@/components/shared/KeyboardDismissPressable";
import { ExternalLink } from "@/components/ExternalLink";
import ModalScreen from "@/components/shared/ModalScreen";
import { PropertyBadge } from "@/components/property/PropertyBadge";
import { Durations } from "@/constants/Amenities";

interface PropertyDetailsBottomSheetProps {
  property: Property;
}

const PropertyDetailsBottomSheet = ({
  property,
}: PropertyDetailsBottomSheetProps) => {
  const router = useRouter();
  const { width, onLayout } = useLayout();
  const mainImage = property?.media?.find((img) => img.media_type == "IMAGE");
  return (
    <>
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-transparent">
        <KeyboardDismissPressable>
          <Box
            onLayout={onLayout}
            className=" flex-1 bg-background relative rounded-t-3xl gap-4"
          >
            <View className="justify-center items-center pt-2">
              <View className="h-1.5 w-[60px] rounded-md bg-primary" />
            </View>
            <View className="p-4 mx-4 -mt-1 bg-background-muted rounded-xl">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-white text-2xl font-bold">
                    {formatMoney(
                      property.price,
                      property?.currency?.code || "NGN",
                      0
                    )}
                  </Text>
                  <Text className="text-base text-white">
                    {property.purpose == "rent" &&
                      property?.duration &&
                      `/${Durations.find((d) => d.value == property.duration)?.label?.toLowerCase()}`}
                    {(property.category.name == "Shortlet" ||
                      property.category.name == "Hotel") &&
                      !property?.duration &&
                      "/night"}
                  </Text>
                </View>
                <PropertyBadge property={property} />
              </View>
              <View className="flex-row items-center">
                <View className="flex-row gap-1 items-center my-px">
                  <Icon as={Home} size="sm" className="text-primary" />
                  <Text className=" text-sm">{generateTitle(property)}</Text>
                </View>
                {(property.category.name == "Shortlet" ||
                  property.category.name == "Hotel") && (
                  <Text className="text-white text-sm font-medium">
                    {" "}
                    - {property.category.name}
                  </Text>
                )}
              </View>
              <View className="flex-row justify-between gap-4 items-center">
                {property.address && (
                  <View className="flex-1 flex-row gap-1 items-center">
                    <Icon size="sm" as={MapPin} className="text-primary" />
                    <Text
                      numberOfLines={2}
                      className="text-white flex-1 text-xs"
                    >
                      {composeFullAddress(property.address)}
                    </Text>
                  </View>
                )}

                <View className="flex-row gap-1 ">
                  <View className="flex-row h-8 gap-2 bg-black/40 rounded-2xl py-0 px-3 items-center">
                    <Icon as={Eye} size="sm" className="text-white" />
                    <Text className="text-white font-medium text-sm ">
                      {formatNumberCompact(property?.interaction.viewed || 0)}
                    </Text>
                  </View>
                  <View className="flex-row h-8 gap-2 bg-black/40 rounded-2xl py-0 px-3 items-center">
                    <Icon as={Heart} size="sm" className="text-white" />
                    <Text className="text-white font-medium text-sm ">
                      {formatNumberCompact(property?.interaction.liked || 0)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="gap-4 px-4 pb-2 -mt-2">
              {property.category.name !== "Land" ? (
                <View className="flex-row gap-4 mt-2">
                  <View className="flex-row flex-1 bg-background-muted rounded-xl p-4 items-center justify-center gap-2">
                    <Icon size="sm" as={Bed} className="text-primary" />
                    <Text size="sm">{property.bedroom || "N/A"} Bed</Text>
                  </View>
                  <View className="flex-row flex-1 bg-background-muted rounded-xl p-4 items-center justify-center gap-2">
                    <Icon size="sm" as={Bath} className="text-primary" />
                    <Text size="sm">{property.bathroom || "N/A"} Bath</Text>
                  </View>
                  <View className="flex-row flex-1 bg-background-muted rounded-xl p-4 items-center justify-center gap-2">
                    <Icon size="sm" as={LandPlot} className="text-primary" />
                    <Text size="sm">{property.landarea || "N/A"} Sqft</Text>
                  </View>
                </View>
              ) : (
                <View className="flex-row gap-4 mt-2">
                  <View className="flex-row flex-1 bg-background-muted rounded-xl p-4 items-center justify-center gap-2">
                    <Icon size="sm" as={LandPlot} className="text-primary" />
                    <Text size="sm">{property.plots || "N/A"} Plot</Text>
                  </View>
                  <View className="flex-row flex-1 bg-background-muted rounded-xl p-4 items-center justify-center gap-2">
                    <Icon
                      size="sm"
                      as={VectorSquare}
                      className="text-primary"
                    />
                    <Text size="sm">{property.landarea || "N/A"} sqft</Text>
                  </View>
                </View>
              )}
            </View>
            <View className=" pt-2 flex-1 gap-6 pb-20">
              <View className="gap-3 p-4 flex bg-background-muted mx-4 rounded-xl">
                <Heading size="lg" className="font-bold">
                  What's special
                </Heading>
                <LongDescription
                  numberOfLines={8}
                  description={property?.description?.trim() || ""}
                />
              </View>
              <View className=" px-4 gap-4">
                <View className=" gap-3">
                  <View className="flex-row gap-2 px-2 items-center">
                    <Icon size="md" as={Images} className="text-primary" />
                    <Heading size="lg">Media</Heading>
                  </View>

                  <ProfileImageTrigger image={property?.media || []} index={0}>
                    <View className="bg-background-muted rounded-xl p-4">
                      <ImageGrid
                        media={property?.media || []}
                        width={(width - 110) / 5}
                      />
                    </View>
                  </ProfileImageTrigger>
                </View>
                <Pressable
                  disabled
                  onPress={() => {
                    router.push("/(protected)/property/[propertyId]/3d-view");
                  }}
                  className="flex-row gap-4 bg-background-muted p-4 rounded-xl items-center justify-between"
                >
                  <Icon as={BoxIcon} className="text-primary" />
                  <Text size="lg" className=" mr-auto">
                    Visual Tour
                  </Text>
                  <Icon as={ChevronRight} />
                </Pressable>
              </View>
              <View className="flex-row justify-around">
                <Text className="">
                  {formatDateDistance(property.created_at, true)}
                </Text>
                <Text>
                  {property.interaction.viewed}{" "}
                  <Text className="text-typography/80">Views</Text>
                </Text>
                <Text>
                  {property.interaction.liked}{" "}
                  <Text className="text-typography/80">Likes</Text>
                </Text>
              </View>
              <View className="gap-3 py-4 flex bg-background-muted mx-4 rounded-xl">
                <Heading size="lg" className="font-bold px-4">
                  Features
                </Heading>
                <View className="flex-row gap-4 flex-wrap px-2">
                  {property?.amenities?.slice(0, 6).map((a) => (
                    <View key={a.name} className="w-[46%] ">
                      <View className="bg-background rounded-full py-1 px-3 gap-1 flex-row items-center self-start">
                        <Text numberOfLines={1} className="text-sm">
                          {a.name}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {/* {property?.amenities?.length > 2 && (
                    <ModalScreen>
                      <View></View>
                    </ModalScreen>
                  )} */}
                </View>
              </View>
              {property.category.name !== "Shortlet" &&
                property.status == "approved" && (
                  <View className="bg-background-muted border border-outline-100 rounded-xl p-4 mx-4">
                    <View className="h-40 bg-background/70">
                      {mainImage?.url && (
                        <Image
                          rounded
                          source={{
                            uri: generateMediaUrlSingle(mainImage?.url),
                            cacheKey: mainImage?.id,
                          }}
                        />
                      )}
                    </View>
                    <View className=" gap-2 my-2">
                      <Text className="text-xl font-bold">
                        Tour with an Agent
                      </Text>
                      <Text className="mt-1 text-sm text-typography/90">
                        We'll connect you with an expert to take you on a
                        private tour on this property at{" "}
                        {composeFullAddress(property.address)}.
                      </Text>
                    </View>
                    <Button
                      onPress={() => {
                        openBookingModal({
                          visible: true,
                          property_id: property.id,
                          agent_id: property.owner.id,
                          availableDates: property?.availabilities,
                          image:
                            property?.media.find((i) => i.media_type == "IMAGE")
                              ?.url || "",
                          title: property.title,
                          address: composeFullAddress(property.address),
                          booking_type:
                            property.category.name == "Shortlet"
                              ? "reservation"
                              : "inspection",
                        });
                      }}
                      className="h-12"
                    >
                      <Text className="text-base font-bold">
                        Schedule a visit
                      </Text>
                    </Button>
                  </View>
                )}
              <View className="bg-background-muted border border-outline-100 p-2 rounded-xl mx-4 gap-2">
                <View className="rounded-xl overflow-hidden">
                  <CustomCenterSheet address={property.address} />
                </View>
              </View>
              <PropertyNearbySection address={property.address} />
              <View className="px-4 gap-6">
                <View className="bg-background-muted p-4 rounded-xl gap-4">
                  <View className={"flex-row gap-2 items-center "}>
                    <Text>Listed by:</Text>

                    <View className="flex-1">
                      <Text className="text-lg text-typography font-medium">
                        {fullName(property?.owner)}
                      </Text>
                    </View>
                  </View>
                  <Button
                    className="h-12 gap-1 bg-gray-600"
                    onPress={() => {
                      if (!property?.owner) return;
                      router.push({
                        pathname: "/agents/[userId]",
                        params: {
                          userId: property.owner.id,
                        },
                      });
                    }}
                  >
                    <Avatar className=" w-10 h-10 mr-4">
                      <AvatarFallbackText>
                        {fullName(property?.owner)}
                      </AvatarFallbackText>
                      <AvatarImage
                        source={getImageUrl(property?.owner?.profile_image)}
                      />
                    </Avatar>
                    <ButtonText>Portfolio</ButtonText>
                    <Icon as={ChevronRight} color="white" />
                  </Button>
                </View>
                <PropertyEnquiry property={property} />
              </View>
              <SimilarProperties property={property} />
              <View className="p-4 border border-warning-100 mx-4 rounded-xl">
                <Text className="text-typography/60 text-sm">
                  The information related to this real estate property for{" "}
                  {property.purpose} on this app is sourced in part through the
                  TopNotch City, a cooperative system that allows licensed
                  agents/firms to share property listing data. These listings
                  are provided to TopNotch City through licensing agreements.
                  Please note that:
                </Text>

                <Text className="mt-2 text-typography/60 text-sm">
                  {"\u2022"} Listings come from various participating
                  agents/firms, and not all available properties may appear on
                  this app.
                </Text>

                <Text className="mt-1 text-typography/60 text-sm">
                  {"\u2022"} The property details provided here are intended for
                  personal, non-commercial use only and may not be used for any
                  purpose other than helping consumers identify potential
                  properties of interest.
                </Text>

                <Text className="mt-1 text-typography/60 text-sm">
                  {"\u2022"} Some properties displayed for {property.purpose}{" "}
                  may no longer be available, as they may already be under
                  contract, sold, or otherwise removed from the market.
                </Text>

                <Text className="mt-4 text-typography/60 text-sm">
                  While the information shown is considered reliable, TopNotch
                  City does not guarantee its accuracy.
                </Text>
                <Text className="mt-2 text-typography/60 text-sm">
                  © {new Date().getFullYear()} TopNotch City.{" "}
                  <ExternalLink href={"https://topnotchcity.com/privacy"}>
                    <Text className="text-blue-600 text-sm underline">
                      Click here for more infomation.
                    </Text>
                  </ExternalLink>
                </Text>
              </View>
            </View>
          </Box>
        </KeyboardDismissPressable>
      </SafeAreaView>
    </>
  );
};

function ImageGrid({ width, media }: { width: number; media: Media[] }) {
  return (
    <View className=" flex-row gap-3">
      {media.slice(0, 4).map((img) => {
        const { uri, id, isImage } = generateMediaUrl(img);
        return (
          <View
            key={img.id}
            style={{ width, height: width }}
            className=" rounded-xl overflow-hidden"
          >
            {isImage ? (
              <Image
                source={{ uri, cacheKey: id }}
                className="w-full h-full object-cover"
                alt="media"
              />
            ) : (
              <MiniVideoPlayer
                showPlayBtn
                canPlay={false}
                showLoading={false}
                uri={uri}
              />
            )}
          </View>
        );
      })}
      {media?.length > 4 && (
        <View
          style={{ width: width + 3, height: width + 3 }}
          className=" rounded-xl bg-background items-center justify-center overflow-hidden"
        >
          <Text size="lg">+{media.length - 4}</Text>
        </View>
      )}
    </View>
  );
}

export default memo(PropertyDetailsBottomSheet);
