import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Heading, Icon, Text, View } from "@/components/ui";
import { cn, formatNumberCompact } from "@/lib/utils";
import { LucideIcon } from "lucide-react-native";

type Props = TouchableOpacityProps & {
  icon: LucideIcon;
  title: string;
  total?: number;
};

export function AgentCard({ title, total, icon, ...props }: Props) {
  return (
    <TouchableOpacity
      {...props}
      className="flex-1 h-28 py-4 border border-outline-100 gap-1 justify-between rounded-xl bg-background-muted"
    >
      <View className=" gap-2 px-3">
        <Icon size="xl" as={icon} className="text-typography" />
        <View className="flex-row gap-px items-center">
          <Heading className="text-base font-bold">
            {formatNumberCompact(total) || 0}
          </Heading>
        </View>
      </View>
      <View className=" px-3">
        <Text className={cn(" text-base text-typography/80 font-medium")}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
