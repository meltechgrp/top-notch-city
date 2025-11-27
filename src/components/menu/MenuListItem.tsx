import { TouchableOpacity, View as V } from "react-native";
import { Text, View, Icon } from "../ui";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";

type MenuListItemProps = V["props"] & {
  title: string;
  description?: string;
  icon: any;
  rightComponent?: React.ReactNode;
  withArrow?: boolean;
  iconColor?: string;
  iconBgColor?: string;
  onPress?: () => void;
  className?: string;
  withBorder?: boolean;
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
    withBorder = true,
  } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        onPress?.();
      }}
    >
      <View
        style={[style]}
        className={cn("flex-row items-center gap-3", className)}
      >
        <View
          className={cn(
            "w-9 h-9 rounded-full items-center justify-center bg-gray-600"
          )}
        >
          <Icon as={icon} className={cn("text-white")} />
        </View>
        <View
          className={cn(
            "flex-1 flex-row gap-3 items-center pb-1",
            withBorder && "border-b border-b-outline-100"
          )}
        >
          <View className={"flex-1"}>
            <Text className="text-lg font-medium">{title}</Text>
            {description && (
              <Text className="text-sm text-typography/50">{description}</Text>
            )}
          </View>
          {withArrow && <Icon as={ChevronRight} className="text-primary" />}
        </View>
      </View>
    </TouchableOpacity>
  );
}
