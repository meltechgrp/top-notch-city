import withRenderVisible from "@/components/shared/withRenderOpen";
import { FlatList, Pressable, View } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  ButtonIcon,
  ButtonText,
  Heading,
  Icon,
  Text,
} from "@/components/ui";
import { debounce } from "lodash-es";
import { History, MapPin, Send } from "lucide-react-native";
import { fetchPlaceFromTextQuery } from "@/actions/utills";
import { composeFullAddress } from "@/lib/utils";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { CustomInput } from "@/components/custom/CustomInput";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import {
  getSearchHistory,
  saveSearchToHistory,
  SearchHistory,
} from "@/lib/api";

type Props = {
  show: boolean;
  onDismiss: () => void;
  onUpdate: (data: SearchFilters) => void;
};

function SearchLocationBottomSheet({ show, onDismiss, onUpdate }: Props) {
  const [locating, setLocating] = useState(false);
  const [text, setText] = useState("");
  const [locations, setLocations] = useState<GooglePlace[]>([]);
  const [typing, setTyping] = useState(false);
  const [history, setHistory] = useState<SearchHistory[]>([]);

  const debouncedAutocompleteSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) {
          setLocations([]);
          return;
        }
        try {
          const result = await fetchPlaceFromTextQuery(query);
          setLocations(result);
        } catch (error) {
          console.error("Autocomplete error:", error);
        }
      }, 500),
    []
  );

  useEffect(() => {
    if (show) {
      getSearchHistory().then(setHistory);
    }
  }, [show]);

  useEffect(() => {
    return () => debouncedAutocompleteSearch.cancel();
  }, []);

  const onChangeText = (val: string) => {
    setText(val);
    setTyping(val.length > 0);
    debouncedAutocompleteSearch(val);
  };

  const handleSelect = async (item: SearchFilters) => {
    setTyping(false);
    const newSearch = {
      state: item?.state,
      city: item?.city,
      country: item?.country,
      use_geo_location: "false",
    };

    // Save to history if not already present
    const exists = history.some(
      (h) =>
        h.city === newSearch.city &&
        h.state === newSearch.state &&
        h.country === newSearch.country
    );

    if (!exists) await saveSearchToHistory(newSearch);

    onUpdate(newSearch);
    onDismiss();
    setText("");
    setLocations([]);
  };
  const displayData: SearchHistory[] = typing
    ? locations.map((item) => ({
        city: item?.addressComponents?.city || "",
        state: item?.addressComponents?.state || "",
        country: item?.addressComponents?.country || "",
        displayName: item.displayName || "",
        isSuggestion: true,
      }))
    : history;
  return (
    <BottomSheet
      title="Search property location"
      withHeader={false}
      withBackButton={false}
      snapPoint={"90%"}
      visible={show}
      onDismiss={onDismiss}
    >
      <View className="flex-1 px-4 gap-8 py-2 pb-8 bg-background">
        <View className="gap-3">
          <View className="px-4 pl-2 flex-row gap-4 items-center bg-background-info rounded-xl border border-outline-200">
            <CustomInput
              placeholder="Search property location..."
              value={text}
              isBottomSheet={false}
              className=" flex-1"
              inputClassName="border-0"
              onUpdate={onChangeText}
              returnKeyLabel="Done"
              returnKeyType="done"
            />
            <View className="w-4 h-4 ml-auto items-center justify-center">
              {locating || typing ? <SpinningLoader /> : <Icon as={Send} />}
            </View>
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
              !typing && history.length ? (
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
                      {item.displayName || composeFullAddress(item, false)}
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

export default withRenderVisible(SearchLocationBottomSheet);
