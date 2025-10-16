import { cn, FindAmenity } from "@/lib/utils";
import { Icon, Text, View } from "../ui";
import { House, LandPlot } from "lucide-react-native";

interface Props {
  property: Property;
  smallView?: boolean;
}

export function PropertyTitle({
  property: { purpose, amenities, subcategory, category },
  smallView,
}: Props) {
  if (purpose == "rent") {
    if (category.name == "Land") {
      return (
        <View className="mb-2 gap-1">
          <View className="bg-primary/80 rounded-md self-start py-1 px-2">
            <Text className={cn("text-base text-white")}>For Rent</Text>
          </View>
          <View className="flex-row gap-1 items-center">
            <Icon size={"sm"} as={LandPlot} className="text-white" />
            <Text className={cn("text-md text-white font-bold")}>
              {FindAmenity("Total Plot", amenities)}{" "}
              {FindAmenity("Total Plot", amenities) > 1 ? "Plots" : "Plot"} of
              Land
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View className="mb-2 gap-1">
          <View className="bg-primary/80 rounded-md self-start py-1 px-2">
            <Text className={cn("text-base text-white")}>For Rent</Text>
          </View>
          <View className="flex-row gap-1 items-center">
            {!smallView && (
              <Icon size={"sm"} as={House} className="text-white" />
            )}
            <Text
              className={cn(
                "text-md text-white font-bold",
                smallView && "text-sm"
              )}
            >
              {FindAmenity("Bedroom", amenities)} Bedroom{" "}
              {subcategory?.name || (subcategory as any)}
            </Text>
          </View>
        </View>
      );
    }
  } else if (purpose == "sell") {
    if (category.name == "Land") {
      return (
        <View className="mb-2 gap-1">
          <View className="bg-primary/80 rounded-md self-start py-1 px-2">
            <Text className={cn("text-base text-white")}>For Sale</Text>
          </View>
          <View className="flex-row gap-1 items-center">
            <Icon size={"sm"} as={LandPlot} />
            <Text className={cn("text-md text-white font-bold")}>
              {FindAmenity("Total Plot", amenities)}{" "}
              {FindAmenity("Total Plot", amenities) > 1 ? "Plots" : "Plot"} of
              Land
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View className="gap-1">
          <View className="bg-primary/80 rounded-md self-start py-1 px-2">
            <Text className={cn("text-base text-white")}>For Sale</Text>
          </View>
          <View className="flex-row gap-1 items-center">
            {!smallView && (
              <Icon size={"sm"} as={House} className="text-white" />
            )}
            <Text
              className={cn(
                "text-md text-white font-bold",
                smallView && "text-sm"
              )}
            >
              {FindAmenity("Bedroom", amenities)} Bedroom{" "}
              {subcategory?.name || (subcategory as any)}
            </Text>
          </View>
        </View>
      );
    }
  } else {
    return ``;
  }
}
