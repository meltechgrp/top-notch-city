import withRenderVisible from "@/components/shared/withRenderOpen";
import { FlatList, Pressable, View } from "react-native";
import { KeyboardDismissPressable } from "../shared/KeyboardDismissPressable";
import BottomSheet from "../shared/BottomSheet";
import { useEffect, useMemo, useState } from "react";
import { Icon, Text } from "../ui";
import { debounce } from "lodash-es";
import { MapPin } from "lucide-react-native";
import { fetchPlaceFromTextQuery } from "@/actions/utills";
import { composeFullAddress } from "@/lib/utils";
import { MiniEmptyState } from "../shared/MiniEmptyState";
import { CustomInput } from "../custom/CustomInput";
import { SpinningLoader } from "../loaders/SpinningLoader";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onUpdate: (data: GooglePlace) => void;
  address?: GooglePlace;
};

function ListingAddressBottomSheet(props: Props) {
  const { visible, onDismiss, onUpdate } = props;
  const [fetching, setFetching] = useState(false);
  const [text, setText] = useState("");
  const [locations, setLocations] = useState<GooglePlace[]>([]);
  const [typing, setTyping] = useState(false);

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
    setTyping(val.length > 0);
    debouncedAutocompleteSearch(val);
  };

  const handleSelect = (item: GooglePlace) => {
    onUpdate(item);
    onDismiss();
    setText("");
    setLocations([]);
  };

  return (
    <BottomSheet
      withHeader={false}
      withBackButton={false}
      snapPoint={"80%"}
      visible={visible}
      onDismiss={onDismiss}
    >
      <KeyboardDismissPressable>
        <View className="flex-1 px-4 gap-8 py-5 pb-8 bg-background">
          <View className="px-4 flex-row items-center gap-4 bg-background-info rounded-xl border border-outline-200">
            <CustomInput
              placeholder="Search property location..."
              value={text}
              isBottomSheet={false}
              className=" border-0 flex-1 h-full p-0"
              inputClassName=" bg-transparent h-12 border-0 p-0"
              onUpdate={onChangeText}
              returnKeyLabel="Search"
              returnKeyType="search"
            />
            <View className="w-4 h-4 ml-auto items-center justify-center">
              {(typing || fetching) && <SpinningLoader />}
            </View>
          </View>

          <View className="flex-1">
            <FlatList
              data={locations}
              refreshing={typing}
              keyExtractor={(item) => item.placeId!}
              contentContainerClassName="bg-background-muted p-4 rounded-xl"
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
                      ? "No available locations"
                      : "Start typing..."
                  }
                />
              )}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    handleSelect({
                      ...item,
                      displayName: composeFullAddress(item.addressComponents)!,
                    })
                  }
                >
                  <View className="flex-row gap-3 p-2 border-b border-outline">
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

export default withRenderVisible(ListingAddressBottomSheet);
