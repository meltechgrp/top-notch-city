import { useTheme } from "@/components/layouts/ThemeProvider";
import {
  Box,
  Text,
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
  View,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { CircleIcon } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function ThemeScreen() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Box className="flex-1">
      <RadioGroup value={theme} onChange={toggleTheme} className="p-4">
        <View className="gap-8">
          <TouchableOpacity
            className={cn(
              "p-6 py-4 rounded-xl bg-background-muted border border-background-muted",
              theme == "light" && " border-primary"
            )}
          >
            <Radio className=" justify-between items-center h-12" value="light">
              <RadioLabel className=" font-regular text-lg">
                Light Mode
              </RadioLabel>
              <RadioIndicator size="lg">
                <RadioIcon size="md" as={CircleIcon} />
              </RadioIndicator>
            </Radio>
          </TouchableOpacity>
          <TouchableOpacity
            className={cn(
              "p-6 py-4 rounded-xl bg-background-muted border border-background-muted",
              theme == "dark" && " border-primary"
            )}
          >
            <Radio className=" justify-between items-center h-12" value="dark">
              <RadioLabel className=" font-regular text-lg">
                Dark Mode
              </RadioLabel>
              <RadioIndicator size="lg">
                <RadioIcon size="md" as={CircleIcon} />
              </RadioIndicator>
            </Radio>
          </TouchableOpacity>
          <TouchableOpacity
            className={cn(
              "p-6 py-4 rounded-xl bg-background-muted border border-background-muted",
              theme == "system" && " border-primary"
            )}
          >
            <Radio
              className=" justify-between items-center h-12"
              value="system"
            >
              <View>
                <RadioLabel className=" font-regular text-lg">
                  System Default
                </RadioLabel>
                <Text size="sm" className=" font-light">
                  This will make use of your device settings
                </Text>
              </View>
              <RadioIndicator size="lg">
                <RadioIcon size="md" as={CircleIcon} />
              </RadioIndicator>
            </Radio>
          </TouchableOpacity>
        </View>
      </RadioGroup>
    </Box>
  );
}
