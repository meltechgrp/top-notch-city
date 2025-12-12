import { FlatList, View } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon, Text, Pressable, Heading } from "@/components/ui";
import { debounce } from "lodash-es";
import { History, MapPin, SearchIcon } from "lucide-react-native";
import { fetchPlaceFromTextQuery } from "@/actions/utills";
import { cn, composeFullAddress } from "@/lib/utils";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { CustomInput } from "@/components/custom/CustomInput";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { useStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import useGetLocation from "@/hooks/useGetLocation";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { getReverseGeocode } from "@/hooks/useReverseGeocode";

type Props = {
  show: boolean;
  filter: SearchFilters;
  onDismiss: () => void;
  onUpdate: (values: Partial<SearchFilters>) => void;
  refetchAndApply: () => void;
};

const options = [
  { label: "Rent", value: "rent" },
  { label: "Buy", value: "sell" },
];
function SearchLocationBottomSheet({
  show,
  onDismiss,
  filter,
  onUpdate,
  refetchAndApply,
}: Props) {
  const { retryGetLocation } = useGetLocation();
  const [text, setText] = useState("");
  const [locations, setLocations] = useState<GooglePlace[]>([]);
  const { savedSearches, updateSavedSearch } = useStore();
  const [typing, setTyping] = useState(false);
  const [locating, setLocating] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: fetchPlaceFromTextQuery,
    mutationKey: [text],
    onSuccess: (data) => {
      setLocations(data);
    },
    onError: () => {
      setLocations([]);
    },
  });

  const debouncedAutocompleteSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) {
          setLocations([]);
          return;
        }
        try {
          await mutateAsync(query);
        } catch (error) {}
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedAutocompleteSearch.cancel();
  }, []);

  const onChangeText = (val: string) => {
    setText(val);
    setTyping(val.length > 0);
    debouncedAutocompleteSearch(val);
  };
  function hnadleSave(search: SearchHistory) {
    const history = savedSearches;
    const existingIndex = history.findIndex(
      (item: any) =>
        item.city === search.city &&
        item.state === search.state &&
        item.country === search.country &&
        item.longitude === search.longitude &&
        item.latitude === search.latitude
    );

    if (existingIndex !== -1) history.splice(existingIndex, 1);
    history.unshift(search);

    const trimmed = history.slice(0, 10);
    updateSavedSearch(trimmed);
  }

  const handleSelect = async (item: SearchFilters) => {
    setTyping(false);
    const newSearch = {
      state: item?.state,
      city: item?.city,
      country: item?.country,
      use_geo_location: "false",
      longitude: item.longitude,
      latitude: item.latitude as string,
    };

    const exists = savedSearches.some(
      (h) =>
        h.city === newSearch.city &&
        h.state === newSearch.state &&
        h.country === newSearch.country &&
        h.longitude === newSearch.longitude &&
        h.latitude === newSearch.latitude
    );

    if (!exists) hnadleSave(newSearch);

    onUpdate(newSearch);
    refetchAndApply();
    onDismiss();
    setText("");
    setLocations([]);
  };

  const handleUseLocation = useCallback(async () => {
    setTyping(true);

    const locationData = await retryGetLocation();
    if (!locationData) {
      showErrorAlert({
        title: "Unable to get location, try again!",
        alertType: "warn",
      });
      return setTyping(false);
    }

    const result = await getReverseGeocode(locationData);

    if (!result?.address) {
      showErrorAlert({
        title: "Unable to get location, try again!",
        alertType: "warn",
      });
      return setTyping(false);
    }

    handleSelect({ ...result.addressComponents, ...locationData } as any);
    setTyping(false);
  }, [retryGetLocation, handleSelect]);
  const displayData: SearchHistory[] = typing
    ? locations.map((item) => ({
        city: item?.addressComponents?.city || "",
        state: item?.addressComponents?.state || "",
        country: item?.addressComponents?.country || "",
        displayName: item.displayName || "",
        isSuggestion: true,
        longitude: item?.location.longitude.toString(),
        latitude: item?.location.latitude.toString(),
      }))
    : savedSearches;

  return (
    <BottomSheet
      withHeader={false}
      withBackButton={false}
      snapPoint={"95%"}
      visible={show}
      onDismiss={onDismiss}
    >
      <View className="flex-1 px-4 gap-8 py-2 pb-8 bg-background">
        <View className="gap-3">
          <View className="px-2 flex-row gap-4 items-center bg-background-muted rounded-full border border-outline-200">
            <CustomInput
              placeholder="Search for a state, city or location..."
              value={text}
              containerClassName=" border-0 min-h-12 flex-1"
              className="h-12 border-0"
              autoFocus
              onUpdate={onChangeText}
              onSubmitEditing={() => {
                if (displayData?.length > 0) handleSelect(displayData[0]);
              }}
              submitBehavior={"blurAndSubmit"}
              enablesReturnKeyAutomatically
              returnKeyLabel="Search"
              returnKeyType="search"
            />
            <View className=" ml-auto p-2 bg-primary rounded-full">
              {locating ? <SpinningLoader /> : <Icon as={SearchIcon} />}
            </View>
          </View>
          <View className="flex-row py-0.5 h-14 rounded-xl gap-5">
            {options.map(({ label, value }) => (
              <Pressable
                both
                key={label}
                onPress={() => onUpdate({ purpose: value })}
                className={cn(
                  "px-10 flex-1 border border-outline-100 rounded-2xl py-1 bg-background-muted justify-center flex-row gap-1 items-center",
                  filter.purpose === value && "bg-primary"
                )}
              >
                <Heading
                  className={cn(
                    "text-base",
                    filter.purpose === value && "text-white"
                  )}
                >
                  {label}
                </Heading>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Results */}
        <View className="flex-1">
          <FlatList
            data={displayData}
            keyExtractor={(_, index) => index.toString()}
            key={typing ? "suggestions" : "history"}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={displayData?.length > 12}
            keyboardDismissMode="on-drag"
            refreshing={locating}
            contentContainerClassName="bg-background-muted p-4 rounded-xl"
            ListHeaderComponent={() =>
              !typing && savedSearches.length ? (
                <View className="px-4 pb-2">
                  <Text size="lg" className="font-light">
                    Recent searches
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={() => (
              <MiniEmptyState
                className="mb-8"
                title={
                  text?.length > 2
                    ? "No available locations"
                    : "Start typing..."
                }
              />
            )}
            renderItem={({ item }: { item: any }) => (
              <Pressable onPress={() => handleSelect(item)}>
                <View className="flex-row gap-3 p-2 border-b border-outline">
                  <View className="mt-2">
                    <Icon
                      as={item.isSuggestion ? MapPin : History}
                      className="text-primary"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg text-typography">
                      {item.displayName || composeFullAddress(item)}
                    </Text>
                    <Text className="text-sm text-wrap text-typography/90">
                      Properties in {item?.city} {item?.state}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

export default SearchLocationBottomSheet;
