import React from "react";
import { View, Text, Button } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/components/ui";
import { RefreshCcw } from "lucide-react-native";

interface EmptyStateProps {
  icon: any;
  title?: string;
  description?: string;
  buttonLabel?: string;
  onPress?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title = "No Data Found",
  description = "New items will appear here soon.",
  buttonLabel = "Reset filters",
  onPress,
  className,
}: EmptyStateProps) {
  return (
    <View className={` px-4 ${className}`}>
      <LinearGradient
        colors={["#2c2d30", "#1c1d1f"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          flex: 1,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          paddingVertical: 32,
        }}
      >
        <View className="items-center gap-3">
          <Icon as={icon} size={"xl"} />
          <Text className="text-lg font-semibold text-typography text-center">
            {title}
          </Text>
          <Text className="text-sm text-center px-4">{description}</Text>
        </View>

        {onPress && (
          <Button
            onPress={onPress}
            className="mt-6 px-4 py-2 border border-outline-100"
          >
            <Icon as={RefreshCcw} size={"sm"} />
            <Text className="text-sm font-medium">{buttonLabel}</Text>
          </Button>
        )}
      </LinearGradient>
    </View>
  );
}
