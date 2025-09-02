import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

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
import { showSnackbar } from "@/lib/utils";
import { saveAuthToken } from "@/lib/secureStore";
import { useStore } from "@/store";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import eventBus from "@/lib/eventBus";
import GoogleIcon from "@/components/icons/GoogleIcon";
import BottomSheet from "../../shared/BottomSheet";
import { Divider } from "@/components/ui/divider";
import { CustomInput } from "@/components/custom/CustomInput";
import { getMe } from "@/actions/user";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function SignInBottomSheet({
  visible,
  onDismiss,
  onLoginSuccess,
  isAgentRequest = false,
}: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      androidClientId:
        "198305892260-c8eiep3tnnp29enadh4bvqb7vm0804cs.apps.googleusercontent.com",
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
        showSnackbar({
          message: state.formError,
          type: "error",
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
        onDismiss?.();
      }
    } catch (error) {
      console.error(error);
      showSnackbar({
        message: "Something went wrong. Try again",
        type: "error",
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
        console.log(socialData);
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
        onDismiss?.();
      } catch (error) {
        console.error(error);
        showSnackbar({
          message: "Error occurred during. Please try again.",
          type: "error",
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
  }, [googleResponse]);

  const getGoogleUserInfo = async (token?: string) => {
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

  return (
    <BottomSheet
      visible={visible}
      withHeader
      rounded={false}
      onDismiss={onDismiss}
      title="Sign In"
      snapPoint={["65%"]}
    >
      <Box className=" gap-6 flex-1 p-6 pt-3">
        <CustomInput
          className="bg-background-muted"
          isBottomSheet={true}
          value={form.email}
          onUpdate={(text) => setForm({ ...form, email: text })}
          placeholder="Email address"
        />
        <CustomInput
          className="bg-background-muted"
          value={form.password}
          isBottomSheet={true}
          onUpdate={(text) => setForm({ ...form, password: text })}
          placeholder="Password"
        />
        <View className=" items-end">
          <Pressable
            onPress={() => {
              onDismiss?.();
              eventBus.dispatchEvent("openResetPasswordModal", {
                visible: true,
              });
            }}
          >
            <Text className="text-sm text-primary">Forgotten Password?</Text>
          </Pressable>
        </View>
        <Button className="w-full mt-2 gap-2" size="xl" onPress={handleSubmit}>
          {loading && <SpinningLoader />}
          <ButtonText>Continue</ButtonText>
        </Button>

        <View className="flex-row mt-2 gap-3 items-center">
          <Divider className="flex-1" />
          <Text size="xs">OR</Text>
          <Divider className="flex-1" />
        </View>

        <View className="gap-4">
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

          {/* <Button
            className="flex-1 h-14 bg-background-muted mt-4 gap-2"
            onPress={() => fbPromptAsync()}
          >
            <Icon as={FacebookIcon} />
            <ButtonText>Continue with Facebook</ButtonText>
          </Button> */}

          <View className=" flex-row justify-center gap-2 mt-4">
            <Text>Don’t have an account?</Text>
            <Pressable
              onPress={() => {
                onDismiss?.();
                eventBus.dispatchEvent("openSignUpModal", {
                  visible: true,
                  isAgentRequest: isAgentRequest,
                });
              }}
            >
              <Text className=" text-primary font-medium">Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </Box>
    </BottomSheet>
  );
}
