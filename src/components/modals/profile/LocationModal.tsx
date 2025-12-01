import React, { useEffect, useMemo, useState } from "react";
import { Modal, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Check, MapPin, X } from "lucide-react-native";
import { debounce } from "lodash-es";
import { cn, composeFullAddress } from "@/lib/utils";
import { Icon, Pressable, Text, View } from "@/components/ui";
import { useMutation } from "@tanstack/react-query";
import { fetchPlaceFromTextQuery } from "@/actions/utills";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";

export function LocationModal({
  open,
  onClose,
  onSelect,
  handleUseLocation,
}: {
  open: boolean;
  onClose: () => void;
  handleUseLocation: () => void;
  onSelect: (data: GooglePlace) => void;
}) {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<GooglePlace[]>([]);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: fetchPlaceFromTextQuery,
    mutationKey: [query],
    onSuccess: (data) => {
      setLocations(data);
    },
    onError: () => {
      setLocations([]);
    },
  });

  const debouncedAutocompleteSearch = useMemo(
    () =>
      debounce(
        async (query: string) => {
          if (!query || query.length < 3) {
            setLocations([]);
            return;
          }
          await mutateAsync(query);
        },
        500,
        { leading: false, trailing: true }
      ),
    []
  );
  useEffect(() => {
    return () => {
      debouncedAutocompleteSearch.cancel();
    };
  }, [debouncedAutocompleteSearch]);

  const onChangeText = (val: string) => {
    setQuery(val);
    debouncedAutocompleteSearch(val);
  };

  const handleSelect = (item: GooglePlace) => {
    onSelect(item);
    setQuery("");
    setLocations([]);
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-background rounded-2xl p-4 max-h-[90%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className=" text-lg font-semibold">Search locations</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon as={X} size={"xl"} />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Search for a location..."
            placeholderTextColor="#777"
            value={query}
            onChangeText={onChangeText}
            onSubmitEditing={() => {
              handleSelect(locations[0]);
              onClose();
            }}
            submitBehavior={"blurAndSubmit"}
            enablesReturnKeyAutomatically
            returnKeyLabel="Done"
            returnKeyType="done"
            className="bg-background-muted  h-12 rounded-xl text-typography px-3 mb-4"
          />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
            className=" h-[90%]"
          >
            <View className="flex-1 gap-2">
              {locations?.length > 0 && (
                <View className="px-4 pb-2">
                  <Text size="md" className="font-light">
                    Available Locations
                  </Text>
                </View>
              )}
              <View className="flex-1 gap-1 bg-background">
                {locations?.length > 0 ? (
                  locations.map((item) => (
                    <Pressable
                      key={item.placeId}
                      onPress={() => {
                        handleSelect(item);
                        onClose();
                      }}
                    >
                      <View className="flex-row items-center gap-3 p-2 rounded-md py-3 bg-background-muted">
                        <View className="mt-2">
                          <Icon as={MapPin} className="text-primary" />
                        </View>
                        <View className="flex-1">
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
                    className="mt-8"
                    description="locations will be displayed here"
                    subIcon={MapPin}
                    buttonLabel="Use my location"
                    onPress={() => {
                      handleUseLocation();
                      onClose();
                    }}
                    title={
                      query?.length > 2
                        ? "No available locations"
                        : "Start typing..."
                    }
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
