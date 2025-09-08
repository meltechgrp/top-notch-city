import OnboardingScreenContainer from "@/components/onboarding/OnboardingScreenContainer";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import {
  Button,
  ButtonText,
  Text,
  View,
  Box,
  Icon,
  Pressable,
} from "@/components/ui";

import React, { useCallback, useEffect, useState } from "react";
import { hapticFeed } from "@/components/HapticTab";
import { authLogin, loginWithSocial } from "@/actions/auth";
import { saveAuthToken } from "@/lib/secureStore";
import { useStore } from "@/store";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { Divider } from "@/components/ui/divider";
import { CustomInput } from "@/components/custom/CustomInput";
import { getMe } from "@/actions/user";
import { router, useGlobalSearchParams } from "expo-router";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import Platforms from "@/constants/Plaforms";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { isAgentRequest, path } = useGlobalSearchParams() as {
    isAgentRequest: string;
    path: string;
  };
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      androidClientId:
        "198305892260-dqv5gtvj30hjofofa2spt2nrub7m4teb.apps.googleusercontent.com",
      iosClientId:
        "198305892260-dqv5gtvj30hjofofa2spt2nrub7m4teb.apps.googleusercontent.com",
      webClientId:
        "198305892260-av6ll3dbobcc0tcaninrut8plid77o9u.apps.googleusercontent.com",
    });

  const handleSubmit = async () => {
    hapticFeed();
    setLoading(true);
    try {
      const state = await authLogin(form);
      if (state?.formError) {
        showErrorAlert({
          title: state.formError,
          alertType: "warn",
        });
      } else if (state?.data) {
        const { email, message, access_token } = state.data as {
          access_token: string;
          message: string;
          email: string;
        };
        if (access_token) {
          saveAuthToken(access_token);
          const me = await getMe();
          if (me) {
            useStore.setState((s) => ({
              ...s,
              me: me,
              hasAuth: true,
            }));
            if (isAgentRequest && me.role == "user") {
              router.push("/forms/agent");
            }
          }
        }
        return router.push(path ? path : ("/home" as any));
      }
    } catch (error) {
      showErrorAlert({
        title: "Something went wrong. Try again",
        alertType: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  //  Social handler (common logic)
  const handleSocialLogin = useCallback(
    async (socialData: {
      email: string;
      first_name?: string;
      last_name?: string;
    }) => {
      try {
        setFetching(true);
        const res = await loginWithSocial(socialData);
        if (res?.access_token) {
          saveAuthToken(res.access_token);
          const me = await getMe();
          if (me) {
            useStore.setState((s) => ({
              ...s,
              me: me,
              hasAuth: true,
            }));
            if (isAgentRequest && me.role == "user") {
              router.push("/forms/agent");
            }
          }
        }
        return router.push(path ? path : ("/home" as any));
      } catch (error) {
        showErrorAlert({
          title: "Error occurred during. Please try again.",
          alertType: "error",
        });
      } finally {
        setFetching(false);
      }
    },
    []
  );

  useEffect(() => {
    if (googleResponse?.type === "success") {
      getGoogleUserInfo(googleResponse.authentication?.accessToken);
    }
  }, [googleResponse, googleRequest]);

  const getGoogleUserInfo = async (token?: string) => {
    console.log("here", token);
    if (!token) return;
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await response.json();
    await handleSocialLogin({
      email: user?.email,
      first_name: user?.family_name,
      last_name: user?.given_name,
    });
  };
  function onBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  }
  return (
    <OnboardingScreenContainer
      withScroll={false}
      skip
      allowBack
      onBack={onBack}
    >
      <Box className="w-[98%] bg-background/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
        <View className=" gap-2">
          <Text className=" text-2xl text-primary font-semibold font-heading text-center">
            Welcome Back
          </Text>
          <Text className=" text-center px-6">
            Create an account or log in to explore our app
          </Text>
        </View>
        <CustomInput
          className="bg-background-muted"
          isBottomSheet={true}
          value={form.email}
          autoCapitalize="words"
          autoComplete="email"
          onUpdate={(text) => setForm({ ...form, email: text })}
          placeholder="Email address"
        />
        <CustomInput
          className="bg-background-muted"
          value={form.password}
          secureTextEntry
          isBottomSheet={true}
          onUpdate={(text) => setForm({ ...form, password: text })}
          placeholder="Password"
        />
        <View className=" items-end">
          <Pressable
            onPress={() => {
              router.push("/(auth)/reset-password");
            }}
          >
            <Text className="text-sm text-primary">Forgotten Password?</Text>
          </Pressable>
        </View>
        <Button className="w-full mt-2 gap-2" size="xl" onPress={handleSubmit}>
          {loading && <SpinningLoader />}
          <ButtonText>Continue</ButtonText>
        </Button>

        {Platforms.isIOS() && (
          <View className="flex-row mt-2 gap-3 items-center">
            <Divider className="flex-1" />
            <Text size="xs">OR</Text>
            <Divider className="flex-1" />
          </View>
        )}

        <View className="gap-4">
          {Platforms.isIOS() && (
            <Button
              className=" h-14 bg-background-muted mt-4 gap-2"
              onPress={() => {
                googlePromptAsync();
              }}
            >
              {fetching ? <SpinningLoader /> : <Icon as={GoogleIcon} />}
              <ButtonText className=" text-typography">
                Continue with Google
              </ButtonText>
            </Button>
          )}

          <View className=" flex-row justify-center gap-2 mt-4">
            <Text>Don’t have an account?</Text>
            <Pressable
              onPress={() => {
                return router.push({
                  pathname: "/(auth)/signup",
                  params: {
                    isAgentRequest,
                  },
                });
              }}
            >
              <Text className=" text-primary font-medium">Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </Box>
    </OnboardingScreenContainer>
  );
}
