import { Box, Button, ButtonText, Icon } from "@/components/ui";
import { View } from "react-native";
import { Heading, Pressable, Text } from "@/components/ui";
import { composeFullAddress, formatMoney } from "@/lib/utils";
import { capitalize, chunk } from "lodash-es";
import { PropertyStatus } from "@/components/property/PropertyStatus";
import { useMemo, useState } from "react";
import { PropertyModalMediaViewer } from "@/components/modals/property/PropertyModalMediaViewer";
import { useLayout } from "@react-native-community/hooks";
import PropertyMedia from "@/components/property/PropertyMedia";
import { format } from "date-fns";
import { usePropertyStore } from "@/store/propertyStore";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { Check, Edit, Plus } from "lucide-react-native";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { router, Stack } from "expo-router";
import ListingPurpose from "@/components/listing/ListingPurpose";
import ListingCategory from "@/components/listing/ListingCategory";
import ListingAmenities from "@/components/listing/ListingAmenities";
import ListingDescription from "@/components/listing/ListingDescription";
import ListingLocation from "@/components/listing/ListingLocation";
import ListingMediaFiles from "@/components/listing/ListingMediaFiles";
import ListingBasis from "@/components/listing/ListingBasis";
import ListingResult from "@/components/listing/ListingResult";
import { useTempStore } from "@/store";
import { useUpdateProperty } from "@/actions/property/upload";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import ListingBottomNavigation from "@/components/listing/ListingBottomNavigation";
import { generateMediaUrl } from "@/lib/api";
import headerLeft from "@/components/shared/headerLeft";

