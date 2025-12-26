import { ScrollView, View } from "react-native";
import { Text, Button, ButtonText, Pressable, Heading } from "@/components/ui";
import { Icon } from "@/components/ui/icon";

import { cn } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import DropdownSelect from "@/components/custom/DropdownSelect";
import { useCategoryQueries } from "@/tanstack/queries/useCategoryQueries";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllAmenities,
  fetchAllBedTypes,
  fetchAllViewTypes,
} from "@/actions/property/amenity";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback } from "react";
import ModalScreen from "@/components/shared/ModalScreen";
import { BedSingle, ChevronRight, Proportions } from "lucide-react-native";

const OPTIONS1 = ["No min", "1", "2", "3", "4", "5"];
const OPTIONS2 = ["No max", "1", "2", "3", "4", "5"];

const PRICE1 = ["No min", "100000", "500000", "1000000", "5000000", "50000000"];
const PRICE2 = [
  "No max",
  "500000",
  "1000000",
  "5000000",
  "50000000",
  "1000000000",
];
type Props = {
  show: boolean;
  onDismiss: () => void;
  onUpdate: (values: Partial<SearchFilters>) => void;
  filter: SearchFilters;
  showPurpose?: boolean;
  loading: boolean;
  total: number;
  onReset: (values: (keyof SearchFilters)[]) => void;
};

