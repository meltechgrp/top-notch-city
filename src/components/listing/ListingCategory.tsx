import {
  Box,
  Icon,
  Pressable,
  Text,
  useResolvedTheme,
  View,
} from "@/components/ui";
import { cn, formatNumber, unformatNumber } from "@/lib/utils";
import { ScrollView } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useTempStore } from "@/store";
import { useCategoryQueries } from "@/tanstack/queries/useCategoryQueries";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { useMemo, useState } from "react";
import { CustomInput, DateInput } from "@/components/custom/CustomInput";
import { CurrencyPickerModal } from "@/components/modals/property/CurrencyModal";
import { ChevronDown, MoveRight, Plus, X } from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import CustomSelect from "@/components/custom/CustomSelect";
import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import { Durations } from "@/constants/Amenities";
import { format, formatISO } from "date-fns";
import { showErrorAlert } from "@/components/custom/CustomNotification";

export default function ListingCategory() {
  const theme = useResolvedTheme();
  const { listing, updateListing } = useTempStore();
  const [currencyModal, setCurrencyModal] = useState(false);
  const [availability, setAvailability] = useState({
    start: "",
    end: "",
  });
  const { subcategories, loading, refetch, categories } = useCategoryQueries();

  const subs = useMemo(
    () => subcategories?.filter((s) => s.category.name == listing?.category),
    [subcategories, listing?.category]
  );

  useRefreshOnFocus(refetch);
  return (
    <>
      <Box className="flex-1 p-4">
        <View className="  gap-6 flex-1">
          <View className="gap-3">
            <Text className="text-base font-medium text-typography/80">
              Property type
            </Text>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerClassName="gap-4"
            >
              {loading
                ? Array(4)
                    .fill(null)
                    .map((_, i) => (
                      <MotiView
                        key={i}
                        transition={{
                          type: "timing",
                        }}
                        className="relative bg-background-muted p-1 rounded-lg"
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
                        updateListing({ category: c.name });
                      }}
                      containerClassName={" max-w-1/2"}
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
            </ScrollView>
          </View>
          <View className="gap-3">
            <Text className="text-base font-medium text-typography/80">
              Kind of property
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-4"
            >
              {subs.map((b) => (
                <AnimatedPressable
                  key={b.id}
                  onPress={() => {
                    updateListing({ subCategory: b.name });
                  }}
                  className={cn(
                    " px-6 py-2.5  bg-background-muted border-t border-r border-outline-100 rounded-xl flex-row gap-1 justify-center items-center",
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
            </ScrollView>
          </View>
          <View className="gap-2">
            <Text className="text-base font-medium text-typography/80">
              Price
            </Text>
            <View className="flex-row items-center bg-background-muted rounded-xl overflow-hidden border border-outline-100">
              <Pressable
                onPress={() => setCurrencyModal(true)}
                className="flex-row items-center gap-1 px-3 h-full"
              >
                <Text>{listing?.currency || "NGN"}</Text>
                <Icon as={ChevronDown} />
              </Pressable>
              <Divider orientation="vertical" />
              <View className="flex-1">
                <CustomInput
                  keyboardType="numeric"
                  placeholder="Enter price"
                  className="border-0 rounded-none"
                  value={formatNumber(listing.price)}
                  onUpdate={(val) =>
                    updateListing({
                      price: unformatNumber(val),
                    })
                  }
                />
              </View>
            </View>
          </View>
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
          {listing.category == "Shortlet" && (
            <View className="gap-3">
              <Text className="text-base font-medium text-typography/80">
                Availabilty Period
              </Text>
              {listing?.availabilityPeriod && (
                <ScrollView
                  contentContainerClassName="gap-4"
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {listing?.availabilityPeriod?.map((p, i) => (
                    <AnimatedPressable
                      onPress={() => {
                        updateListing({
                          availabilityPeriod: [
                            ...(listing?.availabilityPeriod?.filter(
                              (_, index) => index != i
                            ) || []),
                          ],
                        });
                      }}
                      key={i}
                      className="flex-row gap-1 rounded-xl items-center px-4 py-2 border border-outline-100"
                    >
                      <Text className="text-sm">
                        {format(new Date(p.start), "dd-MMM")}
                      </Text>
                      <View>
                        <Icon size="sm" as={MoveRight} />
                      </View>
                      <Text className="text-sm">
                        {format(new Date(p.end), "dd-MMM")}
                      </Text>
                      <View className="ml-2 p-1 bg-primary rounded-full">
                        <Icon size="sm" as={X} className="" />
                      </View>
                    </AnimatedPressable>
                  ))}
                </ScrollView>
              )}
              <View className="flex-row gap-4 items-center">
                <View className="flex-1 flex-row gap-4 items-center">
                  <View className="border flex-1 justify-between border-outline-100 gap-3 flex-row items-center px-3 py-1 rounded-xl">
                    <Text>
                      {availability?.start
                        ? format(new Date(availability.start), "dd-MMM")
                        : "Start"}
                    </Text>
                    <DateInput
                      modal
                      containerClassName="mb-0"
                      className="border-0 p-0 h-10"
                      value={availability.start}
                      withMinDate={false}
                      onUpdate={(val) => {
                        const formatStart = (date: string | Date) => {
                          const d = new Date(date);
                          d.setHours(0, 0, 0, 0);
                          return formatISO(d);
                        };
                        setAvailability((p) => ({
                          ...p,
                          start: formatStart(val),
                        }));
                      }}
                    />
                  </View>
                  <View>
                    <Icon as={MoveRight} />
                  </View>
                  <View className="border flex-1 justify-between border-outline-100 gap-3 flex-row items-center px-3 py-1 rounded-xl">
                    <Text>
                      {availability?.end
                        ? format(new Date(availability.end), "dd-MMM")
                        : "End"}
                    </Text>
                    <DateInput
                      modal
                      withMinDate={false}
                      containerClassName="mb-0"
                      className="border-0 p-0 h-10"
                      value={availability.end}
                      onUpdate={(val) => {
                        const formatEnd = (date: string | Date) => {
                          const d = new Date(date);
                          d.setHours(23, 59, 59, 999);
                          return formatISO(d);
                        };
                        setAvailability((p) => ({
                          ...p,
                          end: formatEnd(val),
                        }));
                      }}
                    />
                  </View>
                </View>
                <AnimatedPressable
                  className="px-6 py-3 flex-row items-center gap-2 border border-outline-100 bg-background-muted rounded-xl"
                  onPress={() => {
                    if (
                      !availability?.start?.trim() ||
                      !availability?.end?.trim()
                    )
                      return showErrorAlert({
                        title: "Please select a valid date",
                        alertType: "warn",
                      });
                    updateListing({
                      availabilityPeriod: [
                        ...(listing?.availabilityPeriod || []),
                        availability,
                      ],
                    });
                    setAvailability({
                      start: "",
                      end: "",
                    });
                  }}
                >
                  <Text>Add</Text>
                  <Icon as={Plus} />
                </AnimatedPressable>
              </View>
            </View>
          )}
        </View>
      </Box>
      <CurrencyPickerModal
        open={currencyModal}
        onClose={() => setCurrencyModal(false)}
        selected={listing.currency}
        onSelect={(code) => updateListing({ currency: code })}
      />
    </>
  );
}
