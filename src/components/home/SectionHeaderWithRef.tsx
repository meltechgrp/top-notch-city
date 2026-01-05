import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Heading, Text } from "../ui";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  onSeeAllPress?: () => void;
  children: React.ReactNode;
  subTitle?: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
  titleClassName?: string;
  hasData?: boolean;
};
export default function SectionHeaderWithRef(props: Props) {
  const {
    title,
    onSeeAllPress,
    children,
    style,
    titleClassName,
    subTitle,
    className,
    hasData = false,
  } = props;
  return (
    <View
      style={[style]}
      className={cn("my-1 bg-transparent hidden", hasData && "flex", className)}
    >
      <View className="flex-row justify-between py-2 mb-1 px-4 items-center">
        <Heading
          className={cn("text-lg font-bold text-typography/80", titleClassName)}
        >
          {title}
        </Heading>
        {onSeeAllPress && (
          <Pressable
            style={[
              {
                width: 64,
                height: 34,
              },
            ]}
            className="flex-row items-center  justify-center rounded-md"
            onPress={onSeeAllPress}
          >
            <Text className="text-sm font-heading text-primary">
              {subTitle ?? "See all"}
            </Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}
