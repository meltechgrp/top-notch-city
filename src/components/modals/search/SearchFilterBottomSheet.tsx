import withRenderVisible from "@/components/shared/withRenderOpen";
import { View, Switch, ScrollView } from "react-native";
import { Text, Button, ButtonText, Pressable, Heading } from "@/components/ui";
import BottomSheet from "@/components/shared/BottomSheet";
import { CustomSlider } from "@/components/custom/CustomSlider";
import { cn } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";

type Props = {
  show: boolean;
  onDismiss: () => void;
  onUpdate: (values: Partial<SearchFilters>) => void;
  onApply: () => void;
  filter: SearchFilters;
  showPurpose?: boolean;
  loading: boolean;
  total: number;
  onReset: (values: (keyof SearchFilters)[]) => void;
};

function SearchFilterBottomSheet({
  show,
  onDismiss,
  onApply,
  filter,
  showPurpose = true,
  onUpdate,
  onReset,
  loading,
  total,
}: Props) {
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
      snapPoint={["90%"]}
      visible={show}
      onDismiss={onDismiss}
      HeaderRightComponent={
        <AnimatedPressable
          onPress={() =>
            onReset([
              "min_bedroom",
              "max_bedroom",
              "max_bathroom",
              "min_bathroom",
              "max_price",
              "min_price",
              "purpose",
              "amenities",
              "sub_category",
              "category",
            ])
          }
        >
          <Text>Reset</Text>
        </AnimatedPressable>
      }
    >
      <View className="flex-1 relative">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-4 gap-4 py-5 pb-8 bg-background">
            {showPurpose && (
              <View className="gap-2">
                <Text className="text-sm">Listing Type</Text>
                <View className="flex-row py-0.5 h-14 rounded-xl gap-5">
                  {options.map(({ label, value }) => (
                    <Pressable
                      both
                      key={label}
                      onPress={() => onUpdate({ purpose: value })}
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
                  onUpdate({ max_price: Math.round(max_price).toString() })
                }
                progress={Number(filter.max_price || 0)}
                minimumValue={100000}
                maximumValue={1000000000}
                steps={10}
                isMoney
              />
            </View>
            <View className="gap-1">
              <Text className="text-base">Bedrooms</Text>
              <CustomSlider
                onValueChange={(min) =>
                  onUpdate({ max_bedroom: min.toString() })
                }
                progress={Number(filter.max_bathroom || 0)}
                minimumValue={1}
                maximumValue={10}
              />
            </View>
            <View className="gap-1">
              <Text className="text-base">Bathrooms</Text>
              <CustomSlider
                onValueChange={(min) =>
                  onUpdate({ max_bathroom: min.toString() })
                }
                progress={Number(filter.max_bathroom || 0)}
                minimumValue={0}
                maximumValue={10}
              />
            </View>
            {/* <View className="gap-1.5">
              <Text className="text-base">Amenities</Text>
              <View className="gap-y-3 bg-background-muted rounded-xl p-4">
                {Amenities.map((label) => {
                  const isSelected = filter.amenities?.includes(label);

                  return (
                    <View
                      key={label}
                      className="flex-row items-center justify-between border-b border-outline/20 pb-2"
                    >
                      <Text className="text-base text-typography">{label}</Text>
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

                          onUpdate({
                            amenities: updatedAmenities,
                          });
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View> */}

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
        </ScrollView>
        <View className="flex-row bg-background gap-4 px-4 pt-4 android:pb-2 justify-center items-center">
          <Button
            onPress={onApply}
            className="h-12 flex-1"
            size="xl"
            variant="solid"
          >
            {loading ? (
              <ButtonText className=" font-semibold text-base">
                Searching...
              </ButtonText>
            ) : (
              <ButtonText className="font-semibold text-base">
                See {total} {total > 1 ? "homes" : "home"}
              </ButtonText>
            )}
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

export default SearchFilterBottomSheet;
