import { TouchableOpacity } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { View, Text, Heading } from "@/components/ui";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import DropdownSelect from "@/components/custom/DropdownSelect";

interface PriceFilterProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: () => void;
  onUpdate: (values: Partial<SearchFilters>) => void;
  onReset: (values: (keyof SearchFilters)[]) => void;
  total: number;
  search: SearchFilters;
  loading: boolean;
}

const OPTIONS1 = [
  "No min",
  "100000",
  "500000",
  "1000000",
  "5000000",
  "50000000",
];
const OPTIONS2 = [
  "No max",
  "500000",
  "1000000",
  "5000000",
  "50000000",
  "1000000000",
];

export function PriceFilterSheet({
  visible,
  onDismiss,
  onUpdate,
  total = 0,
  search,
  onApply,
  onReset,
  loading,
}: PriceFilterProps) {
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["35%"]}
      title="Price"
      withHeader
      withScroll
      HeaderRightComponent={
        <AnimatedPressable onPress={() => onReset(["min_price", "max_price"])}>
          <Text>Reset</Text>
        </AnimatedPressable>
      }
    >
      <View className="gap-y-6 p-4">
        {/* Bedrooms */}
        <View>
          <Heading className="text-lg font-semibold mb-3">Price</Heading>
          <View className="flex-row justify-between gap-4">
            <DropdownSelect
              value={search.min_price || "No min"}
              options={OPTIONS1}
              format
              onChange={(val) => onUpdate({ min_price: val })}
            />
            <DropdownSelect
              value={search.max_price || "No max"}
              options={OPTIONS2}
              format
              onChange={(val) => onUpdate({ max_price: val })}
            />
          </View>
        </View>
      </View>

      {/* Apply Button */}
      <View className="mt-8 px-4">
        <TouchableOpacity
          onPress={() => {
            onApply();
            onDismiss();
          }}
          className="bg-background-muted py-4 rounded-2xl items-center"
        >
          {loading ? (
            <Text className=" font-semibold text-base">Searching...</Text>
          ) : (
            <Text className=" font-semibold text-base">
              See {total} {total > 1 ? "homes" : "home"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
