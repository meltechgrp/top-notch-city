import { Icon, Pressable, Text, useResolvedTheme, View } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { memo, useMemo, useState } from "react";
import { TextInput, TextInputProps } from "react-native";

interface Props extends Partial<TextInputProps> {
  multiline?: boolean;
  isLogin?: boolean;
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
  numberOfLines = 10,
  isLogin = false,
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
  const [secure, setSecure] = useState(props.secureTextEntry || false);
  const multilineStyle = useMemo(
    () =>
      multiline
        ? {
            height: height || 120,
            textAlignVertical: "top" as const,
          }
        : {},
    [multiline, height]
  );

  const textColor = useMemo(() => ({ color: Colors[theme].text }), [theme]);

  return (
    <View
      className={cn(
        "py-px min-h-[5rem] gap-2 rounded-xl",
        !title && "min-h-[3.5rem]",
        containerClassName
      )}
    >
      {title && (
        <View className="px-2 flex-row items-center justify-between">
          <Text className=" text-typography text-sm">{title}</Text>
          {isLogin && (
            <Pressable
              onPress={() => {
                router.push("/(auth)/reset-password");
              }}
            >
              <Text className="text-sm text-primary">Forgotten Password?</Text>
            </Pressable>
          )}
        </View>
      )}
      <View
        className={cn(
          " bg-background-muted flex-1 flex-row justify-between items-center px-4 rounded-xl",
          multiline ? "" : "h-[3.5rem]",
          className
        )}
      >
        <TextInput
          {...props}
          placeholder={placeholder}
          autoCapitalize="sentences"
          className={cn(
            "text-typography placeholder:text-typography-muted focus:outline-none flex-1 h-full rounded-xl",
            multiline && "px-1 pt-2"
          )}
          value={value}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          returnKeyLabel={returnKeyLabel}
          onChangeText={onUpdate}
          returnKeyType={returnKeyType}
          style={[multilineStyle, textColor]}
        />
        {props.secureTextEntry && (
          <Pressable className="py-2 pl-2" onPress={() => setSecure((p) => !p)}>
            {secure ? (
              <Icon size={"sm"} as={EyeOff} />
            ) : (
              <Icon size={"sm"} as={Eye} />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

export const CustomInput = memo(CustomInputComponent);
