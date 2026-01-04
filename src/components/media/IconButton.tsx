import { ComponentProps } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { SFSymbol, SymbolView } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";
import { Pressable } from "@/components/ui";

const ICON_SIZE = 25;

interface IconButtonProps {
  iosName: SFSymbol;
  androidName: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  width?: number;
  height?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}
export default function IconButton({
  onPress,
  androidName,
  iosName,
  containerStyle,
  height,
  width,
  className,
  style,
}: IconButtonProps) {
  return (
    <Pressable onPress={onPress} className={className} style={[containerStyle]}>
      <SymbolView
        name={iosName}
        size={ICON_SIZE}
        // type="hierarchical"
        style={[
          width && height //this won't scale :(
            ? {
                width,
                height,
              }
            : {},
          style,
        ]}
        tintColor={"white"}
        fallback={
          <Ionicons
            size={ICON_SIZE}
            name={androidName}
            style={{}}
            color={"white"}
          />
        }
      />
    </Pressable>
  );
}
