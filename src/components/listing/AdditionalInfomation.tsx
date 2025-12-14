import { Box, Icon, Pressable, Text, View } from "@/components/ui";
import { useTempStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { CustomInput } from "@/components/custom/CustomInput";
import CustomSelect from "@/components/custom/CustomSelect";
import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import { ListingRole, OnwerType } from "@/constants/Amenities";
import { CompanyModal } from "@/components/modals/profile/CompanyModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAgentCompanies } from "@/actions/property/amenity";
import DropdownSelect from "@/components/custom/DropdownSelect";
import { Plus, Trash } from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import { formatNumber, unformatNumber } from "@/lib/utils";

export default function AdditionalInfomation() {
  const { listing, updateListing } = useTempStore(useShallow((s) => s));
  const { data } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchAllAgentCompanies,
  });
  const companies = data?.slice() || [];
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  return (
    <>
      <Box className="py-2 flex-1 px-4 gap-4">
        <View className="gap-1">
          <Text className="text-xl font-medium">
            Who's listing this property for rent?
          </Text>
          <Text className="text-xs text-typography/90">
            Enter your information, unless you're creating the listing for
            someone else and they should be the main contact person.
          </Text>
        </View>
        <View className="gap-1">
          <Text className="text-base">Listing Role?</Text>
          <CustomSelect
            BottomSheet={OptionsBottomSheet}
            title="Listing Role"
            label="Listing Role"
            withDropIcon
            value={listing.listing_role}
            valueParser={(value: any) =>
              ListingRole.find((item) => item.value == value)?.label ||
              "Select Role"
            }
            options={ListingRole}
            onChange={(val) => updateListing({ listing_role: val.value })}
          />
        </View>
        <View className="gap-1">
          <Text className="text-base">Property Ownership?</Text>
          <CustomSelect
            BottomSheet={OptionsBottomSheet}
            title="Ownership"
            withDropIcon
            label="Ownership type"
            value={listing.owner_type}
            valueParser={(value: any) =>
              OnwerType.find((item) => item.value == value)?.label ||
              "Select type"
            }
            options={OnwerType}
            onChange={(val) => updateListing({ owner_type: val.value })}
          />
        </View>

        {listing.purpose == "rent" && (
          <CustomInput
            title="Caution Fee (optional)"
            placeholder="Caution fee"
            keyboardType="number-pad"
            returnKeyType="done"
            enterKeyHint="done"
            returnKeyLabel="Done"
            value={formatNumber(listing.landarea?.toString())}
            onUpdate={(val) => updateListing({ landarea: unformatNumber(val) })}
          />
        )}
        <CustomInput
          title="Discount (optional)"
          placeholder="Discount percentage"
          keyboardType="number-pad"
          returnKeyType="done"
          enterKeyHint="done"
          returnKeyLabel="Done"
          value={listing.discount}
          onUpdate={(val) => updateListing({ discount: val })}
        />
        {(listing.listing_role == "agent" ||
          listing.listing_role == "manager") &&
          listing.owner_type != "individual" && (
            <View className="gap-3">
              <Text className="text-sm">
                Select/Add company/organisation that belongs to the property for
                verification purpose
              </Text>
              <Divider />
              {listing?.companies && listing?.companies?.length > 0 ? (
                <View className="">
                  {listing?.companies.map((c) => (
                    <View
                      key={c.name}
                      className="bg-background-muted border border-outline-100 p-4 rounded-xl"
                    >
                      <View className="flex-row justify-between items-center">
                        <Text className="text-typography/80 text-sm mb-2">
                          Selected company/organisation
                        </Text>
                        <Pressable
                          className="rounded-xl items-center p-2 bg-primary/80 border border-outline-100"
                          onPress={() => {
                            updateListing({ companies: undefined });
                          }}
                        >
                          <Icon size="sm" as={Trash} />
                        </Pressable>
                      </View>
                      <View className="flex-row gap-2 items-center">
                        <Text className="text-sm">Name:</Text>
                        <Text className="font-semibold">{c.name}</Text>
                      </View>
                      <View className="flex-row gap-2 items-center">
                        <Text className="text-sm">Phone:</Text>
                        <Text className="font-semibold">
                          {c?.phone || "N/A"}
                        </Text>
                      </View>
                      <View className="flex-row gap-2 items-center">
                        <Text className="text-sm">Email:</Text>
                        <Text className="font-semibold">
                          {c?.email || "N/A"}
                        </Text>
                      </View>
                      <View className="flex-row gap-2 items-center">
                        <Text className="text-sm">Address:</Text>
                        <Text className="font-semibold">
                          {c?.address || "N/A"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="gap-2">
                  <CustomSelect
                    BottomSheet={OptionsBottomSheet}
                    title="Company"
                    withDropIcon
                    label="company"
                    value={undefined}
                    valueParser={(value: any) =>
                      companies.find((item) => item.name == value)?.name ||
                      "Select from existing"
                    }
                    options={companies.map((a) => ({
                      value: a.name,
                      label: a.name,
                    }))}
                    onChange={(val) => {
                      const comp = companies.find((c) => c.name == val.value);
                      if (!comp) return;
                      updateListing({ companies: [comp] });
                    }}
                  />
                  <Pressable
                    className=" h-14 flex-row bg-background-muted px-4 justify-between items-center rounded-xl border border-outline-100"
                    onPress={() => setShowCompanyModal(true)}
                  >
                    <Text>Upload new company</Text>
                    <View className="p-1.5 aspect-square bg-background rounded-full border border-outline-100">
                      <Icon size="xl" as={Plus} className="text-primary" />
                    </View>
                  </Pressable>
                </View>
              )}
            </View>
          )}
      </Box>
      <CompanyModal
        onSave={(val) => {
          updateListing({ companies: [val as Company] });
        }}
        visible={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
      />
    </>
  );
}
