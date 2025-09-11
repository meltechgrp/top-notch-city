import { Eye, ThumbsUp } from "lucide-react-native";
import { Icon, Text, View } from "../ui";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface Props {
  interaction: Property["interaction"];
  className?: string;
}

function PropertyInteractions({ interaction, className }: Props) {
  return (
    <View className={cn("gap-4 pr-8", className)}>
      <View className="flex-row gap-2 items-center">
        <Icon as={Eye} size="sm" color="white" />
        <Text className="text-white font-bold font-satoshi text-lg">
          {interaction?.viewed}
        </Text>
      </View>
      <View className="flex-row gap-2 items-center">
        <Icon as={ThumbsUp} size="sm" color={"white"} />
        <Text className="text-white font-bold font-satoshi text-lg">
          {interaction?.liked}
        </Text>
      </View>
    </View>
  );
}

export default memo(PropertyInteractions);
