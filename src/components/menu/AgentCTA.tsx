"use client";

import { Button, ButtonText, Heading, Icon, Text, View } from "@/components/ui";
import { MoveRight, Upload } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { AgentCTAModal } from "@/components/menu/AgentCTAModal";
import { cn } from "@/lib/utils";

export function AgentCTA() {
  const { me, hasAuth, isAdmin, isAgent } = useUser();
  const router = useRouter();
  const [ctaVisible, setCtaVisible] = useState(false);
  const [ctaType, setCtaType] = useState<"agent" | "admin" | "user">("user");

  function handleGetStarted() {
    if (!hasAuth) {
      setCtaType("user");
      return setCtaVisible(true);
    }

    if (isAgent) return router.push("/property/add");

    if (isAdmin) {
      setCtaType("admin");
      return setCtaVisible(true);
    }

    setCtaType("agent");
    setCtaVisible(true);
  }
  return (
    <>
      <View
        className={cn(
          "bg-background-muted rounded-xl p-6 px-4 mx-2 mt-2",
          isAdmin && "hidden"
        )}
      >
        <Heading size="xl" className="text-center">
          Ready to List Your Property?
        </Heading>

        <Text size="sm" className="font-light text-center mb-4 mt-2">
          Easily list your property, add details, photos, and reach thousands of
          potential buyers or renters.
        </Text>

        <View className="flex-row justify-center gap-4">
          {!isAgent && (
            <Button
              onPress={handleGetStarted}
              size="xl"
              className="mt-6 self-center rounded-md"
            >
              <ButtonText className="text-md">Get Started</ButtonText>
              <Icon size="xl" as={MoveRight} className="text-white" />
            </Button>
          )}

          {isAgent && (
            <Button
              onPress={() => router.push("/agent")}
              size="xl"
              className="mt-6 self-center bg-gray-500 rounded-md"
            >
              <ButtonText className="text-md">Upload property</ButtonText>
              <Icon size="xl" as={Upload} className="text-white" />
            </Button>
          )}
        </View>
      </View>
      <AgentCTAModal
        visible={ctaVisible}
        type={ctaType}
        onClose={() => setCtaVisible(false)}
      />
    </>
  );
}