export default function PropertyEdit() {
  const { details: property, getImages, getVideos } = usePropertyStore();
  const [isViewer, setIsViewer] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const [imageIndex, setImagesIndex] = useState(0);
  const { width, onLayout, height } = useLayout();
  const { updateProperty, loading, error } = useUpdateProperty();
  const { listing, updateListing, updateListingStep, resetListing } =
    useTempStore();

  if (!property) return null;

  const Steps = useMemo(() => {
    switch (listing.step) {
      case 1:
        return <ListingPurpose title="What would like to Update?" />;
      case 2:
        return <ListingCategory />;
      case 3:
        return <ListingAmenities />;
      case 4:
        return <ListingDescription />;
      case 5:
        return <ListingLocation height={height} />;
      case 6:
        return <ListingMediaFiles />;
      case 7:
        return <ListingBasis />;
      case 8:
        return <ListingResult />;
      default:
        return null;
    }
  }, [listing.step]);
  function handleNext(step: number, back?: boolean) {
    if (back) {
      return updateListing({ ...listing, step });
    } else if (listing.step == 1 && !listing?.purpose) {
      return showErrorAlert({
        title: "Please pick your purpose",
        alertType: "warn",
      });
    } else if (listing.step == 2 && !listing?.subCategory) {
      return showErrorAlert({
        title: "Please select a category",
        alertType: "warn",
      });
    } else if (listing.step == 4 && !listing.description) {
      return showErrorAlert({
        title: "Please enter property description",
        alertType: "warn",
      });
    } else if (listing.step == 5 && !listing?.address?.displayName) {
      return showErrorAlert({
        title: "Please enter property location!",
        alertType: "warn",
      });
    } else if (listing.step == 6) {
      if (listing?.photos && listing?.photos?.length < 3)
        return showErrorAlert({
          title: "Select at least 3 images",
          alertType: "warn",
        });
      else if (!listing?.photos?.length)
        return showErrorAlert({
          title: "Add some images to proceed!",
          alertType: "warn",
        });
    }
    if (listing.step == 7) {
      if (!listing?.price) {
        return showErrorAlert({
          title: "Please enter property price!",
          alertType: "warn",
        });
      }
      if (listing.purpose == "rent" && !listing?.duration) {
        return showErrorAlert({
          title: "Please enter rentage duration",
          alertType: "warn",
        });
      }
    }
    updateListingStep();
  }
  function handleEditorMode(step: number) {
    updateListing({
      ...listing,
      step: step,
      purpose: property?.purpose,
      category: property?.category as any,
      subCategory: property?.subcategory as any,
      facilities: property?.amenities.map((item) => ({
        label: item.name,
        value: item.value,
      })),
      description: property?.description as any,
      price: property?.price?.toString(),
      currency: property?.currency,
      photos: property?.media
        .filter((item) => item.media_type === "IMAGE")
        .map((item) => ({ id: item.id, uri: generateMediaUrl(item).uri })),
      videos: property?.media
        .filter((item) => item.media_type === "VIDEO")
        .map((item) => ({ id: item.id, uri: generateMediaUrl(item).uri })),
      address: {
        displayName: property?.address
          ? composeFullAddress(property?.address, true, "long")
          : "",
        location: {
          latitude: Number(property?.address.latitude),
          longitude: Number(property?.address.longitude),
        },
        addressComponents: { ...property?.address },
      },
    });
    setEditingMode(true);
  }
  async function uploaHandler() {
    if (!property?.id)
      return showErrorAlert({ title: "Property not found", alertType: "warn" });
    await updateProperty(
      { listing, propertyId: property.id },
      {
        onSuccess: () => {
          resetListing();
          setEditingMode(false);
          showErrorAlert({
            title: "Property Updated successfully",
            alertType: "success",
          });
        },
        onError: () =>
          showErrorAlert({
            title: "Something went wrong. Try again!",
            alertType: "error",
          }),
      }
    );
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: editingMode
            ? () => (
                <Button
                  onPress={() => {
                    resetListing();
                    setEditingMode(false);
                  }}
                  size="md"
                  className="mb-1"
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
              )
            : headerLeft(),
          headerTitle: editingMode ? "Editing" : "Edit",
          headerRight: () => (
            <Button
              onPress={() => router.push("/(protected)/support/faq")}
              size="md"
              variant="outline"
              action="secondary"
              className="mb-1"
            >
              <ButtonText>Help?</ButtonText>
            </Button>
          ),
        }}
      />
      {editingMode ? (
        <Box onLayout={onLayout} className="flex-1">
          <FullHeightLoaderWrapper className="flex-1" loading={loading}>
            <SafeAreaView edges={["bottom"]} className="flex-1">
              <Animated.View
                entering={FadeInRight.duration(800)}
                exiting={FadeOutLeft.duration(800)}
                key={listing.step}
                style={{ height, flex: 1 }}
              >
                <BodyScrollView contentContainerClassName="pb-12">
                  {Steps}
                </BodyScrollView>
              </Animated.View>
              <ListingBottomNavigation
                step={listing.step}
                uploaHandler={uploaHandler}
                onUpdate={handleNext}
              />
            </SafeAreaView>
          </FullHeightLoaderWrapper>
        </Box>
      ) : (
        <Box className="flex-1">
          <BodyScrollView>
            <View
              onLayout={onLayout}
              className="gap-y-4 flex-1 mt-4 px-4 pb-32"
            >
              <View className=" rounded-2xl bg-background-muted p-4">
                <View className="flex-row justify-between mb-4">
                  <Heading size="md">Property Info</Heading>
                  <Pressable
                    both
                    onPress={() => handleEditorMode(1)}
                    className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center"
                  >
                    <Text className="white">Edit</Text>
                    <Icon size="sm" as={Edit} color="white" />
                  </Pressable>
                </View>

                <View className="gap-y-3">
                  <InfoRow
                    label="Price"
                    value={formatMoney(property.price, property.currency, 0)}
                  />
                  <InfoRow label="Currency" value={property.currency} />
                  <InfoRow
                    label="Purpose"
                    value={capitalize(property.purpose)}
                  />
                  <View className="flex-row justify-between py-1">
                    <Text className="text-sm">Status:</Text>
                    <PropertyStatus status={property.status} />
                  </View>
                  <InfoRow
                    label="Category"
                    value={capitalize(property.category as any)}
                  />
                  <InfoRow
                    label="Sub-Category"
                    value={capitalize(property.subcategory as any)}
                  />

                  <InfoRow
                    label="Created"
                    value={format(
                      new Date(property?.created_at ?? new Date()),
                      "dd MMM yyyy"
                    )}
                  />
                </View>
              </View>
              <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
                <View className="flex-row justify-between mb-4">
                  <Heading size="md">Description</Heading>
                  <Pressable
                    onPress={() => handleEditorMode(4)}
                    both
                    className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center"
                  >
                    <Text className="white">Edit</Text>
                    <Icon size="sm" as={Edit} color="white" />
                  </Pressable>
                </View>
                <View className=" min-h-20">
                  <Text numberOfLines={5}>
                    {property?.description || "N/A"}
                  </Text>
                </View>
              </View>
              <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
                <View className="flex-row justify-between mb-4">
                  <Heading size="md">Location</Heading>
                  <Pressable
                    onPress={() => handleEditorMode(5)}
                    both
                    className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center"
                  >
                    <Text className="white">Edit</Text>
                    <Icon size="sm" as={Edit} color="white" />
                  </Pressable>
                </View>
                <View className="">
                  <Text>{composeFullAddress(property.address)}</Text>
                </View>
              </View>
              <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
                <View className="flex-row justify-between mb-4">
                  <View>
                    <Heading size="md">Photos</Heading>
                    <Text size="sm">Click on a photo to view</Text>
                  </View>
                  <Pressable
                    onPress={() => handleEditorMode(6)}
                    both
                    className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center"
                  >
                    <Text className="white">Add</Text>
                    <Icon size="sm" as={Plus} color="white" />
                  </Pressable>
                </View>
                <View className="flex-wrap gap-4">
                  {chunk(getImages(), 3).map((row, i) => (
                    <View className={"flex-row gap-4"} key={i}>
                      {row.map((media, i) => (
                        <Pressable both key={media.id}>
                          <PropertyMedia
                            style={{
                              width: width > 100 ? (width - 90) / 3 : 72,
                              height: width > 100 ? (width - 90) / 3 : 72,
                              flex: 1,
                            }}
                            imageStyle={{
                              width: width > 100 ? (width - 90) / 3 : 72,
                              height: width > 100 ? (width - 90) / 3 : 72,
                            }}
                            isOwner
                            rounded
                            propertyId={property.id}
                            className={" bg-background-muted"}
                            source={media}
                            onPress={() => {
                              setImagesIndex(
                                property.media.findIndex(
                                  (img) => img.id == media.id
                                ) || i
                              );
                              setIsViewer(true);
                            }}
                          />
                        </Pressable>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
              <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
                <View className="flex-row justify-between mb-4">
                  <View>
                    <Heading size="md">Videos</Heading>
                    <Text size="sm">Click on a video to view</Text>
                  </View>
                  <Pressable
                    onPress={() => handleEditorMode(6)}
                    both
                    className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center"
                  >
                    <Text className="white">Add</Text>
                    <Icon size="sm" as={Plus} color="white" />
                  </Pressable>
                </View>
                <View className="flex-wrap gap-4">
                  {chunk(getVideos(), 3).map((row, i) => (
                    <View className={"flex-row gap-4"} key={i}>
                      {row.map((media, i) => (
                        <Pressable both key={media.id}>
                          <PropertyMedia
                            style={{
                              width: width > 100 ? (width - 95) / 3 : 72,
                              height: width > 100 ? (width - 95) / 3 : 72,
                            }}
                            rounded
                            isOwner
                            propertyId={property.id}
                            className={" bg-background-muted"}
                            source={media}
                            isSmallView
                            canPlayVideo={false}
                            onPress={() => {
                              setImagesIndex(
                                property.media.findIndex(
                                  (img) => img.id == media.id
                                ) || i
                              );
                              setIsViewer(true);
                            }}
                          />
                        </Pressable>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
              {property.amenities.length > 0 && (
                <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
                  <View className="flex-row justify-between mb-4">
                    <Heading size="md">Amenities</Heading>
                    <Pressable
                      onPress={() => handleEditorMode(3)}
                      both
                      className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center"
                    >
                      <Text className="white">Edit</Text>
                      <Icon size="sm" as={Edit} color="white" />
                    </Pressable>
                  </View>
                  <View className=" flex-row gap-4 justify-between flex-wrap">
                    {property.amenities.map((a) => (
                      <View
                        key={a.name}
                        className="flex-row w-[45%] justify-between items-center gap-2 bg-background p-2 px-4 rounded-xl"
                      >
                        <Text>{a.name}</Text>
                        {parseInt(a.value) > 0 ? (
                          <Text className="text-primary">{a.value}</Text>
                        ) : (
                          <Icon size="sm" className="text-primary" as={Check} />
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </BodyScrollView>

          <PropertyModalMediaViewer
            width={width}
            selectedIndex={imageIndex}
            visible={isViewer}
            setVisible={setIsViewer}
            canPlayVideo
            media={property?.media}
          />
        </Box>
      )}
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2">
      <Text className="text-sm">{label}:</Text>
      <Text className="text-base text-right max-w-[60%]">{value}</Text>
    </View>
  );
}
