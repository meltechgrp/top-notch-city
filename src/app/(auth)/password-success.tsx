import OnboardingScreenContainer from "@/components/onboarding/OnboardingScreenContainer";
import { router } from "expo-router";
import { Box, Button, ButtonText, Text, View } from "@/components/ui";
import React from "react";

export default function VerifySuccess() {
  function handleSubmit() {
    router.dismissAll();
  }

  return (
    <OnboardingScreenContainer allowBack={false}>
      <Box className="w-[98%] bg-background-muted/90 max-w-[26rem] mt-4 mx-auto rounded-xl p-6">
        <View className="px-2 justify-between items-center"></View>
        <View className=" mb-6">
          <Text className=" text-center">
            Congratulations! Your password has been changed. Click continue to
            Sign In
          </Text>
        </View>

        <Button
          variant="solid"
          className="w-full mt-4"
          size="xl"
          onPress={handleSubmit}
        >
          <ButtonText>Sign In</ButtonText>
        </Button>
      </Box>
    </OnboardingScreenContainer>
  );
}
