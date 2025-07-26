import { router } from "expo-router";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Button,
  ButtonText,
  Text,
  View,
  Box,
  InputIcon,
} from "@/components/ui";
import React, { useEffect, useRef, useState } from "react";
import { AlertCircleIcon, Mail } from "lucide-react-native";
import { removeAuthToken } from "@/lib/secureStore";
import { useStore, useTempStore } from "@/store";
import { showSnackbar } from "@/lib/utils";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { hapticFeed } from "@/components/HapticTab";
import { useAuthMutations } from "@/tanstack/mutations/useAuthMutations";
import BottomSheet from "@/components/shared/BottomSheet";
import { CustomInput } from "@/components/custom/CustomInput";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { KeyboardDismissPressable } from "@/components/shared/KeyboardDismissPressable";
import OTPInput from "@/components/custom/OTPInput";
import eventBus from "@/lib/eventBus";

export default function ResetPasswordBottomSheet({
  visible,
  onDismiss,
}: AuthModalProps) {
  const [showPass, setShowPass] = React.useState(false);
  const { mutateAsync, isPending } =
    useAuthMutations().sendPasswordResetMutation;
  const { mutateAsync: resendCode, isPending: isSending } =
    useAuthMutations().resendVerificationMutation;
  const { mutateAsync: passwordReset, isPending: resetting } =
    useAuthMutations().resetPasswordMutation;
  const [form, setForm] = React.useState({
    email: "",
    password2: "",
    password: "",
  });
  const [codeSheetVisible, setCodeSheetVisible] = useState(false);
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(300);
  const intervalRef = useRef<number | null>(null);

  const handleSubmit = async () => {
    hapticFeed();
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
          onSuccess: () => {
            showErrorAlert({
              title: "Password reset code sent to your email.",
              alertType: "success",
            });
            setCodeSheetVisible(true);
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
      console.log(error);
      showErrorAlert({
        title: "Error occurred! Please try again.",
        alertType: "error",
      });
    }
  };

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
      console.log(error);
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
    try {
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
            onDismiss?.();
            eventBus.dispatchEvent("openSignInModal", { visible: true });
          },
          onError: () => {
            showErrorAlert({
              title: "Please try again!",
              alertType: "warn",
            });
          },
        }
      );
    } catch (error) {}
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
    if (code?.length > 3) {
      setShowPass(true);
    }
  }, [code]);
  return (
    <>
      <BottomSheet
        visible={visible}
        onDismiss={onDismiss}
        snapPoint={["50%", "85"]}
        title={codeSheetVisible ? "Enter verification code" : "Forgot password"}
        withHeader
      >
        {!codeSheetVisible ? (
          <Box className="w-[98%] max-w-[26rem] gap-6 mx-auto rounded-xl p-6 pb-16">
            <View className=" gap-2">
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
              {isPending && <SpinningLoader />}
              <ButtonText>Reset Password</ButtonText>
            </Button>
          </Box>
        ) : (
          <KeyboardDismissPressable>
            <View className="gap-4 p-6">
              <Text className="text-center">
                We've sent a 6-digit code to your email.
              </Text>
              <View>
                <OTPInput onTextChange={setCode} />
              </View>
              {showPass && (
                <View>
                  <CustomInput
                    title="New password"
                    type="password"
                    placeholder="********"
                    value={form.password}
                    onUpdate={(text) => setForm({ ...form, password: text })}
                  />
                </View>
              )}
              {showPass && (
                <View>
                  <CustomInput
                    title="Confirm password"
                    type="password"
                    placeholder="********"
                    value={form.password2}
                    onUpdate={(text) => setForm({ ...form, password2: text })}
                  />
                </View>
              )}
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
            </View>
          </KeyboardDismissPressable>
        )}
      </BottomSheet>
    </>
  );
}
