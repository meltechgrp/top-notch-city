import OnboardingScreenContainer from "@/components/onboarding/OnboardingScreenContainer";
import { router } from "expo-router";
import {
  Button,
  ButtonText,
  Text,
  View,
  Pressable,
  Box,
  Icon,
} from "@/components/ui";
import React, { useState } from "react";
import OTPInput from "@/components/custom/OTPInput";
import { authOptVerify } from "@/actions/auth";
import { tempStore } from "@/store/tempStore";
import { Loader } from "lucide-react-native";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useAuthMutations } from "@/tanstack/mutations/useAuthMutations";
import { useValue } from "@legendapp/state/react";

export default function VerifyOtp() {
  const [otp, setOtp] = React.useState("");
  const email = useValue(tempStore.email);
  const [timer, setTimer] = useState(300);
  const [loading, setLoading] = React.useState(false);
  const { mutateAsync: resendCode, isPending: isSending } =
    useAuthMutations().resendVerificationMutation;

  const isValid = React.useMemo(() => /\d{6,6}$/.test(otp), [otp]);
  const handleSubmit = async () => {
    if (!isValid)
      return showErrorAlert({
        title: "Invalid Code",
        alertType: "warn",
      });
    if (!email)
      return showErrorAlert({
        title: "Invalid Email",
        alertType: "warn",
      });
    setLoading(true);
    try {
      const state = await authOptVerify({
        otp,
        email: email,
      });
      if (state?.formError) {
        showErrorAlert({
          title: state.formError,
          alertType: "warn",
        });
      } else if (state?.data) {
        tempStore.resetEmail();
        router.dismissTo("/home");
      }
    } catch (error) {
      showErrorAlert({
        title: "Something went wront!. Try again.",
        alertType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendCode(
        { email: email! },
        {
          onSuccess: () => {
            showErrorAlert({
              title: "Password reset code sent to your email.",
              alertType: "success",
            });
            setTimer(300);
          },
          onError: () => {
            showErrorAlert({
              title: "Please try again!",
              alertType: "warn",
            });
          },
        }
      );
    } catch (error) {
      showErrorAlert({ title: "Failed to resend code.", alertType: "warn" });
    }
  };
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimer((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  return (
    <OnboardingScreenContainer allowBack={false}>
      <Box className="w-[98%] bg-background-muted/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
        <View className="gap-2 mb-4">
          <Text className=" text-3xl text-primary font-semibold font-heading text-center">
            Verify your Email
          </Text>
          <Text className=" text-sm text-center">
            Enter the One-Time Password sent to your email to ensure a safe and
            secure login experience.
          </Text>
        </View>
        <View>
          <OTPInput onTextChange={setOtp} />
        </View>
        {timer > 0 && (
          <View className="flex-row items-center mt-4">
            <Text className="text-typography text-lg">Resend code in </Text>

            <Text className="text-primary text-lg">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          </View>
        )}
        {timer <= 0 && (
          <View className=" flex-row gap-2 mt-4">
            <Text>Haven’t got the email yet?</Text>
            <Pressable onPress={handleResend}>
              <Text className=" text-primary font-medium">Resend code</Text>
            </Pressable>
          </View>
        )}
        <Button
          variant="solid"
          className="w-full mt-4"
          size="xl"
          disabled={loading || !isValid}
          onPress={handleSubmit}
        >
          {loading && (
            <Icon as={Loader} color="white" className=" animate-spin" />
          )}
          <ButtonText>Verify</ButtonText>
        </Button>
      </Box>
    </OnboardingScreenContainer>
  );
}
