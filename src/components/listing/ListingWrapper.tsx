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
import { listingStore } from "@/store/listing";
import { useQueryClient } from "@tanstack/react-query";
import { useLayout } from "@react-native-community/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface ListingWrapperProps {
  type: "edit" | "add";
  userId?: string;
  propertyId?: string;
}

export function ListingWrapper({
  userId,
  type,
  propertyId,
}: ListingWrapperProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useLocalSearchParams<{ userId?: string }>();
  const ownerId = userId ?? params?.userId;
  const { onLayout, height } = useLayout();
  const {
    uploadProperty,
    uploading: loading,
    error,
  } = useUploadProperty(type, propertyId);
  const { listing, updateListing, updateListingStep, resetListing } =
    listingStore();

  React.useEffect(() => {
    if (type === "add") resetListing();
  }, [resetListing, type]);

  async function uploaHandler() {
    await uploadProperty(listing, {
      onSuccess: (e) => {
        queryClient.invalidateQueries({ queryKey: ["properties"] });
        queryClient.invalidateQueries({ queryKey: ["agent-properties"] });
        router.dismissTo({
          pathname: "/(protected)/agents/[userId]/properties/success",
          params: {
            userId: ownerId ?? "",
          },
        });
        resetListing();
      },
      onError: (e) => {
        console.log(e, "here");
        showErrorAlert({
          title: e?.message || "Something went wrong",
          alertType: "error",
        });
      },
    });
  }
  const warn = (msg: string) =>
    showErrorAlert({ title: msg, alertType: "warn" });

  const StepComponent = getListingStepComponent(listing.step);

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
            <Box style={{ height, flex: 1 }}>
              <BodyScrollView withBackground contentContainerClassName="pb-12">
                <StepComponent />
              </BodyScrollView>
            </Box>
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

function getListingStepComponent(step: number) {
  switch (step) {
    case 1:
      return PropertyListingBasic;
    case 2:
      return ListingCategory;
    case 3:
      return ListingAmenities;
    case 4:
      return ListingMediaFiles;
    case 5:
      return AdditionalInfomation;
    case 6:
      return ListingResult;
    default:
      return PropertyListingBasic;
  }
}
