import { FindAmenity } from "@/lib/utils";
import { Text, View } from "../ui";

interface Props {
  property: Property;
}

export function PropertyTitle({
  property: { purpose, amenities, subcategory },
}: Props) {
  if (purpose == "rent") {
    return (
      <View className="mb-2">
        <View className="bg-gray-500/80 rounded-md self-start py-1 px-2">
          <Text className="text-base">To Rent</Text>
        </View>
        <Text className="text-2xl text-white font-bold">
          {FindAmenity("Bedroom", amenities)} Bedroom {subcategory.name}
        </Text>
      </View>
    );
  } else if (purpose == "sell") {
    return (
      <View className="">
        <View className="bg-gray-500/80 rounded-md self-start py-1 px-2">
          <Text className=" text-base">For Sale</Text>
        </View>
        <Text className="text-2xl text-white font-bold">
          {FindAmenity("Bedroom", amenities)} Bedroom {subcategory.name}
        </Text>
      </View>
    );
  } else {
    return ``;
  }
}
