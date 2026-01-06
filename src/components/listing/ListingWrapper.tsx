import { useUploadProperty } from "@/actions/property/upload";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import AdditionalInfomation from "@/components/listing/AdditionalInfomation";
import PropertyListingBasic from "@/components/listing/Basic";
import ListingAmenities from "@/components/listing/ListingAmenities";
import ListingBottomNavigation from "@/components/listing/ListingBottomNavigation";
import ListingCategory from "@/components/listing/ListingCategory";
import ListingMediaFiles from "@/components/listing/ListingMediaFiles";
import ListingResult from "@/components/listing/ListingResult";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";
import { Box } from "@/components/ui";
import { usePropertyFeedSync } from "@/db/queries/syncPropertyFeed";
import { listingStore } from "@/store/listing";
import { observe } from "@legendapp/state";
import { use$, useValue } from "@legendapp/state/react";
import { useLayout } from "@react-native-community/hooks";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface ListingWrapperProps {
  type: "edit" | "add";
  userId: string;
  propertyId?: string;
}

export function ListingWrapper({
  userId,
  type,
  propertyId,
}: ListingWrapperProps) {
  const { resync } = usePropertyFeedSync();
  const router = useRouter();
  const { onLayout, height } = useLayout();
  const {
    uploadProperty,
    uploading: loading,
    error,
  } = useUploadProperty(type, propertyId);
  const { updateListing, updateListingStep, resetListing } = listingStore.get();
  const listing = useValue(listingStore.listing);

  async function uploaHandler() {
    await uploadProperty(listing, {
      onSuccess: (e) => {
        resync();
        router.dismissTo({
          pathname: "/(protected)/agents/[userId]/properties/success",
          params: {
            userId,
          },
        });
        listingStore.listing.delete();
        listingStore.listing.assign({
          purpose: "rent",
          step: 1,
          currency: "NGN",
        });
      },
      onError: (e) => {
        console.log(e?.message, "here");
        showErrorAlert({
          title: e?.message || "Something went wrong",
          alertType: "error",
        });
      },
    });
  }
  useEffect(() => {
    console.log(propertyId);
    if (!propertyId) {
      resetListing();
    }
  }, [propertyId]);
  const Steps = useMemo(() => {
    switch (listing.step) {
      case 1:
        return <PropertyListingBasic />;
      case 2:
        return <ListingCategory />;
      case 3:
        return <ListingAmenities />;
      case 4:
        return <ListingMediaFiles />;
      case 5:
        return <AdditionalInfomation />;
      case 6:
        return <ListingResult />;
      default:
        return null;
    }
  }, [listing.step]);
  const warn = (msg: string) =>
    showErrorAlert({ title: msg, alertType: "warn" });
  function handleNext(step: number, back?: boolean) {
    if (back) {
      return updateListing({ step });
    } else if (listing.step == 1) {
      if (!listing?.purpose) return warn("Please select your purpose");
      if (!listing?.title || listing.title?.length < 2)
        return warn("Please add property title");
      if (!listing?.description)
        return warn("Please add a detailed description");
      if (!listing?.address) return warn("Please add property location");
      if (!listing?.price) return warn("Please add property price");
      if (!listing?.currency) return warn("Please select a currency");
    } else if (listing.step == 2) {
      if (!listing?.category) return warn("Please select a property type");
      if (!listing?.bedroom && listing.category !== "Land")
        return warn("Please add number of bedrooms");
      if (!listing?.plots && listing.category == "Land")
        return warn("Please add number of plots");
      if (!listing?.subCategory)
        return warn("Please select the kind of property");
      if (listing?.purpose == "rent" && !listing?.duration)
        return warn("Please select rentage duration");
    } else if (listing.step == 3) {
      if (!listing?.facilities)
        return warn("Please select at least 1 amenities");
      if (
        !listing?.availabilityPeriod &&
        (listing.category == "Shortlet" || listing.category == "Hotel")
      )
        return warn("Please add at least 1 availability period");
    } else if (listing.step == 4) {
      if (!listing?.photos) return warn("Add some images to proceed!");
      if (listing?.photos && listing?.photos?.length < 2)
        return warn("Upload at least 2 images");
    } else if (listing.step == 5) {
      if (!listing?.listing_role) return warn("Please select your role");
      if (!listing?.owner_type) return warn("Please select the property owner");
      if (
        !listing?.companies &&
        (listing.category == "Shortlet" || listing.category == "Hotel")
      )
        return warn("Please add a company/organisation to continue");
    }
    updateListingStep();
  }
  return (
    <>
      <Box onLayout={onLayout} className="flex-1">
        <FullHeightLoaderWrapper className="flex-1" loading={loading}>
          <SafeAreaView edges={["bottom"]} className="flex-1">
            <Animated.View
              entering={FadeInRight.duration(200)}
              exiting={FadeOutLeft.duration(200)}
              key={listing.step}
              style={{ height, flex: 1 }}
            >
              <BodyScrollView withBackground contentContainerClassName="pb-12">
                {Steps}
              </BodyScrollView>
            </Animated.View>
            <ListingBottomNavigation
              step={listing.step}
              uploaHandler={uploaHandler}
              onUpdate={handleNext}
              isEdit={type == "edit"}
            />
          </SafeAreaView>
        </FullHeightLoaderWrapper>
      </Box>
    </>
  );
}
