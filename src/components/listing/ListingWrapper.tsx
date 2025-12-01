import { useUploadProperty } from "@/actions/property/upload";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import PropertyListingBasic from "@/components/listing/Basic";
import ListingAmenities from "@/components/listing/ListingAmenities";
import ListingBasis from "@/components/listing/ListingBasis";
import ListingBottomNavigation from "@/components/listing/ListingBottomNavigation";
import ListingCategory from "@/components/listing/ListingCategory";
import ListingDescription from "@/components/listing/ListingDescription";
import ListingLocation from "@/components/listing/ListingLocation";
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
}

export function ListingWrapper({}: ListingWrapperProps) {
  const router = useRouter();
  const { onLayout, height } = useLayout();
  const {
    uploadProperty,
    uploading: loading,
    error,
    success,
  } = useUploadProperty();
  const { listing, updateListing, updateListingStep, resetListing } =
    useTempStore();

  async function uploaHandler() {
    await uploadProperty(listing, {
      onSuccess: () => {
        router.dismissTo("/property/success");
        resetListing();
      },
      onError: () =>
        showErrorAlert({
          title: error ?? "Something went wrong",
          alertType: "error",
        }),
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
    } else if (listing.step == 1) {
      if (!listing?.purpose) {
        return showErrorAlert({
          title: "Please select your purpose",
          alertType: "warn",
        });
      }
      //   else if (!listing?.title || listing.title?.length < 2) {
      //     return showErrorAlert({
      //       title: "Please add property title",
      //       alertType: "warn",
      //     });
      //   } else if (!listing?.description || listing.title?.length < 10) {
      //     return showErrorAlert({
      //       title: "Please add a detailed description",
      //       alertType: "warn",
      //     });
      //   } else if (!listing?.address) {
      //     return showErrorAlert({
      //       title: "Please add property location",
      //       alertType: "warn",
      //     });
      //   }
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
      }
      //   else if (!listing?.description || listing.title?.length < 10) {
      //     return showErrorAlert({
      //       title: "Please add a detailed description",
      //       alertType: "warn",
      //     });
      //   } else if (!listing?.address) {
      //     return showErrorAlert({
      //       title: "Please add property location",
      //       alertType: "warn",
      //     });
      //   }
      //   return showErrorAlert({
      //     title: "Please select a category",
      //     alertType: "warn",
      //   });
    } else if (listing.step == 5 && !listing?.address?.displayName) {
      //   return showErrorAlert({
      //     title: "Please enter property location!",
      //     alertType: "warn",
      //   });
    } else if (listing.step == 6) {
      if (listing?.photos && listing?.photos?.length < 1)
        return showErrorAlert({
          title: "Select at least 1 images",
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
            />
          </SafeAreaView>
        </FullHeightLoaderWrapper>
      </Box>
    </>
  );
}
