import { TouchableOpacity, View as V } from "react-native";
import { Text, View, Icon } from "../ui";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";

type MenuListItemProps = V["props"] & {
  title: React.ReactNode;
  description: string;
  icon: any;
  rightComponent?: React.ReactNode;
  withArrow?: boolean;
  iconColor?: string;
  iconBgColor?: string;
  onPress?: () => void;
  className?: string;
};
export function MenuListItem(props: MenuListItemProps) {
  const {
    title,
    description,
    icon,
    rightComponent,
    onPress,
    style,
    className,
    withArrow = true,
    iconColor,
    iconBgColor,
  } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        onPress?.();
      }}
    >
      <View style={[style]} className={cn("flex-row items-center", className)}>
        <View
          className={cn(
            "w-10 h-10 rounded-full items-center justify-center bg-gray-600"
          )}
        >
          <Icon as={icon} className={cn("text-white")} />
        </View>
        <View className="flex-1 pl-3">
          <Text className="text-lg font-medium">{title}</Text>
          {/* <Text className="text-sm text-typography/80">{description}</Text> */}
        </View>
        {withArrow && <Icon as={ChevronRight} className="text-primary" />}
      </View>
    </TouchableOpacity>
  );
}
