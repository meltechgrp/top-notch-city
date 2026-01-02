import React from "react";
import { View, Text, Button } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/components/ui";
import { House, RefreshCcw } from "lucide-react-native";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { cn } from "@/lib/utils";
import { hapticFeed } from "@/components/HapticTab";

interface EmptyStateProps {
  icon?: any;
  iconClassName?: string;
  subIcon?: any;
  title?: string;
  description?: string;
  buttonLabel?: string;
  onPress?: () => void;
  className?: string;
  containerClassName?: string;
  loading?: boolean;
}

export function MiniEmptyState({
  icon,
  title = "No Data Found",
  description = "New items will appear here soon.",
  buttonLabel = "Reset filters",
  onPress,
  className,
  subIcon,
  loading,
  iconClassName,
  containerClassName,
}: EmptyStateProps) {
  return (
    <View className={`h-full max-h-[60%] px-4 ${containerClassName}`}>
      <View className="border bg-background-muted border-outline-100 rounded-2xl shadow-md">
        <LinearGradient
          colors={["#2c2d30", "#1c1d1f"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            flex: 1,
            borderRadius: 16,
          }}
        >
          <View
            className={cn(
              "flex-1 px-4 py-6 justify-center items-center gap-3",
              className
            )}
          >
            <Icon as={icon || House} className={cn("w-7 h-7", iconClassName)} />
            <Text className="text-lg font-semibold text-typography text-center">
              {title}
            </Text>
            <Text className="text-sm text-center px-4">{description}</Text>
            {onPress && (
              <Button
                onPress={() => {
                  hapticFeed(true);
                  onPress();
                }}
                className="mt-4 px-4 py-2 h-12 border border-outline-100"
              >
                {loading ? (
                  <SpinningLoader />
                ) : (
                  <Icon as={subIcon || RefreshCcw} size={"sm"} />
                )}
                <Text className="text-sm font-medium">{buttonLabel}</Text>
              </Button>
            )}
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
