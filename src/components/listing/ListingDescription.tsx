import { Text, View } from "@/components/ui";
import { useTempStore } from "@/store";
import { CustomInput } from "../custom/CustomInput";

export default function ListingDescription() {
  const { listing, updateListing } = useTempStore();
  return (
    <>
      <View className=" p-4 gap-4">
        <View className="gap-1">
          <Text className="text-base font-medium">
            Description <Text className="text-primary">*</Text>
          </Text>
          <Text className="text-sm font-light text-typography/90">
            Enter a detailed description of you/the property.
          </Text>
        </View>
        <CustomInput
          isBottomSheet={false}
          height={400}
          placeholder="Enter property description"
          value={listing.description}
          onUpdate={(val) => updateListing({ ...listing, description: val })}
          multiline={true}
          // numberOfLines={25}
        />
      </View>
    </>
  );
}
