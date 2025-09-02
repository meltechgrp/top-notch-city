import { TouchableOpacity } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { View, Text, Heading } from "@/components/ui";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import DropdownSelect from "@/components/custom/DropdownSelect";

interface RoomsFilterProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: () => void;
  onUpdate: (values: Partial<SearchFilters>) => void;
  onReset: (values: (keyof SearchFilters)[]) => void;
  total: number;
  search: SearchFilters;
  loading: boolean;
}

const OPTIONS1 = ["No min", "1", "2", "3", "4", "5"];
const OPTIONS2 = ["No max", "1", "2", "3", "4", "5"];

export function RoomsFilterSheet({
  visible,
  onDismiss,
  onUpdate,
  total = 0,
  search,
  onApply,
  loading,
  onReset,
}: RoomsFilterProps) {
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["50%"]}
      title="Rooms"
      withHeader
      withScroll
      HeaderRightComponent={
        <AnimatedPressable
          onPress={() =>
            onReset([
              "min_bedroom",
              "max_bedroom",
              "max_bathroom",
              "min_bathroom",
            ])
          }
        >
          <Text>Reset</Text>
        </AnimatedPressable>
      }
    >
      <View className="gap-y-6 p-4">
        {/* Bedrooms */}
        <View>
          <Heading className="text-lg font-semibold mb-3">Bedrooms</Heading>
          <View className="flex-row justify-between gap-4">
            <DropdownSelect
              value={search.min_bedroom || "No min"}
              options={OPTIONS1}
              onChange={(val) => onUpdate({ min_bedroom: val })}
            />
            <DropdownSelect
              value={search.max_bedroom || "No max"}
              options={OPTIONS2}
              onChange={(val) => onUpdate({ max_bedroom: val })}
            />
          </View>
        </View>

        {/* Bathrooms */}
        <View>
          <Heading className="text-lg font-semibold mb-3">Bathrooms</Heading>
          <View className="flex-row justify-between gap-4">
            <DropdownSelect
              value={search.min_bathroom || "No min"}
              options={OPTIONS1}
              onChange={(val) => onUpdate({ min_bathroom: val })}
            />
            <DropdownSelect
              value={search.max_bathroom || "No max"}
              options={OPTIONS2}
              onChange={(val) => onUpdate({ max_bathroom: val })}
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
