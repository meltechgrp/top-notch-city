import { cn } from "@/lib/utils";
import * as React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Icon as Ic, Text } from "../ui";
import { ChevronDown } from "lucide-react-native";

type Props = View["props"] & {
  Icon?: any;
  value?: any;
  label: string;
  withDropIcon?: boolean;
  onChange?: (value: any) => void;
  BottomSheet: any;
  valueParser?: (value: any) => string;
  className?: string;
  RightComponent?: any;
  placeHolder?: string;
  loading?: boolean;
  options?: OptionType[];
  readonly?: boolean;
  disabled?: boolean;
  bottomSheetProps?: any;
  title?: string;
};

function CustomSelect(props: Props) {
  const {
    Icon,
    value,
    withDropIcon,
    onChange,
    children,
    style,
    label,
    BottomSheet,
    valueParser,
    disabled,
    RightComponent,
    placeHolder,
    loading,
    options,
    readonly,
    bottomSheetProps = {},
    className,
    title,
  } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const displayText = valueParser ? valueParser(value) : value;

  return (
    <View style={style} className={cn("min-h-12", className)}>
      <Pressable
        onPress={() => {
          if (readonly || disabled) return;
          setIsOpen(true);
        }}
        className={cn(
          "px-4 py-2 h-[48px]  border border-outline bg-background-muted rounded-xl relative  flex-row",
          {
            " border-transparent": !!disabled,
          }
        )}
      >
        {loading && (
          <View className="absolute inset-0 flex-row pl-4 items-center bg-black/5 rounded-xl">
            <ActivityIndicator size="small" color="gray" />
          </View>
        )}
        {!!Icon && (
          <View className="pr-3 justify-center">
            <Icon color={!!displayText ? "#000" : "#ccc"} />
          </View>
        )}
        {RightComponent}
        <View className={cn("flex-1 justify-center")}>
          {!!displayText ? (
            <Text
              numberOfLines={1}
              className="text-sm capitalize leading-tight"
            >
              {displayText}
            </Text>
          ) : (
            <Text
              numberOfLines={1}
              className="text-sm capitalize leading-tight"
            >
              {placeHolder || ""}
            </Text>
          )}
        </View>
        {withDropIcon && !disabled && !readonly && (
          <View className="pl-4 justify-center">
            <Ic as={ChevronDown} className="text-primary" />
          </View>
        )}
      </Pressable>
      {children}
      {!!BottomSheet && (
        <BottomSheet
          options={options}
          isOpen={isOpen}
          onDismiss={() => setIsOpen(false)}
          value={value}
          onChange={onChange}
          label={label}
          title={title}
          {...bottomSheetProps}
        />
      )}
    </View>
  );
}

export default React.memo(CustomSelect);
