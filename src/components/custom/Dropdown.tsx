import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Icon, Pressable } from "@/components/ui";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  value?: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View className={className}>
      <TouchableOpacity
        onPress={() => setOpen((prev) => !prev)}
        className="flex-row items-center justify-between bg-background-muted p-2 rounded-lg border border-outline-100"
      >
        <Text className="text-sm font-medium">
          {selected?.label || placeholder}
        </Text>
        <Icon as={open ? ChevronUp : ChevronDown} className="w-4 h-4" />
      </TouchableOpacity>

      {open && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(200)}
          layout={Layout.springify()}
          className="absolute top-11 left-0 right-0 bg-background-muted rounded-lg border border-outline-100 shadow-lg z-50"
        >
          {options.map((opt, idx) => (
            <Pressable
              key={opt.value}
              onPress={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-3 py-3 ${
                idx !== options.length - 1 ? "border-b border-outline-100" : ""
              }`}
            >
              <Text
                className={`text-sm ${
                  opt.value === value ? "text-primary font-semibold" : ""
                }`}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}
