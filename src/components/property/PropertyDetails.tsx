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
  BookCheck,
  BoxIcon,
  ChevronRight,
  Images,
  LandPlot,
  MessageCircle,
  Video,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import React, { memo, useMemo, useState } from "react";
import { generateMediaUrl, getImageUrl } from "@/lib/api";
import { useLayout } from "@react-native-community/hooks";
import { FindAmenity, fullName } from "@/lib/utils";
import { openAccessModal, openEnquiryModal } from "../globals/AuthModals";
import { useMutation } from "@tanstack/react-query";
import { startChat } from "@/actions/message";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { LongDescription } from "@/components/custom/LongDescription";
import { CustomCenterSheet } from "@/components/property/CustomMapCenterSheet";
import { useStore } from "@/store";
import PropertyNearbySection from "@/components/property/PropertyNearbySection";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import PropertyActionsBottomSheet from "@/components/modals/property/PropertyActionsBottomSheet";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { usePropertyActions } from "@/hooks/usePropertyActions";

interface PropertyDetailsBottomSheetProps {
  property: Property;
}

const PropertyDetailsBottomSheet = ({
  property,
}: PropertyDetailsBottomSheetProps) => {
  const { me } = useStore();
  const { mutateAsync } = useMutation({
    mutationFn: startChat,
  });
  const router = useRouter();
  const { width, onLayout } = useLayout();
  const isHouse = useMemo(
    () => property?.category.name !== "Land",
    [property?.category]
  );
  return (
    <>
      <Box
        onLayout={onLayout}
        className=" flex-1 bg-background rounded-t-3xl gap-4"
      >
        <View className="gap-4 p-4 py-2">
          {isHouse && (
            <View className="flex-row gap-4 mt-2">
              <View className="flex-row flex-1 bg-background-muted rounded-xl p-4 items-center justify-center gap-2">
                <Icon size="sm" as={Bed} className="text-primary" />
                <Text size="sm">
                  {FindAmenity("Bedroom", property?.amenities)} Bed
                </Text>
              </View>
              <View className="flex-row flex-1 bg-background-muted rounded-xl p-4 items-center justify-center gap-2">
                <Icon size="sm" as={Bath} className="text-primary" />
                <Text size="sm">
                  {FindAmenity("Bathroom", property?.amenities)} Bath
                </Text>
              </View>
              <View className="flex-row flex-1 bg-background-muted rounded-xl p-4 items-center justify-center gap-2">
                <Icon size="sm" as={LandPlot} className="text-primary" />
                <Text size="sm">
                  {FindAmenity("Land Area", property?.amenities)} Sq
                </Text>
              </View>
            </View>
          )}
        </View>
        <View className=" pt-2 flex-1 gap-6 pb-20">
          <View className=" flex-row gap-4 px-4">
            <Pressable
              both
              onPress={() => {
                openEnquiryModal({
                  visible: true,
                  id: property?.id,
                });
              }}
              className="flex-row flex-1 bg-gray-600 gap-2 p-4 py-5 rounded-xl items-center justify-between"
            >
              <Icon size="xl" as={BookCheck} className="text-primary" />
              <Text size="md" className=" mr-auto text-white">
                Book a visit
              </Text>
              <Icon as={ChevronRight} color="white" />
            </Pressable>
            <Pressable
              both
              disabled={me?.id == property?.owner.id}
              onPress={async () => {
                if (!me) {
                  return openAccessModal({ visible: true });
                }
                await mutateAsync(
                  {
                    property_id: property?.id!,
                    member_id: property?.owner.id!,
                  },
                  {
                    onError: (e) => {
                      showErrorAlert({
                        title: "Unable to start chat",
                        alertType: "error",
                      });
                    },
                    onSuccess: (data) => {
                      router.replace({
                        pathname: "/chats/[chatId]",
                        params: {
                          chatId: data,
                        },
                      });
                    },
                  }
                );
              }}
              className="flex-row flex-1 gap-2 bg-primary p-4 py-5 rounded-xl items-center justify-between"
            >
              <Icon size="xl" as={MessageCircle} className="text-white" />
              <Text size="md" className=" mr-auto text-white">
                Chat Agent
              </Text>
              <Icon as={ChevronRight} color="white" />
            </Pressable>
          </View>
          <View className="gap-3 px-4 flex">
            <Heading size="lg">Description</Heading>
            <LongDescription description={property?.description || ""} />
          </View>
          <View className=" px-4 gap-4">
            <View className=" gap-3">
              <View className="flex-row gap-2 px-2 items-center">
                <Icon size="md" as={Images} className="text-primary" />
                <Heading size="lg">Images</Heading>
              </View>

              <ProfileImageTrigger
                image={
                  property?.media?.filter((i) => i.media_type == "IMAGE") || []
                }
                index={0}
              >
                <View className="bg-background-muted rounded-xl p-4">
                  <ImageGrid
                    images={
                      property?.media?.filter((i) => i.media_type == "IMAGE") ||
                      []
                    }
                    width={(width - 110) / 5}
                  />
                </View>
              </ProfileImageTrigger>
            </View>
            <ProfileImageTrigger
              image={
                property?.media?.filter((i) => i.media_type == "VIDEO") || []
              }
              index={0}
            >
              <View className="flex-row gap-4 bg-background-muted p-4 rounded-xl items-center justify-between">
                <Icon as={Video} className="text-primary" />
                <Text size="lg" className=" mr-auto">
                  Video
                </Text>
                <Icon as={ChevronRight} />
              </View>
            </ProfileImageTrigger>
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
          <View className="px-4 gap-6">
            <CustomCenterSheet address={property.address} />

            {/* <Divider /> */}

            <PropertyNearbySection address={property.address} />
            <View className="bg-background-muted p-4 rounded-xl gap-4">
              <Pressable className={"f items-center "}>
                <Avatar className=" w-14 h-14">
                  <AvatarFallbackText>
                    {fullName(property?.owner)}
                  </AvatarFallbackText>
                  <AvatarImage
                    source={getImageUrl(property?.owner?.profile_image)}
                  />
                </Avatar>
                <View className="flex-1 pl-3">
                  <Text className="text-lg text-typography font-medium">
                    {fullName(property?.owner)}
                  </Text>
                </View>
              </Pressable>
              <Button
                className="h-12 gap-1 bg-green-600"
                onPress={() =>
                  router.push({
                    pathname: "/agents/[userId]",
                    params: {
                      userId: property?.owner.slug!,
                    },
                  })
                }
              >
                <ButtonText>Agent Portfolio</ButtonText>
                <Icon as={ChevronRight} color="white" />
              </Button>
            </View>
          </View>
        </View>
      </Box>
    </>
  );
};

function ImageGrid({ width, images }: { width: number; images: Media[] }) {
  return (
    <View className=" flex-row gap-3">
      {images.slice(0, 4).map((img) => {
        const { uri, id } = generateMediaUrl(img);
        return (
          <View
            key={img.id}
            style={{ width, height: width }}
            className=" rounded-xl overflow-hidden"
          >
            <Image
              source={{ uri, cacheKey: id }}
              className="w-full h-full object-cover"
              alt="images"
            />
          </View>
        );
      })}
      {images?.length > 4 && (
        <View
          style={{ width: width + 3, height: width + 3 }}
          className=" rounded-xl bg-background items-center justify-center overflow-hidden"
        >
          <Text size="lg">+{images.length - 4}</Text>
        </View>
      )}
    </View>
  );
}

export default memo(PropertyDetailsBottomSheet);
