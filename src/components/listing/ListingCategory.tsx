import { Box, Text, useResolvedTheme, View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useTempStore } from "@/store";
import { useCategoryQueries } from "@/tanstack/queries/useCategoryQueries";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { useMemo } from "react";
import { ButtonsInput, CustomInput } from "@/components/custom/CustomInput";
import CustomSelect from "@/components/custom/CustomSelect";
import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import { Durations } from "@/constants/Amenities";
import { Bath, Bed } from "lucide-react-native";

export default function ListingCategory() {
  const theme = useResolvedTheme();
  const { listing, updateListing } = useTempStore();
  const { subcategories, loading, refetch, categories } = useCategoryQueries();

  const subs = useMemo(() => {
    if (listing.category) {
      return subcategories?.filter((s) => s.category.name == listing?.category);
    } else {
      let category = categories[0]?.name;
      return subcategories?.filter((s) => s.category.name == category);
    }
  }, [subcategories, listing?.category, categories]);

  useRefreshOnFocus(refetch);
  return (
    <>
      <Box className="flex-1 p-4">
        <View className="  gap-6 flex-1">
          <View className="gap-3">
            <Text className="text-base font-medium text-typography/80">
              Property type
            </Text>
            <View className="flex-row gap-4 flex-wrap">
              {loading
                ? Array(4)
                    .fill(null)
                    .map((_, i) => (
                      <MotiView
                        key={i}
                        transition={{
                          type: "timing",
                        }}
                        className="h-12 relative bg-background-muted p-1 rounded-lg"
                      >
                        <Skeleton
                          colorMode={theme == "dark" ? "dark" : "light"}
                          height={40}
                          width={140}
                        />
                      </MotiView>
                    ))
                : categories.map((c) => (
                    <AnimatedPressable
                      key={c.id}
                      onPress={() => {
                        updateListing({
                          category: c.name,
                          subCategory: undefined,
                          duration: undefined,
                          availabilityPeriod: undefined,
                          ...(c.name == "Land"
                            ? {
                                bathroom: undefined,
                                bedroom: undefined,
                              }
                            : {}),
                        });
                      }}
                      containerClassName={"h-12"}
                      className={cn(
                        "px-6 py-2.5 border-t border-r border-outline-100 flex-1 bg-background-muted rounded-xl flex-row gap-1 justify-center items-center",
                        listing?.category === c.name && "bg-primary/80"
                      )}
                    >
                      <Text
                        className={cn(
                          " text-base",
                          listing?.category === c.name && "text-white"
                        )}
                      >
                        {c.name}
                      </Text>
                    </AnimatedPressable>
                  ))}
            </View>
          </View>
          <View className="gap-3">
            <Text className="text-base font-medium text-typography/80">
              Kind of property
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {subs.map((b) => (
                <AnimatedPressable
                  key={b.id}
                  onPress={() => {
                    updateListing({ subCategory: b.name });
                  }}
                  containerClassName="h-12"
                  className={cn(
                    " px-4 py-2.5  bg-background-muted border-t border-r border-outline-100 rounded-xl flex-row gap-1 justify-center items-center",
                    listing?.subCategory === b.name && "bg-primary/80"
                  )}
                >
                  <Text
                    className={cn(
                      " text-base",
                      listing?.subCategory === b.name && "text-white"
                    )}
                  >
                    {b.name}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>
          </View>
          {listing.category !== "Land" && (
            <ButtonsInput
              value={listing.bedroom}
              onUpdate={(val) => updateListing({ bedroom: val })}
              title="Bedrooms"
              icon={Bed}
            />
          )}
          {listing.category !== "Land" && (
            <ButtonsInput
              value={listing.bathroom}
              onUpdate={(val) => updateListing({ bathroom: val })}
              title="Bathrooms"
              icon={Bath}
            />
          )}
          {listing.category == "Land" && (
            <CustomInput
              title="Plots of land"
              placeholder="Number of plots"
              returnKeyType="done"
              enterKeyHint="done"
              returnKeyLabel="Done"
              keyboardType="number-pad"
              value={listing.plots}
              onUpdate={(val) => updateListing({ plots: val })}
            />
          )}

          {listing.purpose == "rent" && (
            <View className="gap-2">
              <Text className="text-base font-medium text-typography/80">
                Duration
              </Text>
              <CustomSelect
                withDropIcon
                label="Duration"
                BottomSheet={OptionsBottomSheet}
                value={listing.duration}
                valueParser={(value: any) =>
                  Durations.find((item) => item.value == value)?.label ||
                  "Select Duration"
                }
                onChange={(val) => updateListing({ duration: val.value })}
                options={Durations}
              />
            </View>
          )}
        </View>
      </Box>
    </>
  );
}
