import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Heading, Icon, Text, View } from "../ui";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { cn, compareRealCurrentMonth } from "@/lib/utils";
import { LucideIcon } from "lucide-react-native";

type Props = TouchableOpacityProps & {
  icon: LucideIcon;
  title: string;
  total?: number;
  showDirection?: boolean;
  data?: {
    month: string;
    count: number;
  }[];
};

export function DashboardCard({
  title,
  total,
  data,
  icon,
  showDirection = true,
  ...props
}: Props) {
  const { direction, rate } = compareRealCurrentMonth(data);
  return (
    <TouchableOpacity
      {...props}
      className="flex-1 h-28 py-4 justify-between rounded-xl bg-background-muted"
    >
      <View className=" gap-4 px-4 flex-row justify-between items-center">
        <View className=" p-2 self-start rounded-full bg-gray-500">
          <Icon size="xl" as={icon} className="text-typography" />
        </View>
        <Heading size="2xl">{total || 0}</Heading>
      </View>
      <View className="flex-row justify-between px-4 items-center">
        <Text
          className={cn(" text-base font-medium", !showDirection && "text-lg")}
        >
          {title}
        </Text>
        {showDirection && (
          <View
            className={cn(
              "flex-row gap-1 p-2 py-1 bg-background items-center rounded-xl"
            )}
          >
            <FontAwesome
              name={direction ? "caret-up" : "caret-down"}
              size={14}
              color={direction ? "green" : "red"}
            />
            <View className="flex-row items-center">
              <FontAwesome
                name={direction ? "plus" : "minus"}
                size={6}
                color={direction ? "green" : "red"}
              />
              <Text className={direction ? "text-green-500" : "text-primary"}>
                {rate}%
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
