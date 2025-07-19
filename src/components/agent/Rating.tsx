import { Text, View } from "@/components/ui";
import { Star, StarHalf } from "lucide-react-native";
import { memo } from "react";

interface AgentRatingProps {
  total: number; // e.g. total = 45
  average: number;
  size?: number;
}

const AgentRating = ({ total, average = 5, size = 17 }: AgentRatingProps) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (average >= i) {
      stars.push(
        <Star key={i} size={size} color="#F16000F0" fill="#F16000F0" />
      );
    } else if (average >= i - 0.5) {
      stars.push(
        <StarHalf key={i} size={size} color="#F16000F0" fill="#F16000F0" />
      );
    } else {
      stars.push(<Star key={i} size={size} color="#F16000F0" />);
    }
  }

  return (
    <View className="flex-row items-center gap-1 mt-2">
      <View className="flex-row space-x-0.5">{stars}</View>
      <View className="flex-row gap-1">
        <Text className="text-sm font-light">{average.toFixed(1)}</Text>
        {total > 0 && <Text className="text-sm font-light">({total})</Text>}
      </View>
    </View>
  );
};

export default memo(AgentRating);
