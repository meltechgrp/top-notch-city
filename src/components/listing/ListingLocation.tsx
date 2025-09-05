import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Heading,
  Icon,
  Text,
  View,
} from "@/components/ui";
import { useEffect, useMemo, useState } from "react";
import { KeyboardDismissPressable } from "../shared/KeyboardDismissPressable";
import { Pressable } from "react-native";
import { MapPin } from "lucide-react-native";
import { useTempStore } from "@/store";
import { debounce } from "lodash-es";
import useGetLocation from "@/hooks/useGetLocation";
import { CustomInput } from "@/components/custom/CustomInput";
import { fetchPlaceFromTextQuery } from "@/actions/utills";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { composeFullAddress, showSnackbar } from "@/lib/utils";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";

export default function ListingLocation({ height }: { height?: number }) {
  const { location, retryGetLocation } = useGetLocation();
  const { listing, updateListing, updateListingStep } = useTempStore();
  const [fetching, setFetching] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<GooglePlace[]>([]);

  const debouncedAutocompleteSearch = useMemo(
    () =>
      debounce(
        async (query: string) => {
          if (!query || query.length < 3) {
            setLocations([]);
            return;
          }
          try {
            setFetching(true);
            const result = await fetchPlaceFromTextQuery(query);
            setLocations(result);
          } catch (error) {
          } finally {
            setFetching(false);
          }
        },
        500,
        { leading: false, trailing: true }
      ),
    []
  );
  useEffect(() => {
    return () => {
      // Clean up debounce on unmount
      debouncedAutocompleteSearch.cancel();
    };
  }, [debouncedAutocompleteSearch]);

  const onChangeText = (val: string) => {
    setText(val);
    debouncedAutocompleteSearch(val);
  };

  const handleSelect = (item: GooglePlace) => {
    updateListing({ ...listing, address: item });
    updateListingStep();
    setText("");
    setLocations([]);
  };
  const coords = useMemo(() => {
    if (listing?.address?.location) {
      return listing?.address?.location;
    }
    if (location) {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }
    return undefined;
  }, [location, listing?.address?.location]);
  return (
    <>
      <Box className="flex-1 ">
        <View className=" py-6 gap-4 px-4">
          <Heading size="md">Where is your property Located</Heading>
        </View>
        <KeyboardDismissPressable>
          <View className="flex-1 px-4 gap-8 py-5 pb-8 bg-background">
            <View className="px-4 flex-row items-center gap-4 bg-background-info rounded-xl border border-outline-200">
              <CustomInput
                placeholder={"Search property location..."}
                value={text}
                isBottomSheet={false}
                containerClassName="flex-1"
                className=" border-0 flex-1 h-full p-0"
                inputClassName=" bg-transparent h-12 border-0 p-0"
                onUpdate={onChangeText}
                returnKeyLabel="Search"
                returnKeyType="search"
              />
              <View className="w-4 h-4 ml-auto items-center justify-center">
                {fetching && <SpinningLoader />}
              </View>
            </View>
            <View className="flex-1 gap-2">
              {locations?.length > 0 && (
                <View className="px-4 pb-2">
                  <Text size="md" className="font-light">
                    Available Locations
                  </Text>
                </View>
              )}
              <View className="flex-1 bg-background">
                {locations ? (
                  locations.map((item) => (
                    <Pressable
                      key={item.placeId}
                      onPress={() =>
                        handleSelect({
                          ...item,
                          displayName: composeFullAddress(
                            item.addressComponents
                          )!,
                        })
                      }
                    >
                      <View className="flex-row gap-3 p-2 rounded-md py-3 bg-background-muted">
                        <View className="mt-2">
                          <Icon as={MapPin} className="text-primary" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-lg text-typography">
                            {item.displayName}
                          </Text>
                          <Text className="flex-shrink text-wrap text-typography">
                            {composeFullAddress(item.addressComponents)}
                          </Text>
                        </View>
                        <View className="bg-primary px-4 py-2 self-center rounded-md">
                          <Text>Select</Text>
                        </View>
                      </View>
                    </Pressable>
                  ))
                ) : (
                  <MiniEmptyState
                    className="mb-8"
                    title={
                      text?.length > 2
                        ? "No available locations"
                        : "Start typing..."
                    }
                  />
                )}
              </View>
            </View>
          </View>
        </KeyboardDismissPressable>
      </Box>
      {/* <View className=" px-4 py-2 absolute bottom-4 w-full">
        <Button
          className=" h-12 self-center rounded-full"
          onPress={async () => {
            setLoading(true);
            const location = await retryGetLocation();
            if (!location)
              return showSnackbar({
                message: "Unable to get location, try again!",
                type: "warning",
              });
            const result = await getReverseGeocode(location);
            if (result) {
              const { address, addressComponents } = result;
              if (!address) {
                showSnackbar({
                  message: "Unable to get location, try again!",
                  type: "warning",
                });
                return setLoading(false);
              }
              updateListing({
                ...listing,
                address: {
                  displayName: address,
                  addressComponents: addressComponents!,
                  location: location,
                },
              });
            } else {
              showSnackbar({
                message: "Unable to get location, try again!",
                type: "warning",
              });
            }
            setLoading(false);
          }}
        >
          <ButtonText>Use my location</ButtonText>
          {loading ? (
            <ButtonIcon as={Loader} color="white" />
          ) : (
            <ButtonIcon as={MapPin} color="white" />
          )}
        </Button>
      </View> */}
    </>
  );
}
