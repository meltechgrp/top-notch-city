import withRenderVisible from "@/components/shared/withRenderOpen";
import { FlatList, Pressable, View } from "react-native";
import { KeyboardDismissPressable } from "../../shared/KeyboardDismissPressable";
import BottomSheet from "../../shared/BottomSheet";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonIcon, ButtonText, Icon, Text } from "../../ui";
import { debounce } from "lodash-es";
import { MapPin, Send } from "lucide-react-native";
import { composeFullAddress, showSnackbar } from "@/lib/utils";
import { MiniEmptyState } from "../../shared/MiniEmptyState";
import { SpinningLoader } from "../../loaders/SpinningLoader";
import useGetLocation from "@/hooks/useGetLocation";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";
import { fetchPlaceFromTextQuery } from "@/actions/utills";
import { CustomInput } from "../../custom/CustomInput";
import { usePropertyDataMutations } from "@/tanstack/mutations/usePropertyDataMutations";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  property: Property;
};

function PropertyLocationEditBottomSheet(props: Props) {
  const { visible, onDismiss, property } = props;
  const { retryGetLocation } = useGetLocation();
  const [text, setText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [locating, setLocating] = useState(false);
  const { updatePropertyLocationMutation } = usePropertyDataMutations();
  const [locations, setLocations] = useState<GooglePlace[]>([]);

  const debouncedAutocompleteSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query || query.length < 3) {
          setLocations([]);
          return;
        }
        try {
          setFetching(true);
          const result = await fetchPlaceFromTextQuery(query);
          setLocations(result);
        } catch (error) {
          console.error("Autocomplete error:", error);
        } finally {
          setFetching(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedAutocompleteSearch.cancel();
    };
  }, [debouncedAutocompleteSearch]);

  const onChangeText = (val: string) => {
    setText(val);
    debouncedAutocompleteSearch(val);
  };

  async function handleAddress(item: GooglePlace) {
    await updatePropertyLocationMutation.mutateAsync(
      { propertyId: property.id, location: item },
      {
        onSuccess: () => {
          showSnackbar({
            message: "Property location updated",
            type: "success",
          });
          onDismiss();
        },
        onError: () => {
          showSnackbar({ message: "Failed to update location", type: "error" });
        },
      }
    );
  }
  return (
    <BottomSheet
      title="Enter property location"
      withHeader
      withBackButton={false}
      snapPoint={"70%"}
      visible={visible}
      onDismiss={onDismiss}
    >
      <KeyboardDismissPressable>
        <View className="flex-1 px-4 gap-8 py-5 pb-8 bg-background">
          <View className="px-4 flex-row items-center gap-4 bg-background-info rounded-xl border border-outline-200">
            <CustomInput
              placeholder="Search property location..."
              value={text}
              isBottomSheet={true}
              className=" border-0 bg-transparent"
              onUpdate={onChangeText}
              returnKeyLabel="Search"
              returnKeyType="search"
            />
            <View className="w-4 h-4 ml-auto items-center justify-center">
              {fetching ||
              locating ||
              updatePropertyLocationMutation.isPending ? (
                <SpinningLoader />
              ) : (
                <Icon as={Send} />
              )}
            </View>
          </View>
          <View className="flex-1">
            <FlatList
              data={locations}
              refreshing={updatePropertyLocationMutation.isPending}
              keyExtractor={(item) => item.placeId!}
              contentContainerClassName="bg-background-muted py-4 pb-8 gap-4 rounded-xl"
              keyboardShouldPersistTaps="never"
              keyboardDismissMode="on-drag"
              ListHeaderComponent={() => (
                <View className="px-4 pb-2">
                  <Text size="md" className="font-light">
                    Locations
                  </Text>
                </View>
              )}
              ListEmptyComponent={() => (
                <MiniEmptyState
                  className="mb-8"
                  title={
                    text?.length > 2
                      ? "No available address"
                      : "Start typing..."
                  }
                />
              )}
              ListFooterComponent={() => (
                <View className="py-2">
                  <Button
                    className=" h-12 self-center rounded-xl"
                    onPress={async () => {
                      setLocating(true);
                      const location = await retryGetLocation();
                      if (!location)
                        return showSnackbar({
                          message: "Unable to get location, try again!",
                          type: "warning",
                        });
                      const result = await getReverseGeocode(location);
                      setLocating(false);
                      if (result?.address) {
                        await handleAddress({
                          location,
                          addressComponents: result.addressComponents,
                          displayName: "",
                        });
                      } else {
                        showSnackbar({
                          message: "Unable to get location, try again!",
                          type: "warning",
                        });
                      }
                    }}
                  >
                    <ButtonText>Use my location</ButtonText>
                    <ButtonIcon as={MapPin} color="white" />
                  </Button>
                </View>
              )}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleAddress({ ...item, displayName: "" })}
                >
                  <View className="flex-row gap-3 p-2 px-4 bg-background-info border-b border-outline">
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
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </KeyboardDismissPressable>
    </BottomSheet>
  );
}

export default withRenderVisible(PropertyLocationEditBottomSheet);
