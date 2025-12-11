import { cn } from "@/lib/utils";
import { Badge, Text, View } from "../ui";

interface Props {
  property: Property;
}

export function PropertyBadge({ property: { purpose, category } }: Props) {
  if (purpose == "rent") {
    if (category.name == "Shortlet" || category.name == "Hotel") {
      return (
        <Badge className=" self-start bg-success-100/60">
          <Text>Available</Text>
          <View className="w-2 h-2 -mt-2 ml-1 rounded-full bg-primary animate-pulse" />
        </Badge>
      );
    } else {
      return (
        <View className="bg-info-100/60 rounded-md self-start py-1 px-2">
          <Text className={cn("text-base text-white")}>For Rent</Text>
        </View>
      );
    }
  } else if (purpose == "sell") {
    return (
      <View className="bg-primary/60 rounded-md self-start py-1 px-2">
        <Text className={cn("text-base text-white")}>For Sale</Text>
      </View>
    );
  } else {
    return <></>;
  }
}