function SearchFilterBottomSheet({
  show,
  onDismiss,
  filter,
  showPurpose = true,
  onUpdate,
  onReset,
  loading,
  total,
}: Props) {
  const { subcategories, categories } = useCategoryQueries();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["amenities"],
    queryFn: fetchAllAmenities,
  });
  const { data: beds } = useQuery({
    queryKey: ["bedTypes"],
    queryFn: fetchAllBedTypes,
  });
  const { data: views } = useQuery({
    queryKey: ["viewTypes"],
    queryFn: fetchAllViewTypes,
  });
  const options = [
    { label: "For Rent", value: "rent" },
    { label: "For Sale", value: "sell" },
  ];
  const FooterComponent = useCallback(
    () => (
      <SafeAreaView edges={["bottom"]} className="bg-background">
        <View className="flex-row bg-background gap-4 px-4 pt-2 android:pb-2 justify-center items-center">
          <Button
            onPress={() => {
              onDismiss();
            }}
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
      </SafeAreaView>
    ),
    [total, loading]
  );
  return (
    <ModalScreen
      title="Filter Options"
      visible={show}
      onDismiss={onDismiss}
      rightComponent={
        <AnimatedPressable
          className="px-4 py-1.5 border border-outline-100 bg-background-muted rounded-2xl"
          onPress={() =>
            onReset([
              "minBedroom",
              "maxBedroom",
              "maxBathroom",
              "minBathroom",
              "maxPrice",
              "minPrice",
              "amenities",
              "subCategory",
              "category",
            ])
          }
        >
          <Text>Reset</Text>
        </AnimatedPressable>
      }
    >
      <View key={JSON.stringify(filter)} className="flex-1 relative">
        <View className="flex-1 px-4 gap-4 py-5 pb-8 bg-background">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-4"
          >
            <View className="gap-2">
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
            <View>
              <Text className="text-base mb-2">Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName=" gap-4"
              >
                {categories.map(({ name, id }) => (
                  <Pressable
                    both
                    key={id}
                    onPress={() => onUpdate({ category: name })}
                    className={cn(
                      "px-4 flex-1 h-12 border border-outline-100 rounded-xl py-1 bg-background-muted justify-center flex-row gap-1 items-center",
                      filter.category === name && "bg-primary"
                    )}
                  >
                    <Heading
                      className={cn(
                        "text-base",
                        filter.category === name && "text-white"
                      )}
                    >
                      {name}
                    </Heading>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View>
              <Text className="text-base mb-2">Price</Text>
              <View className="flex-row justify-between gap-4">
                <DropdownSelect
                  value={filter.minPrice || "No min"}
                  options={PRICE1}
                  format
                  className="bg-background-muted"
                  onChange={(val) => onUpdate({ minPrice: val as any })}
                />
                <DropdownSelect
                  value={filter.maxPrice || "No max"}
                  options={PRICE2}
                  format
                  className="bg-background-muted"
                  onChange={(val) => onUpdate({ maxPrice: val as any })}
                />
              </View>
            </View>
            <View>
              <Text className="text-base mb-2">Bedrooms</Text>
              <View className="flex-row justify-between gap-4">
                <DropdownSelect
                  value={filter.minBedroom || "No min"}
                  options={OPTIONS1}
                  className="bg-background-muted"
                  onChange={(val) => onUpdate({ minBedroom: val as any })}
                />
                <DropdownSelect
                  value={filter.maxBedroom || "No max"}
                  options={OPTIONS2}
                  className="bg-background-muted"
                  onChange={(val) => onUpdate({ maxBedroom: val as any })}
                />
              </View>
            </View>
            <View className="">
              <Text className="text-base mb-2">Bathrooms</Text>
              <View className="flex-row justify-between gap-4">
                <DropdownSelect
                  value={filter.minBathroom || "No min"}
                  options={OPTIONS1}
                  className="bg-background-muted"
                  onChange={(val) => onUpdate({ minBathroom: val as any })}
                />
                <DropdownSelect
                  value={filter.maxBathroom || "No max"}
                  options={OPTIONS2}
                  className="bg-background-muted"
                  onChange={(val) => onUpdate({ maxBathroom: val as any })}
                />
              </View>
            </View>
            <View>
              <Text className="text-base mb-2">Categories</Text>
              <View className="flex-row justify-between gap-4">
                <DropdownSelect
                  multiple
                  value={filter.subCategory || "Select a categories"}
                  options={subcategories?.map((s) => s.name)}
                  className="bg-background-muted"
                  onChange={(val) => onUpdate({ subCategory: val as any })}
                />
              </View>
            </View>
            <View>
              <Text className="text-base mb-2">Amenities</Text>
              <View className="flex-row justify-between gap-4">
                <DropdownSelect
                  multiple
                  value={filter.amenities || "Select a amenities"}
                  options={data?.map((s) => s.name) || []}
                  className="bg-background-muted"
                  onChange={(val) => onUpdate({ amenities: val as any })}
                />
              </View>
            </View>
            {(filter.category == "Shortlet" || filter.category == "Hotel") && (
              <DropdownSelect
                value={filter.bedType as any}
                onChange={(values) => onUpdate({ bedType: values as any })}
                className=" flex-1 p-4 py-4 bg-background-muted rounded-xl border border-outline-100 gap-1"
                Trigger={
                  <View className="flex-row flex-1  justify-between items-center gap-2">
                    <Icon
                      size="md"
                      as={BedSingle}
                      className="text-typography/80"
                    />
                    <View className="flex-1">
                      <Text
                        className={cn(
                          "text-typography/80",
                          filter?.bedType && "text-xs -mt-1"
                        )}
                      >
                        Bed type {!filter?.bedType ? "(optional)" : ""}
                      </Text>
                      {filter?.bedType && (
                        <Text className="font-medium capitalize">
                          {filter.bedType}
                        </Text>
                      )}
                    </View>

                    <Icon
                      size="md"
                      as={ChevronRight}
                      className="text-primary"
                    />
                  </View>
                }
                options={beds?.map((a) => a.name) || []}
              />
            )}
            {(filter.category == "Shortlet" || filter.category == "Hotel") && (
              <DropdownSelect
                value={filter.viewType as any}
                onChange={(values) => onUpdate({ viewType: values as any })}
                className=" flex-1 p-4 py-4 bg-background-muted rounded-xl border border-outline-100 gap-1"
                Trigger={
                  <View className="flex-row flex-1  justify-between items-center gap-2">
                    <Icon
                      size="md"
                      as={Proportions}
                      className="text-typography/80"
                    />
                    <View className="flex-1">
                      <Text
                        className={cn(
                          "text-typography/80",
                          filter?.viewType && "text-xs -mt-1"
                        )}
                      >
                        View type {!filter?.viewType ? "(optional)" : ""}
                      </Text>
                      {filter?.viewType && (
                        <Text className="font-medium capitalize">
                          {filter.viewType}
                        </Text>
                      )}
                    </View>

                    <Icon
                      size="md"
                      as={ChevronRight}
                      className="text-primary"
                    />
                  </View>
                }
                options={views?.map((a) => a.name) || []}
              />
            )}
            {(filter.category == "Shortlet" || filter.category == "Hotel") && (
              <View>
                <Text className="text-base mb-2">Max guests</Text>
                <View className="flex-row justify-between gap-4">
                  <DropdownSelect
                    value={filter.guests || "No min"}
                    options={OPTIONS1}
                    className="bg-background-muted"
                    onChange={(val) => onUpdate({ guests: val as any })}
                  />
                </View>
              </View>
            )}
            {filter?.category == "Land" && (
              <View>
                <Text className="text-base mb-2">Plots</Text>
                <View className="flex-row justify-between gap-4">
                  <DropdownSelect
                    value={filter.minPlots || "No min"}
                    options={OPTIONS1}
                    className="bg-background-muted"
                    onChange={(val) => onUpdate({ minPlots: val as any })}
                  />
                  <DropdownSelect
                    value={filter.maxPlots || "No max"}
                    options={OPTIONS2}
                    className="bg-background-muted"
                    onChange={(val) => onUpdate({ maxPlots: val as any })}
                  />
                </View>
              </View>
            )}
            {filter?.category == "Land" && (
              <View>
                <Text className="text-base mb-2">Land Area</Text>
                <View className="flex-row justify-between gap-4">
                  <DropdownSelect
                    value={filter.minLandarea || "No min"}
                    options={OPTIONS1}
                    className="bg-background-muted"
                    onChange={(val) => onUpdate({ minLandarea: val as any })}
                  />
                  <DropdownSelect
                    value={filter.maxLandarea || "No max"}
                    options={OPTIONS2}
                    className="bg-background-muted"
                    onChange={(val) => onUpdate({ maxLandarea: val as any })}
                  />
                </View>
              </View>
            )}
          </ScrollView>
          <FooterComponent />
        </View>
      </View>
    </ModalScreen>
  );
}

export default SearchFilterBottomSheet;
