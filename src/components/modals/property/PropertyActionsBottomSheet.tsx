import * as React from "react";
import { View } from "react-native";
import BottomSheetPlain from "@/components/shared/BottomSheetPlain";
import { Icon, Pressable, Text } from "@/components/ui";
import { ChevronRight } from "lucide-react-native";
import { cn } from "@/lib/utils";

export type Props = {
  onDismiss: () => void;
  withBackground?: boolean;
  isOpen: boolean;
  options: ConfirmationActionConfig[];
  onSelect: (option: ConfirmationActionConfig) => void;
};

export default function PropertyActionsBottomSheet({
  isOpen,
  onDismiss,
  options,
  onSelect,
  withBackground = true,
}: Props) {
  return (
    <BottomSheetPlain
      withBackground={withBackground}
      visible={isOpen}
      onDismiss={onDismiss}
    >
      <View className="p-4 py-2 bg-background-muted rounded-xl">
        {options.map((option, index) => (
          <Pressable
            key={option.actionText}
            onPress={() => onSelect(option)}
            className={cn(
              "px-4 h-14 flex-row justify-between rounded-xl items-center",
              index > 0 && "border-outline border-t"
            )}
          >
            <Text className={cn("text-lg flex-1", option.className)}>
              {option.actionText}
            </Text>
            <Icon as={ChevronRight} className={option.iconClassName} />
          </Pressable>
        ))}
      </View>
    </BottomSheetPlain>
  );
}
