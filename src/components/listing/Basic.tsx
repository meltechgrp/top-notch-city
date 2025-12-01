import { Box, Heading, View, Text, Icon } from "@/components/ui";
import { useTempStore } from "@/store";
import { CustomInput } from "../custom/CustomInput";
import { cn, composeFullAddress } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { KeyboardDismissPressable } from "@/components/shared/KeyboardDismissPressable";
import { ChevronRight, MapPin } from "lucide-react-native";
import { LocationModal } from "@/components/modals/profile/LocationModal";
import { useCallback, useState } from "react";
import useGetLocation from "@/hooks/useGetLocation";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

const tabs = [
  {
    label: "Sale",
    value: "sell",
  },
  {
    label: "Rent",
    value: "rent",
  },
];

export default function PropertyListingBasic() {
  const { listing, updateListing } = useTempStore();
  const { retryGetLocation } = useGetLocation();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleUseLocation = useCallback(async () => {
    setLoading(true);

    const location = await retryGetLocation();
    if (!location) {
      showErrorAlert({
        title: "Unable to get location, try again!",
        alertType: "warn",
      });
      return setLoading(false);
    }

    const result = await getReverseGeocode(location);

    if (!result?.address) {
      showErrorAlert({
        title: "Unable to get location, try again!",
        alertType: "warn",
      });
      return setLoading(false);
    }

    const payload: GooglePlace = {
      displayName: result.address,
      addressComponents: result.addressComponents!,
      location,
    };

    updateListing({ address: payload });
    setLoading(false);
  }, [retryGetLocation, updateListing]);
  return (
    <>
      <Box className="flex-1 px-4 py-4">
        <KeyboardDismissPressable>
          <View className="gap-2">
            <Text className="text-base font-medium text-typography/80">
              Property for
            </Text>
            <View className="flex-row bg-background-muted rounded-2xl border border-outline-100 p-1">
              {tabs.map((tab) => (
                <AnimatedPressable
                  key={tab.label}
                  onPress={() => {
                    updateListing({ purpose: tab.value });
                  }}
                  containerClassName={"flex-1 h-12"}
                  className={cn(
                    " px-4 flex-1  flex-row gap-1 justify-center items-center",
                    listing?.purpose === tab.value && "bg-primary rounded-2xl"
                  )}
                >
                  <Heading
                    className={cn(
                      " text-md",
                      listing?.purpose === tab.value && "text-white"
                    )}
                  >
                    {tab.label}
                  </Heading>
                </AnimatedPressable>
              ))}
            </View>
          </View>
          <View className=" py-6 gap-3">
            <Text className="text-base font-medium text-typography/80">
              Property details
            </Text>
            <View className="gap-6">
              <CustomInput
                placeholder="Enter title"
                value={listing.title}
                onUpdate={(val) => updateListing({ title: val })}
              />
              <CustomInput
                placeholder="Enter description here"
                value={listing.description}
                onUpdate={(val) => updateListing({ description: val })}
                multiline
              />
            </View>
            <View className="gap-2">
              <Text className="text-base font-medium text-typography/80">
                Property location
              </Text>
              <AnimatedPressable
                containerClassName="h-16 bg-background-muted border border-outline-100  rounded-2xl"
                className=" flex-row flex-1 gap-4 items-center px-2 py-1"
                onPress={() => setShowModal(true)}
              >
                <View className="h-full bg-background-muted/80 aspect-square border border-outline-100 rounded-full items-center justify-center">
                  {loading ? (
                    <SpinningLoader />
                  ) : (
                    <Icon size="xl" as={MapPin} className="text-primary" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-sm" numberOfLines={2}>
                    {listing?.address
                      ? composeFullAddress(listing.address.addressComponents)
                      : "Enter property address"}
                  </Text>
                </View>
                <View>
                  <Icon as={ChevronRight} />
                </View>
              </AnimatedPressable>
            </View>
          </View>
        </KeyboardDismissPressable>
      </Box>
      <LocationModal
        open={showModal || false}
        handleUseLocation={handleUseLocation}
        onClose={() => setShowModal?.(false)}
        onSelect={(place) => updateListing({ address: place })}
      />
    </>
  );
}
