import React from "react";
import { View } from "react-native";
import { Box, Text, Pressable, Icon } from "@/components/ui";
import { Megaphone } from "lucide-react-native";
import { router } from "expo-router";

type CampaignCardProps = {
  title: string;
  subtitle: string;
  icon?: any;
  actionLabel?: string;
  actionRoute: string;
};

export default function CampaignCard({
  title,
  subtitle,
  icon = Megaphone,
  actionLabel = "Get started",
  actionRoute,
}: CampaignCardProps) {
  return (
    <Box className="bg-background-muted rounded-xl p-4 flex-row items-center justify-between shadow-md">
      <View className="bg-primary/10 p-3 rounded-full">
        <Icon as={icon} className="text-primary w-6 h-6" />
      </View>

      <View className="flex-1 px-4">
        <Text className="text-base font-semibold text-typography">{title}</Text>
        <Text className="text-sm text-typography/70 mt-1">{subtitle}</Text>
      </View>

      <Pressable
        className="bg-primary px-4 py-2 rounded-full"
        onPress={() => router.push(actionRoute as any)}
      >
        <Text className="text-white text-sm font-medium">{actionLabel}</Text>
      </Pressable>
    </Box>
  );
}
