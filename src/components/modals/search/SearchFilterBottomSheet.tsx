import withRenderVisible from "@/components/shared/withRenderOpen";
import { useState } from "react";
import { View, Switch } from "react-native";
import { Text, Button, ButtonText, Pressable, Heading } from "@/components/ui";
import BottomSheet from "@/components/shared/BottomSheet";
import CustomSelect from "@/components/custom/CustomSelect";
import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import { CustomSlider } from "@/components/custom/CustomSlider";
import { useFilterOptions } from "@/hooks/useFilteredProperties";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Platforms from "@/constants/Plaforms";
import { cn } from "@/lib/utils";

type Props = {
  show: boolean;
  onDismiss: () => void;
  onApply: (data: SearchFilters) => void;
  filter: SearchFilters;
  properies: Property[];
  showPurpose?: boolean;
};

function SearchFilterBottomSheet({
  show,
  onDismiss,
  onApply,
  filter: initialFilter,
  properies,
  showPurpose = true,
}: Props) {
  const [filter, setFilter] = useState({ ...initialFilter });
  const {
    minBedrooms,
    minPrice,
    maxBedrooms,
    maxPrice,
    booleanAmenities,
    subcategories,
    maxBathrooms,
    minBathrooms,
  } = useFilterOptions(properies);
  function handleApply() {
    onApply(filter);
    onDismiss();
  }

  function handleReset() {
    setFilter({});
    onApply({});
    onDismiss();
  }

  const options = [
    { label: "Rent", value: "rent" },
    { label: "Buy", value: "sell" },
  ];
  return (
    <BottomSheet
      title="Filter"
      withHeader
      rounded={false}
      withBackButton={false}
      snapPoint={["70%"]}
      visible={show}
      withScroll={Platforms.isAndroid()}
      onDismiss={onDismiss}
    >
      <View className="flex-1 relative">
        <BottomSheetScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platforms.isIOS() ? 80 : 0, // enough space for buttons!
          }}
        >
          <View className="flex-1 px-4 gap-4 py-5 pb-8 bg-background">
            {showPurpose && (
              <View className="gap-2">
                <Text className="text-sm">Listing Type</Text>
                <View className="flex-row py-0.5 h-14 rounded-xl gap-5">
                  {options.map(({ label, value }) => (
                    <Pressable
                      both
                      key={label}
                      onPress={() => setFilter({ ...filter, purpose: value })}
                      className={cn(
                        "px-10 rounded-xl py-1 bg-background-muted flex-row gap-1 items-center",
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
            )}
            <View className="gap-1">
              <Text className="text-base">Price range (₦)</Text>
              <CustomSlider
                onValueChange={(max_price) =>
                  setFilter({ ...filter, max_price: max_price.toString() })
                }
                progress={Number(filter.max_price || 0)}
                minimumValue={minPrice}
                maximumValue={maxPrice > 0 ? maxPrice : 1000000}
                steps={10}
                isMoney
              />
            </View>
            <View className="gap-1">
              <Text className="text-base">Bedrooms</Text>
              <CustomSlider
                onValueChange={(min) =>
                  setFilter({ ...filter, bedrooms: min.toString() })
                }
                progress={Number(filter.bedrooms || 0)}
                minimumValue={minBedrooms}
                maximumValue={maxBedrooms > 0 ? maxBedrooms : 10}
              />
            </View>
            <View className="gap-1">
              <Text className="text-base">Bathrooms</Text>
              <CustomSlider
                onValueChange={(min) =>
                  setFilter({ ...filter, bathrooms: min.toString() })
                }
                progress={Number(filter.bathrooms || 0)}
                minimumValue={minBathrooms}
                maximumValue={maxBathrooms > 0 ? maxBathrooms : 10}
              />
            </View>
            {subcategories?.length > 0 && (
              <View className="gap-1.5">
                <Text className="text-base mb-2">Category</Text>
                <CustomSelect
                  withDropIcon={true}
                  BottomSheet={OptionsBottomSheet}
                  value={filter.sub_category}
                  label="types"
                  placeHolder="Select a category"
                  valueParser={(value: any) => value}
                  onChange={(value) => {
                    setFilter({
                      ...filter,
                      sub_category: value.value,
                    });
                  }}
                  options={subcategories.map((name) => ({
                    label: name,
                    value: name?.trim(),
                  }))}
                />
              </View>
            )}
            {booleanAmenities?.length > 0 && (
              <View className="gap-1.5">
                <Text className="text-base">Amenities</Text>
                <View className="gap-y-3 bg-background-muted rounded-xl p-4">
                  {booleanAmenities.map((label) => {
                    const isSelected = filter.amenities?.includes(label);

                    return (
                      <View
                        key={label}
                        className="flex-row items-center justify-between border-b border-outline/20 pb-2"
                      >
                        <Text className="text-base text-typography">
                          {label}
                        </Text>
                        <Switch
                          value={isSelected}
                          onValueChange={(val) => {
                            let updatedAmenities = filter.amenities || [];

                            if (val) {
                              updatedAmenities = [...updatedAmenities, label];
                            } else {
                              updatedAmenities = updatedAmenities.filter(
                                (item) => item !== label
                              );
                            }

                            setFilter({
                              ...filter,
                              amenities: updatedAmenities,
                            });
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* <View className="gap-1.5">
              <Text className="text-sm">Others</Text>
              <View className="gap-y-3 bg-background-muted rounded-xl p-4">
                <View className="flex-row justify-between items-center">
                  <Text>3D Tour</Text>
                  <Switch
                    value={filter?.tour === "yes"}
                    onValueChange={(val) =>
                      setFilter({
                        ...filter,
                        tour: val ? "yes" : undefined,
                      })
                    }
                  />
                </View>
              </View>
            </View> */}
          </View>
        </BottomSheetScrollView>
        <View
          className={cn(
            " absolute bottom-0 left-0 w-full",
            Platforms.isAndroid() && "relative"
          )}
        >
          <View className="flex-row bg-background gap-4 px-4 pt-4 android:pb-2 justify-center items-center">
            <Button
              onPress={handleReset}
              className="h-12 flex-1"
              size="xl"
              variant="outline"
            >
              <ButtonText>Reset</ButtonText>
            </Button>
            <Button
              onPress={handleApply}
              className="h-12 flex-1"
              size="xl"
              variant="solid"
            >
              <ButtonText>Apply</ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

export default withRenderVisible(SearchFilterBottomSheet);
