import { Text, Icon, Pressable, View } from "@/components/ui";
import { formatNumberCompact } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";

interface FeatureCardProps {
  label: string;
  icon: any;
  onPress?: () => void;
  total?: number;
}

export function FeatureCard({ label, icon, onPress, total }: FeatureCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 max-w-[48%] h-28 bg-background-muted border border-outline-100 rounded-xl gap-4 p-4 justify-center "
    >
      <View className=" gap-4 flex-row justify-between items-center">
        <View className=" p-2 self-start rounded-full bg-gray-500">
          <Icon size="xl" as={icon} className="text-typography" />
        </View>
        <View className="flex-row gap-px items-center">
          {total && (
            <Text className="text-base">{formatNumberCompact(total) || 0}</Text>
          )}
          <Icon as={ChevronRight} className="w-5 h-5 text-primary" />
        </View>
      </View>
      <Text className="text-sm text-typography font-medium">{label}</Text>
    </Pressable>
  );
}
