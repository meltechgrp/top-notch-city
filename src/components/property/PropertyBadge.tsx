import { cn } from "@/lib/utils";
import { Badge, Text, View } from "../ui";
import { Property } from "@/db/models/properties";

interface Props {
  property: Property;
}

export function PropertyBadge({
  property: { purpose, category, is_booked },
}: Props) {
  if (purpose == "rent") {
    if (category == "Shortlet" || category == "Hotel") {
      if (is_booked) {
        return (
          <Badge className=" self-start px-3 rounded-2xl bg-info-100">
            <Text>Booked</Text>
          </Badge>
        );
      } else {
        return (
          <Badge className=" self-start px-3 rounded-2xl bg-green-600">
            <Text>Available</Text>
            <View className="w-2 h-2 -mt-3 ml-1 rounded-full bg-white animate-pulse" />
          </Badge>
        );
      }
    } else {
      return (
        <View className="bg-black/90 rounded-2xl self-start py-1 px-3">
          <Text className={cn("text-base text-white")}>For Rent</Text>
        </View>
      );
    }
  } else if (purpose == "sell") {
    return (
      <View className="bg-primary rounded-2xl self-start py-1 px-3">
        <Text className={cn("text-base text-white")}>For Sale</Text>
      </View>
    );
  } else {
    return <></>;
  }
}
