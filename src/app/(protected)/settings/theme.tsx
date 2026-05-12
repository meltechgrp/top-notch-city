import { useTheme } from "@/components/layouts/ThemeProvider";
import { Box, Icon, Text, View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const OPTIONS = [
  { value: "light", label: "Light Mode", description: undefined },
  { value: "dark", label: "Dark Mode", description: undefined },
  {
    value: "system",
    label: "System Default",
    description: "This will make use of your device settings",
  },
] as const;

export default function ThemeScreen() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Box className="flex-1">
      <View className="gap-8 p-4">
        {OPTIONS.map((option) => {
          const active = theme === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => toggleTheme(option.value)}
              className={cn(
                "p-6 py-4 rounded-xl bg-background-muted border border-background-muted",
                active && "border-primary",
              )}
            >
              <View className="flex-row justify-between items-center min-h-12">
                <View>
                  <Text className="font-regular text-lg">{option.label}</Text>
                  {!!option.description && (
                    <Text size="sm" className="font-light">
                      {option.description}
                    </Text>
                  )}
                </View>
                <Icon
                  size="xl"
                  as={active ? CheckCircle2 : Circle}
                  className={active ? "text-primary" : "text-typography/60"}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Box>
  );
}
