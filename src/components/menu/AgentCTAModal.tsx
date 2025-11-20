"use client";

import { Button, ButtonText, Heading, Text, View } from "@/components/ui";
import { openAccessModal } from "@/components/globals/AuthModals";

interface AgentCTAModalProps {
  visible: boolean;
  type: "agent" | "admin" | "user";
  onClose: () => void;
}

export function AgentCTAModal({ visible, type, onClose }: AgentCTAModalProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
      <View className="bg-background-muted rounded-xl w-11/12 max-w-md p-6 gap-y-4">
        <Heading size="lg" className="text-center">
          {type === "user"
            ? "Interested in Becoming an Agent?"
            : type === "agent"
              ? "Ready to Start Listing Properties?"
              : "Access Restricted"}
        </Heading>

        <Text className="text-center text-sm">
          {type === "user"
            ? "To list properties, please sign in with an agent account or create one to get started."
            : type === "agent"
              ? "You're almost there! Complete your agent registration to begin listing properties."
              : "Administrators are not permitted to list properties. Please switch to an agent account to proceed."}
        </Text>

        <View className="flex-row justify-center gap-4 mt-6">
          <Button variant="outline" className="flex-1 h-12" onPress={onClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>

          {(type === "user" || type === "agent") && (
            <Button
              className="flex-1 h-12"
              onPress={() => openAccessModal({ visible: true })}
            >
              <ButtonText>
                {type === "user" ? "Sign In" : "Become Agent"}
              </ButtonText>
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}
