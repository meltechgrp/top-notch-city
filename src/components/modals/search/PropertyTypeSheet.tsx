import { ScrollView, TouchableOpacity } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { View, Text, Heading } from "@/components/ui";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { useCategoryQueries } from "@/tanstack/queries/useCategoryQueries";
import { cn } from "@/lib/utils";
import withRenderVisible from "@/components/shared/withRenderOpen";

interface PropertyTypeSheetProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: () => void;
  onUpdate: (values: Partial<SearchFilters>) => void;
  onReset: (values: (keyof SearchFilters)[]) => void;
  total: number;
  search: SearchFilters;
  loading: boolean;
}

function PropertyTypeSheet({
  visible,
  onDismiss,
  onUpdate,
  total = 0,
  search,
  onApply,
  loading,
  onReset,
}: PropertyTypeSheetProps) {
  const { subcategories } = useCategoryQueries();
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["60%"]}
      title="Property Type"
      withHeader
      HeaderRightComponent={
        <AnimatedPressable onPress={() => onReset(["sub_category"])}>
          <Text className="text-primary">Reset</Text>
        </AnimatedPressable>
      }
    >
      <View className="p-4 flex-1 gap-y-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {subcategories.map((b) => {
              const isSelected = search.sub_category?.includes(b.name);
              return (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => {
                    if (isSelected) {
                      onUpdate({
                        sub_category:
                          search?.sub_category?.filter((t) => t !== b.name) ||
                          [],
                      });
                    } else {
                      onUpdate({
                        sub_category: [...(search.sub_category || []), b.name],
                      });
                    }
                    const updated = isSelected
                      ? search?.sub_category?.filter((t) => t !== b.name) || []
                      : [...(search.sub_category || []), b.name];
                    onUpdate({ sub_category: updated });
                  }}
                  className={cn(
                    "w-[31%] h-16 flex-row items-center justify-center rounded-xl border border-outline",
                    isSelected && "bg-primary"
                  )}
                >
                  <Text
                    className={cn(
                      "text-sm text-center",
                      isSelected && "text-white"
                    )}
                  >
                    {b.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Apply Button */}
      <View className="mt-4 px-4">
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
            <Text className="font-semibold text-base">
              See {total} {total > 1 ? "homes" : "home"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

export default withRenderVisible(PropertyTypeSheet);
