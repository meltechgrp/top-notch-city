import { Box, Heading, View, Text } from "@/components/ui";
import { useTempStore } from "@/store";
import CustomSelect from "../custom/CustomSelect";
import OptionsBottomSheet from "../shared/OptionsBottomSheet";
import { CustomInput } from "../custom/CustomInput";

export default function ListingBasis() {
  const { listing, updateListing } = useTempStore();
  return (
    <>
      <Box className="flex-1 px-4">
        <View className=" py-6 gap-8">
          <Heading size="xl">Give your property a unique pricing</Heading>
          <View className="gap-6">
            <View className="gap-2">
              <Text className="text-base font-medium">
                Price <Text className="text-primary">*</Text>
              </Text>
              <CustomInput
                isBottomSheet={false}
                keyboardType="numeric"
                placeholder="Enter price"
                value={listing.price}
                onUpdate={(val) => updateListing({ ...listing, price: val })}
              />
            </View>

            {/* Currency */}
            <View className="gap-2">
              <Text className="text-base font-medium">
                Currency <Text className="text-primary">*</Text>
              </Text>
              <CustomSelect
                withDropIcon
                label="Currency"
                BottomSheet={OptionsBottomSheet}
                value={listing.currency}
                valueParser={(value: any) =>
                  value?.toUpperCase() || "Select Currency"
                }
                onChange={(val) =>
                  updateListing({ ...listing, currency: val.value })
                }
                options={[
                  { label: "NGN", value: "ngn" },
                  { label: "USD", value: "usd" },
                ]}
              />
            </View>
            {/* Duration */}
            {listing.purpose == "rent" && (
              <View className="gap-2">
                <Text className="text-base font-medium">
                  Duration <Text className="text-primary">*</Text>
                </Text>
                <CustomSelect
                  withDropIcon
                  label="Duration"
                  BottomSheet={OptionsBottomSheet}
                  value={listing.duration}
                  valueParser={(value: any) => value || "Select Duration"}
                  onChange={(val) =>
                    updateListing({ ...listing, duration: val.value })
                  }
                  options={[
                    { label: "Monthly", value: "Monthly" },
                    { label: "3 Months", value: "3 Months" },
                    { label: "6 Months", value: "6 Months" },
                    { label: "Yearly", value: "Yearly" },
                    { label: "2 Years", value: "2 Years" },
                    { label: "3 Years", value: "3 Years" },
                  ]}
                />
              </View>
            )}
          </View>
        </View>
      </Box>
    </>
  );
}
