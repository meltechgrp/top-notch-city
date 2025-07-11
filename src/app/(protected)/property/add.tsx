import { useUploadProperty } from "@/actions/property/upload";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import ListingAmenities from "@/components/listing/ListingAmenities";
import ListingBasis from "@/components/listing/ListingBasis";
import ListingBottomNavigation from "@/components/listing/ListingBottomNavigation";
import ListingCategory from "@/components/listing/ListingCategory";
import ListingDescription from "@/components/listing/ListingDescription";
import ListingLocation from "@/components/listing/ListingLocation";
import ListingMediaFiles from "@/components/listing/ListingMediaFiles";
import ListingPurpose from "@/components/listing/ListingPurpose";
import ListingResult from "@/components/listing/ListingResult";
import FullHeightLoaderWrapper from "@/components/loaders/FullHeightLoaderWrapper";
import headerLeft from "@/components/shared/headerLeft";
import { Box, Button, ButtonText } from "@/components/ui";
import { showSnackbar } from "@/lib/utils";
import { useTempStore } from "@/store";
import { useLayout } from "@react-native-community/hooks";
import { Stack, useRouter } from "expo-router";
import { useMemo } from "react";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SellAddScreen() {
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

  const Steps = useMemo(() => {
    switch (listing.step) {
      case 1:
        return <ListingPurpose />;
      case 2:
        return <ListingCategory />;
      case 3:
        return <ListingAmenities />;
      case 4:
        return <ListingDescription />;
      case 5:
        return <ListingLocation />;
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
      return showSnackbar({
        message: "Please pick your purpose",
        type: "warning",
      });
    } else if (listing.step == 2 && !listing?.subCategory) {
      return showSnackbar({
        message: "Please select a category",
        type: "warning",
      });
    } else if (listing.step == 3) {
      if (!listing.facilities?.find((item) => item.label == "Bedroom")) {
        return showSnackbar({
          message: "Please enter number of bedrooms",
          type: "warning",
        });
      }
    } else if (listing.step == 4 && !listing.description) {
      return showSnackbar({
        message: "Please enter property description",
        type: "warning",
      });
    } else if (listing.step == 5 && !listing?.address?.displayName) {
      return showSnackbar({
        message: "Please enter property location!",
        type: "warning",
      });
    } else if (listing.step == 6) {
      if (listing?.photos && listing?.photos?.length < 3)
        return showSnackbar({
          message: "Select at least 3 images",
          type: "info",
        });
      else if (!listing?.photos?.length)
        return showSnackbar({
          message: "Add some images to proceed!",
          type: "warning",
        });
    }
    if (listing.step == 7) {
      if (!listing?.price) {
        return showSnackbar({
          message: "Please enter property price!",
          type: "warning",
        });
      }
      if (listing.purpose == "rent" && !listing?.duration) {
        return showSnackbar({
          message: "Please enter rentage duration",
          type: "warning",
        });
      }
    }
    updateListingStep();
  }
  async function uploaHandler() {
    await uploadProperty(listing, {
      onSuccess: () => {
        router.dismissTo("/property/success");
        resetListing();
      },
      onError: () =>
        showSnackbar({
          message: error ?? "Something went wrong",
          type: "error",
        }),
    });
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: headerLeft(),
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
      <Box onLayout={onLayout} className="flex-1">
        <FullHeightLoaderWrapper className="flex-1" loading={loading}>
          <SafeAreaView edges={["bottom"]} className="flex-1">
            <BodyScrollView
              className="flex-1  min-h-96"
              contentContainerClassName="pb-28"
            >
              <Animated.View
                entering={FadeInRight.duration(800)}
                exiting={FadeOutLeft.duration(800)}
                key={listing.step}
                style={{ height }}
                className={"flex-1 min-h-96"}
              >
                {Steps}
              </Animated.View>
            </BodyScrollView>
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
