import OnboardingScreenContainer from "@/components/onboarding/OnboardingScreenContainer";
import { Button, ButtonText, Text, View, Box } from "@/components/ui";
import React, { useEffect, useRef, useState } from "react";
import { useAuthMutations } from "@/tanstack/mutations/useAuthMutations";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import OTPInput from "@/components/custom/OTPInput";
import { CustomInput } from "@/components/custom/CustomInput";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { useTempStore } from "@/store";
import { router } from "expo-router";

export default function NewPassword() {
  const { email, resetEmail } = useTempStore();
  const { mutateAsync: resendCode, isPending: isSending } =
    useAuthMutations().resendVerificationMutation;
  const { mutateAsync: passwordReset, isPending: resetting } =
    useAuthMutations().resetPasswordMutation;
  const [form, setForm] = React.useState({
    email: "",
    password2: "",
    password: "",
  });
  const [codeSheetVisible, setCodeSheetVisible] = useState(true);
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(300);
  const intervalRef = useRef<number | null>(null);

  const handleResend = async () => {
    try {
      await resendCode(
        { email: form.email },
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
  const handleReset = async () => {
    if (form.password.length <= 7) {
      return showErrorAlert({
        title: "Password must be least 8 characters",
        alertType: "warn",
      });
    } else if (form.password2 !== form.password) {
      return showErrorAlert({
        title: "Passwords do not match",
        alertType: "warn",
      });
    }
    if (!form.email) {
      return showErrorAlert({
        title: "Invalid email",
        alertType: "warn",
      });
    }
    await passwordReset(
      {
        email: form.email,
        code: code,
        confirm_password: form.password2,
        new_password: form.password,
      },
      {
        onSuccess: () => {
          showErrorAlert({
            title: "Password changed successfully.",
            alertType: "success",
          });
          resetEmail();
          router.dismissTo("/signin");
        },
        onError: (e) => {
          showErrorAlert({
            title: "Please try again!",
            alertType: "warn",
          });
        },
      }
    );
  };

  useEffect(() => {
    if (!codeSheetVisible) return;
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1 && intervalRef.current) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [codeSheetVisible]);
  useEffect(() => {
    if (email) {
      setForm({ ...form, email });
    }
  }, [email]);
  return (
    <OnboardingScreenContainer allowBack={false}>
      <Box className="w-[98%] bg-background/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
        <View>
          <Text className=" text-2xl text-primary font-semibold font-heading text-center">
            Set a new password
          </Text>
          <Text className=" text-center">
            Create a new password. Ensure it differs from previous ones for
            security
          </Text>
        </View>
        <View>
          <OTPInput onTextChange={setCode} />
        </View>
        <View>
          <CustomInput
            title="New password"
            type="password"
            secureTextEntry
            placeholder="********"
            value={form.password}
            onUpdate={(text) => setForm({ ...form, password: text })}
          />
        </View>
        <View>
          <CustomInput
            title="Confirm password"
            type="password"
            secureTextEntry
            placeholder="********"
            value={form.password2}
            onUpdate={(text) => setForm({ ...form, password2: text })}
          />
        </View>
        <Button
          variant="solid"
          className="mt-4"
          size="xl"
          onPress={handleReset}
        >
          {resetting && <SpinningLoader />}
          <ButtonText>Reset Password</ButtonText>
        </Button>
        <Text className="text-center mt-4">
          {timer > 0
            ? `Resend code in ${Math.floor(timer / 60)}:${("0" + (timer % 60)).slice(-2)}`
            : "You can request a new code now."}
        </Text>
        {timer <= 0 && (
          <Button
            variant="outline"
            className="mt-2"
            size="lg"
            onPress={handleResend}
          >
            {isSending ? (
              <SpinningLoader />
            ) : (
              <ButtonText>Resend Code</ButtonText>
            )}
          </Button>
        )}
      </Box>
    </OnboardingScreenContainer>
  );
}
