import OnboardingScreenContainer from "@/components/onboarding/OnboardingScreenContainer";
import { router } from "expo-router";
import { Box, Button, ButtonText, Text, View } from "@/components/ui";
import React from "react";
import { useTempStore } from "@/store";

export default function VerifySuccess() {
  const { resetEmail } = useTempStore();
  function handleSubmit() {
    resetEmail();
    router.push("/home");
  }

  return (
    <OnboardingScreenContainer allowBack={false}>
      <Box className="w-[98%] bg-background-muted/90 max-w-[26rem] mt-4 mx-auto rounded-xl p-6">
        <View className="px-2 justify-between items-center"></View>
        <View className=" mb-6">
          <Text className=" text-center">
            Congratulations! Your account has been created Proceed to complete
            your profile
          </Text>
        </View>

        <Button
          variant="solid"
          className="w-full mt-4"
          size="xl"
          onPress={handleSubmit}
        >
          <ButtonText>Continue</ButtonText>
        </Button>
      </Box>
    </OnboardingScreenContainer>
  );
}
