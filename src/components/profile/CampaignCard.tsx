import React from "react";
import { View } from "react-native";
import { Box, Text, Pressable, Icon } from "@/components/ui";
import { ChevronRight, Megaphone } from "lucide-react-native";
import { router } from "expo-router";
import { cn } from "@/lib/utils";

type CampaignCardProps = {
  title: string;
  subtitle: string;
  icon?: any;
  actionLabel?: string;
  actionRoute: string;
  className?: string;
};

export default function CampaignCard({
  title,
  subtitle,
  icon = Megaphone,
  actionLabel = "Get started",
  actionRoute,
  className,
}: CampaignCardProps) {
  return (
    <Box
      className={cn(
        "bg-background-muted border border-outline-100 rounded-xl p-4 flex-row items-start justify-between shadow-md",
        className
      )}
    >
      <View className="bg-primary/10 p-3 rounded-full">
        <Icon as={icon} className="text-primary w-6 h-6" />
      </View>

      <View className="flex-1 px-4">
        <Text className="text-base font-semibold text-typography">{title}</Text>
        <Text className="text-sm text-typography/70 mt-1">{subtitle}</Text>
        <Pressable
          className="bg-primary flex-row gap-2 items-center self-end mt-3 px-4 py-2 rounded-xl"
          onPress={() => router.push(actionRoute as any)}
        >
          <Text className="text-white text-sm font-medium">{actionLabel}</Text>
          <Icon as={ChevronRight} />
        </Pressable>
      </View>
    </Box>
  );
}
