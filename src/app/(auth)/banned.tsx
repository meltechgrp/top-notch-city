import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, Icon } from "@/components/ui";
import { Ban, Mail } from "lucide-react-native";

export default function BannedUserScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <View className="items-center">
        {/* Icon */}
        <View className="w-20 h-20 rounded-full bg-destructive/10 items-center justify-center mb-6">
          <Icon as={Ban} size="xl" className="text-destructive" />
        </View>

        {/* Title */}
        <Text className="text-xl font-semibold text-center mb-2">
          Account Restricted
        </Text>

        {/* Description */}
        <Text className="text-center text-muted-foreground leading-6 mb-4">
          Your TopNotch City account has been temporarily restricted from
          accessing the platform.
        </Text>

        {/* Actions */}
        <View className="w-full gap-3">
          <Pressable
            // onPress={onContactSupport}
            className="h-12 rounded-xl bg-primary items-center justify-center flex-row gap-2"
          >
            <Icon as={Mail} size="lg" className="text-white" />
            <Text className="text-white font-medium">Contact Support</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
