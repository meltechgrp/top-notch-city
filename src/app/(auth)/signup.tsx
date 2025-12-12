import OnboardingScreenContainer from "@/components/onboarding/OnboardingScreenContainer";
import { router } from "expo-router";
import {
  Button,
  ButtonText,
  View,
  Box,
  Icon,
  Text,
  Pressable,
} from "@/components/ui";
import React, { useState } from "react";
import { Loader } from "lucide-react-native";
import { useTempStore } from "@/store";
import { AuthSignupInput } from "@/lib/schema";
import { authSignup } from "@/actions/auth";
import { CustomInput } from "@/components/custom/CustomInput";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useMultiAccount } from "@/hooks/useAccounts";
import { getCurrent } from "@/actions/user";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const { addAccount } = useMultiAccount();
  const [form, setForm] = React.useState<AuthSignupInput>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const handleSave = async (token?: string, message?: string) => {
    try {
      if (!token) {
        showErrorAlert({
          title: message || "Something went wrong. Try again",
          alertType: "warn",
        });
        return;
      }
      const me = await getCurrent(token);

      if (!me) {
        showErrorAlert({
          title: "Unable to fetch account details",
          alertType: "error",
        });
        return;
      }
      return addAccount({
        token: token,
        id: me.id,
        first_name: me.first_name,
        last_name: me.last_name,
        profile_image: me?.profile_image,
        role: me.role,
        email: me.email,
        verified: me.verified,
        is_superuser: me?.is_superuser,
        lastLogin: Date.now(),
      });
    } catch (error) {
      showErrorAlert({
        title: "Something went wrong. Try again",
        alertType: "error",
      });
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const state = await authSignup(form);
      if (state?.fieldError) {
        const message = Object.values(state.fieldError).filter(Boolean)[0];
        return showErrorAlert({
          title: message,
          alertType: "error",
        });
      } else if (state?.formError) {
        return showErrorAlert({
          title: state.formError,
          alertType: "error",
        });
      } else if (state?.data) {
        const { message, access_token } = state.data as {
          access_token: string;
          message: string;
          email: string;
        };
        await handleSave(access_token);
        showErrorAlert({
          title: message,
          alertType: "success",
        });

        useTempStore.setState((v) => ({
          ...v,
          email: form.email,
        }));

        router.replace("/verify-otp");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  function onBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/onboarding");
    }
  }
  return (
    <OnboardingScreenContainer onBack={onBack}>
      <Box className="w-[98%] bg-background/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
        <View>
          <Text className=" text-2xl text-primary font-semibold font-heading text-center">
            Create an Account
          </Text>
          <Text className=" text-center">
            Create an account to explore our app
          </Text>
        </View>
        <View className="gap-4">
          <CustomInput
            className="bg-background-muted"
            value={form.first_name}
            autoCapitalize="words"
            autoComplete="given-name"
            onUpdate={(text) => setForm({ ...form, first_name: text })}
            placeholder="First Name"
          />
          <CustomInput
            className="bg-background-muted"
            value={form.last_name}
            autoComplete="family-name"
            autoCapitalize="words"
            onUpdate={(text) => setForm({ ...form, last_name: text })}
            placeholder="Last Name"
          />
          <CustomInput
            className="bg-background-muted"
            value={form.email}
            autoCapitalize="words"
            autoComplete="email"
            onUpdate={(text) => setForm({ ...form, email: text })}
            placeholder="Email address"
          />
          <CustomInput
            className="bg-background-muted"
            type={"password"}
            value={form.password}
            secureTextEntry
            onUpdate={(text) => setForm({ ...form, password: text })}
            placeholder="Password"
          />
          <CustomInput
            type={"password"}
            className="bg-background-muted"
            value={form.confirmPassword}
            secureTextEntry
            onUpdate={(text) => setForm({ ...form, confirmPassword: text })}
            placeholder="Confirm password"
          />
        </View>
        <Button
          variant="solid"
          className="w-full mt-4 gap-2"
          size="xl"
          onPress={handleSubmit}
        >
          {loading && (
            <Icon as={Loader} color="white" className=" animate-spin" />
          )}
          <ButtonText>Sign Up</ButtonText>
        </Button>
        <View className=" flex-row justify-center gap-2 mt-4">
          <Text>Already have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/signin")}>
            <Text className=" text-primary font-medium">Sign In</Text>
          </Pressable>
        </View>
      </Box>
    </OnboardingScreenContainer>
  );
}
