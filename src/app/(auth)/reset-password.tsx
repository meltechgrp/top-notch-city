import OnboardingScreenContainer from "@/components/onboarding/OnboardingScreenContainer";
import { router } from "expo-router";
import { Button, ButtonText, Text, View, Box } from "@/components/ui";
import React from "react";
import { CustomInput } from "@/components/custom/CustomInput";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useAuthMutations } from "@/tanstack/mutations/useAuthMutations";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { tempStore } from "@/store/tempStore";
import { getApiErrorMessage } from "@/actions/utills";

export default function ResetPassword() {
  const { mutateAsync, isPending } =
    useAuthMutations().sendPasswordResetMutation;
  const [form, setForm] = React.useState({
    email: "",
  });

  const handleSubmit = async () => {
    const email = form.email.trim().toLowerCase();

    if (email.length < 5 || !email.includes("@")) {
      showErrorAlert({
        title: "Enter a valid email",
        alertType: "warn",
      });
      return;
    }

    try {
      const response = await mutateAsync({ email });

      if (response?.formError) {
        showErrorAlert({
          title: response.formError,
          alertType: "warn",
        });
        return;
      }

      showErrorAlert({
        title: "Password reset code sent to your email.",
        alertType: "success",
      });
      tempStore.getState().saveEmail(email);
      router.replace("/(auth)/new-password");
    } catch (error) {
      showErrorAlert({
        title: getApiErrorMessage(error, "Error occurred! Please try again."),
        alertType: "error",
      });
    }
  };
  function onBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/signin");
    }
  }
  return (
    <OnboardingScreenContainer onBack={onBack}>
      <Box className="w-[98%] bg-background/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6 pb-16">
        <View className=" gap-2">
          <Text className=" text-2xl text-primary font-semibold font-heading text-center">
            Forgot password
          </Text>
          <Text className=" text-center">
            Please enter your email to reset the password
          </Text>
        </View>

        <View>
          <CustomInput
            type="text"
            title="Email"
            placeholder="Email"
            inputClassName="bg-background-muted"
            value={form.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            onUpdate={(text) =>
              setForm((current) => ({ ...current, email: text }))
            }
          />
        </View>
        <Button
          variant="solid"
          className="w-full mt-8"
          size="xl"
          onPress={handleSubmit}
        >
          <ButtonText>Reset Password</ButtonText>
          {isPending && <SpinningLoader />}
        </Button>
      </Box>
    </OnboardingScreenContainer>
  );
}
