import { cn, formatMoney } from "@/lib/utils";
import * as React from "react";
import { View } from "react-native";
import { Text, Pressable } from "../ui";
import BottomSheetPlain from "./BottomSheetPlain";
import { FlashList } from "@shopify/flash-list";

type OptionType = {
  label: string;
  value: string;
  mode?: "default" | "destructive";
};

export type Props = {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  onDismiss: () => void;
  multiple?: boolean;
  withBackground?: boolean;
  format?: boolean;
  isOpen: boolean;
  options: OptionType[];
};

export default function MultiSelectOptionBottomSheet(props: Props) {
  const {
    isOpen,
    onDismiss,
    onChange,
    value,
    options,
    withBackground = true,
    multiple = false,
    format,
  } = props;

  const isSelected = (v: string) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(v);
    }
    return value === v;
  };

  const toggleSelection = (option: OptionType) => {
    if (!multiple) {
      onChange(option.value);
      onDismiss();
      return;
    }

    const current = Array.isArray(value) ? [...value] : [];

    if (current.includes(option.value)) {
      const updated = current.filter((v) => v !== option.value);
      onChange(updated);
    } else {
      onChange([...current, option.value]);
    }
  };

  return (
    <BottomSheetPlain
      visible={isOpen}
      doneLabel={multiple ? "Close" : undefined}
      onDismiss={onDismiss}
      withBackground={withBackground}
    >
      <View
        style={{ height: options.length < 8 ? options.length * 53 : 450 }}
        className={
          withBackground
            ? "bg-background-muted py-2 rounded-2xl overflow-hidden"
            : ""
        }
      >
        <FlashList
          data={options}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.label}
          renderItem={({ item: option, index }) => (
            <Pressable
              onPress={() => toggleSelection(option)}
              className={cn(
                "px-4 h-14 flex-row items-center gap-3",
                !!index && withBackground && "border-outline border-t"
              )}
            >
              <View
                className={cn(
                  "w-5 h-5 rounded-full border items-center justify-center",
                  isSelected(option.value)
                    ? "border-primary bg-primary"
                    : "border-outline"
                )}
              >
                {isSelected(option.value) && (
                  <View className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </View>

              <Text
                className={cn(
                  "text-base flex-1 capitalize",
                  option.mode === "destructive"
                    ? "text-red-900"
                    : isSelected(option.value) && "text-primary"
                )}
              >
                {format && parseInt(option.label)
                  ? formatMoney(Number(option.label), "NGN", 0)
                  : option.label}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </BottomSheetPlain>
  );
}
