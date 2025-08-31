import { cn, FindAmenity } from "@/lib/utils";
import { Text, View } from "../ui";

interface Props {
  property: Property;
  smallView?: boolean;
}

export function PropertyTitle({
  property: { purpose, amenities, subcategory },
  smallView = false,
}: Props) {
  if (purpose == "rent") {
    return (
      <View className="mb-2 gap-1">
        <View className="bg-gray-500/80 rounded-md self-start py-1 px-2">
          <Text className={cn("text-base text-white", smallView && "text-sm")}>
            For Rent
          </Text>
        </View>
        <Text
          className={cn("text-xl text-white font-bold", smallView && "text-sm")}
        >
          {FindAmenity("Bedroom", amenities)} Bedroom{" "}
          {subcategory?.name || (subcategory as any)}
        </Text>
      </View>
    );
  } else if (purpose == "sell") {
    return (
      <View className="gap-1">
        <View className="bg-gray-500/80 rounded-md self-start py-1 px-2">
          <Text className={cn("text-base text-white", smallView && "text-sm")}>
            For Sale
          </Text>
        </View>
        <Text
          className={cn("text-xl text-white font-bold", smallView && "text-sm")}
        >
          {FindAmenity("Bedroom", amenities)} Bedroom{" "}
          {subcategory?.name || (subcategory as any)}
        </Text>
      </View>
    );
  } else {
    return ``;
  }
}
