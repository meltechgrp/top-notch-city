import { View, Text, useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";
import { TextInput, TextInputProps } from "react-native";

interface Props extends Partial<TextInputProps> {
  multiline?: boolean;
  isBottomSheet?: boolean;
  title?: string;
  onUpdate: (val: string) => void;
  errorMesssage?: string;
  inputClassName?: string;
  returnKeyLabel?: string;
  height?: number;
  type?: any;
  containerClassName?: string;
}
function CustomInputComponent({
  value,
  onUpdate,
  title,
  placeholder,
  keyboardType,
  multiline,
  numberOfLines,
  isBottomSheet = true,
  returnKeyType,
  className,
  returnKeyLabel,
  height,
  type = "text",
  inputClassName,
  containerClassName,
  ...props
}: Props) {
  const theme = useResolvedTheme();
  const multilineStyle = useMemo(
    () =>
      multiline
        ? {
            height: height || 120,
            textAlignVertical: "top" as const,
            padding: isBottomSheet ? 10 : undefined,
          }
        : {},
    [multiline, height, isBottomSheet]
  );

  const textColor = useMemo(() => ({ color: Colors[theme].text }), [theme]);

  return (
    <View
      className={cn(
        "py-px min-h-20 gap-2 rounded-xl",
        !title && "min-h-14",
        containerClassName
      )}
    >
      {title && (
        <View>
          <Text>{title}</Text>
        </View>
      )}
      <View className="flex-1">
        <TextInput
          {...props}
          placeholder={placeholder}
          autoCapitalize="sentences"
          className={cn(
            " bg-background-muted flex-1 px-4 h-14 rounded-xl",
            multiline && "px-1 pt-6",
            className
          )}
          value={value}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          returnKeyLabel={returnKeyLabel}
          onChangeText={onUpdate}
          returnKeyType={returnKeyType}
          style={[multilineStyle, textColor]}
        />
      </View>
    </View>
  );
}

export const CustomInput = memo(CustomInputComponent);
