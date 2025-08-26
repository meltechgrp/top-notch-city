import {
  Input,
  InputField,
  View,
  Text,
  useResolvedTheme,
} from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { memo, useMemo } from "react";
import { KeyboardTypeOptions, ReturnKeyTypeOptions } from "react-native";

interface Props {
  isInvalid?: boolean;
  isRequired?: boolean;
  multiline?: boolean;
  isBottomSheet?: boolean;
  title?: string;
  value?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions | undefined;
  onUpdate: (val: string) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  errorMesssage?: string;
  className?: string;
  inputClassName?: string;
  returnKeyLabel?: string;
  numberOfLines?: number;
  height?: number;
  type?: any;
}
function CustomInputComponent({
  isInvalid = false,
  errorMesssage,
  isRequired = false,
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
        className
      )}
    >
      {title && (
        <View>
          <Text>{title}</Text>
        </View>
      )}
      <View className="">
        {!isBottomSheet ? (
          <Input
            size="md"
            className={cn(
              "my-1 bg-background-muted h-14 rounded-xl",
              multiline && "px-1 pt-6",
              inputClassName
            )}
            style={multilineStyle}
          >
            <InputField
              type={type}
              placeholder={placeholder}
              value={value}
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={numberOfLines}
              returnKeyLabel={returnKeyLabel}
              onChangeText={onUpdate}
              returnKeyType={returnKeyType}
              style={[multilineStyle, textColor]}
            />
          </Input>
        ) : (
          <BottomSheetTextInput
            className={cn(
              " border border-outline text-typography px-4 h-14 rounded-xl",
              inputClassName
            )}
            textContentType={type}
            value={value}
            returnKeyType={returnKeyType}
            onChangeText={onUpdate}
            multiline={multiline}
            style={[multilineStyle, textColor]}
            keyboardType={keyboardType}
            returnKeyLabel={returnKeyLabel}
            numberOfLines={numberOfLines}
            placeholder={placeholder}
          />
        )}
      </View>
    </View>
  );
}

export const CustomInput = memo(CustomInputComponent);
