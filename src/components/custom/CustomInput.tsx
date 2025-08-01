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

export function CustomInput({
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
            style={
              multiline
                ? {
                    height: height || 120,
                  }
                : {}
            }
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
              style={[
                multiline
                  ? {
                      height: height || 120,
                      textAlignVertical: "top",
                    }
                  : {},
                { color: Colors[theme].text },
              ]}
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
            style={[
              multiline
                ? {
                    height: height || 120,
                    textAlignVertical: "top", // 👈 This is the key
                    padding: 10,
                  }
                : {},
              { color: Colors[theme].text },
            ]}
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
