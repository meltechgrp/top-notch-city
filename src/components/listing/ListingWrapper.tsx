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
import { useTempStore } from "@/store";
import { useLayout } from "@react-native-community/hooks";
import { useRouter } from "expo-router";
import { useMemo } from "react";
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
  const router = useRouter();
  const { onLayout, height } = useLayout();
  const {
    uploadProperty,
    uploading: loading,
    error,
  } = useUploadProperty(type, propertyId);
  const { listing, updateListing, updateListingStep, resetListing } =
    useTempStore();

  async function uploaHandler() {
    await uploadProperty(listing, {
      onSuccess: (e) => {
        router.dismissTo({
          pathname: "/(protected)/agents/[userId]/properties/success",
          params: {
            userId,
          },
        });
        resetListing();
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
  function handleNext(step: number, back?: boolean) {
    if (back) {
      return updateListing({ step });
    } else if (listing.step == 1) {
      if (!listing?.purpose) {
        return showErrorAlert({
          title: "Please select your purpose",
          alertType: "warn",
        });
      } else if (!listing?.title || listing.title?.length < 2) {
        return showErrorAlert({
          title: "Please add property title",
          alertType: "warn",
        });
      } else if (!listing?.description) {
        return showErrorAlert({
          title: "Please add a detailed description",
          alertType: "warn",
        });
      } else if (!listing?.address) {
        return showErrorAlert({
          title: "Please add property location",
          alertType: "warn",
        });
      }
    } else if (listing.step == 2) {
      if (!listing?.purpose) {
        return showErrorAlert({
          title: "Please select a property type",
          alertType: "warn",
        });
      } else if (!listing?.subCategory) {
        return showErrorAlert({
          title: "Please select the kind of property",
          alertType: "warn",
        });
      } else if (!listing?.currency) {
        return showErrorAlert({
          title: "Please select a currency",
          alertType: "warn",
        });
      } else if (!listing?.price) {
        return showErrorAlert({
          title: "Please add property price",
          alertType: "warn",
        });
      } else if (listing?.purpose == "rent" && !listing?.duration) {
        if (listing.category != "Shortlet" && listing.category != "Hotel") {
          return showErrorAlert({
            title: "Please select rentage duration",
            alertType: "warn",
          });
        }
      }
    } else if (listing.step == 3 && !listing?.facilities?.length) {
      return showErrorAlert({
        title: "Please select at least 2 amenities",
        alertType: "warn",
      });
    } else if (listing.step == 4) {
      if (listing?.photos && listing?.photos?.length < 2)
        return showErrorAlert({
          title: "Upload at least 2 images",
          alertType: "warn",
        });
      else if (!listing?.photos?.length)
        return showErrorAlert({
          title: "Add some images to proceed!",
          alertType: "warn",
        });
    }
    updateListingStep();
  }
  return (
    <>
      <Box onLayout={onLayout} className="flex-1">
        <FullHeightLoaderWrapper className="flex-1" loading={loading}>
          <SafeAreaView edges={["bottom"]} className="flex-1">
            <Animated.View
              entering={FadeInRight.duration(800)}
              exiting={FadeOutLeft.duration(800)}
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
