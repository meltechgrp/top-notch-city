import OnboardingScreenContainer from "@/components/onboarding/OnboardingScreenContainer";
import { router } from "expo-router";
import { Button, ButtonText, Text, View, Box } from "@/components/ui";
import React from "react";
import { CustomInput } from "@/components/custom/CustomInput";
import { removeAuthToken } from "@/lib/secureStore";
import { useStore, useTempStore } from "@/store";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useAuthMutations } from "@/tanstack/mutations/useAuthMutations";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

export default function ResetPassword() {
  const { mutateAsync, isPending } =
    useAuthMutations().sendPasswordResetMutation;
  const { saveEmail } = useTempStore();
  const [form, setForm] = React.useState({
    email: "",
  });
  const handleSubmit = async () => {
    if (form.email.length < 5) {
      showErrorAlert({
        title: "Enter a valid email",
        alertType: "warn",
      });
      return;
    }
    try {
      await mutateAsync(
        { email: form.email },
        {
          onSuccess: (d) => {
            if (d?.formError) {
              return showErrorAlert({
                title: "Email not found",
                alertType: "warn",
              });
            }
            showErrorAlert({
              title: "Password reset code sent to your email.",
              alertType: "success",
            });
            saveEmail(form.email);
            router.replace("/(auth)/new-password");
          },
          onError: (e) => {
            console.log(e);
            showErrorAlert({
              title: "Please try again!",
              alertType: "error",
            });
          },
        }
      );
    } catch (error) {
      showErrorAlert({
        title: "Error occurred! Please try again.",
        alertType: "error",
      });
    }
  };
  function onBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      removeAuthToken();
      useStore.getState().resetStore();
      useTempStore.getState().resetStore();
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
            onUpdate={(text) => setForm({ ...form, email: text })}
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
