import { ScrollView, View } from "react-native";
import {
  Text,
  Button,
  ButtonText,
  Pressable,
  Heading,
  Switch,
  Checkbox,
  CheckboxLabel,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/components/ui";
import BottomSheet from "@/components/shared/BottomSheet";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContent,
  AccordionIcon,
} from "@/components/ui/accordion";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/ui/icon";

import { cn } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import DropdownSelect from "@/components/custom/DropdownSelect";
import { useCategoryQueries } from "@/tanstack/queries/useCategoryQueries";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAmenities } from "@/actions/property/amenity";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback } from "react";

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
  const { subcategories, categories } = useCategoryQueries();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["amenities"],
    queryFn: fetchAllAmenities,
  });
  const options = [
    { label: "Rent", value: "rent" },
    { label: "Buy", value: "sell" },
  ];
  const FooterComponent = useCallback(
    () => (
      <SafeAreaView edges={["bottom"]} className="bg-background">
        <View className="flex-row bg-background gap-4 px-4 pt-4 android:pb-2 justify-center items-center">
          <Button
            onPress={() => {
              onApply();
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
    <BottomSheet
      title="Filter"
      withHeader
      rounded={false}
      withBackButton={false}
      snapPoint={["95%"]}
      visible={show}
      enablePanDownToClose={false}
      onDismiss={onDismiss}
      withScroll
      HeaderRightComponent={
        <AnimatedPressable
          className="px-4 py-1.5 border border-outline-100 bg-background-muted rounded-2xl"
          onPress={() =>
            onReset([
              "min_bedroom",
              "max_bedroom",
              "max_bathroom",
              "min_bathroom",
              "max_price",
              "min_price",
              "amenities",
              "sub_category",
              "category",
            ])
          }
        >
          <Text>Reset</Text>
        </AnimatedPressable>
      }
      footerComponent={FooterComponent}
    >
      <View key={JSON.stringify(filter)} className="flex-1 relative">
        <View className="flex-1 px-4 gap-4 py-5 pb-8 bg-background">
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
            <Text className="text-base mb-2">Category</Text>
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
                value={filter.min_price || "No min"}
                options={PRICE1}
                format
                className="bg-background-muted"
                onChange={(val) => onUpdate({ min_price: val })}
              />
              <DropdownSelect
                value={filter.max_price || "No max"}
                options={PRICE2}
                format
                className="bg-background-muted"
                onChange={(val) => onUpdate({ max_price: val })}
              />
            </View>
          </View>
          <View>
            <Text className="text-base mb-2">Bedrooms</Text>
            <View className="flex-row justify-between gap-4">
              <DropdownSelect
                value={filter.min_bedroom || "No min"}
                options={OPTIONS1}
                className="bg-background-muted"
                onChange={(val) => onUpdate({ min_bedroom: val })}
              />
              <DropdownSelect
                value={filter.max_bedroom || "No max"}
                options={OPTIONS2}
                className="bg-background-muted"
                onChange={(val) => onUpdate({ max_bedroom: val })}
              />
            </View>
          </View>
          <View className="">
            <Text className="text-base mb-2">Bathrooms</Text>
            <View className="flex-row justify-between gap-4">
              <DropdownSelect
                value={filter.min_bathroom || "No min"}
                options={OPTIONS1}
                className="bg-background-muted"
                onChange={(val) => onUpdate({ min_bathroom: val })}
              />
              <DropdownSelect
                value={filter.max_bathroom || "No max"}
                options={OPTIONS2}
                className="bg-background-muted"
                onChange={(val) => onUpdate({ max_bathroom: val })}
              />
            </View>
          </View>
          <Accordion
            size="sm"
            variant="filled"
            type="multiple"
            defaultValue={["a", "b"]}
            className="p-0 gap-4 bg-background"
          >
            <AccordionItem value="a">
              <AccordionHeader>
                <AccordionTrigger className="p-0 border-b border-outline-100 pt-2 pb-3">
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <AccordionTitleText className="text-base font-normal">
                          Categories
                        </AccordionTitleText>
                        {isExpanded ? (
                          <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                        ) : (
                          <AccordionIcon
                            as={ChevronDownIcon}
                            className="ml-3"
                          />
                        )}
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="gap-2 my-2 bg-background-muted p-4 border border-outline-100 rounded-xl">
                {subcategories.map((b) => {
                  const isSelected = filter.sub_category?.includes(b.name);
                  return (
                    <Checkbox
                      value={""}
                      key={b.id}
                      isChecked={isSelected}
                      onChange={() => {
                        const updated = isSelected
                          ? filter.sub_category?.filter((t) => t !== b.name) ||
                            []
                          : [...(filter.sub_category || []), b.name];

                        onUpdate({ sub_category: updated });
                      }}
                      size="lg"
                    >
                      <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                      </CheckboxIndicator>
                      <CheckboxLabel>{b.name}</CheckboxLabel>
                    </Checkbox>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b" className="gap-2">
              <AccordionHeader>
                <AccordionTrigger className="p-0 border-b border-outline-100 pt-2 pb-3">
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <AccordionTitleText>Amenities</AccordionTitleText>
                        {isExpanded ? (
                          <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                        ) : (
                          <AccordionIcon
                            as={ChevronDownIcon}
                            className="ml-3"
                          />
                        )}
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="p-0">
                <View className="gap-y-3 border border-outline-100 bg-background-muted rounded-xl p-4">
                  {data
                    ?.filter((a) => a.category.trim() == "Residential")
                    .map((item) => {
                      const isSelected = filter.amenities?.includes(item.name);

                      return (
                        <View
                          key={item.id}
                          className="flex-row items-center justify-between border-b border-outline/20 pb-2"
                        >
                          <Text className="text-base text-typography">
                            {item.name}
                          </Text>
                          <Switch
                            value={isSelected}
                            onValueChange={(val) => {
                              let updatedAmenities = filter.amenities || [];

                              if (val) {
                                updatedAmenities = [
                                  ...updatedAmenities,
                                  item.name,
                                ];
                              } else {
                                updatedAmenities = updatedAmenities.filter(
                                  (f) => f !== item.name
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>
      </View>
    </BottomSheet>
  );
}

export default SearchFilterBottomSheet;
