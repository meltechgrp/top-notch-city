import OnboardingScreenContainer from "@/components/onboarding/OnboardingScreenContainer";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  Button,
  ButtonText,
  Text,
  View,
  Box,
  Pressable,
  Icon,
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
import config from "@/config";
import {
  AuthError,
  AuthRequestConfig,
  DiscoveryDocument,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const configs: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
};
const fConfigs: AuthRequestConfig = {
  clientId: "1964809884362173",
  scopes: ["email", "public_profile"],
  redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${config.origin}/api/auth-url/google`,
  tokenEndpoint: `${config.origin}/api/auth/google/callback`,
};
// const fDiscovery: DiscoveryDocument = {
//   authorizationEndpoint: `${config.origin}/api/auth-url/facebook`,
//   tokenEndpoint: `${config.origin}/api/auth/facebook/callback`,
// };
interface AuthRedirectResult {
  authentication: null;
  error: [Error] | null;
  errorCode: null | string;
  params: {
    email: string;
    name: string;
    token: string;
  };
  type: "error";
  url: string;
}
export default function SignIn() {
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const { isAgentRequest, path } = useGlobalSearchParams() as {
    isAgentRequest: string;
    path: string;
  };
  const [g, response, promptAsync] = useAuthRequest(configs, discovery);
  // const [f, fResponse, FPromptAsync] = useAuthRequest(fConfigs, fDiscovery);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
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
    async (socialData: { provider: string; token: string }) => {
      try {
        setFetching(true);
        const res = await loginWithSocial(socialData);
        console.log(res);
        if (res?.access_token) {
          saveAuthToken(res.access_token);
          const me = await getMe();
          if (me) {
            useStore.setState((s) => ({
              ...s,
              me: me,
              hasAuth: true,
            }));
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
    if (response) {
      handleGoogleLogin();
    }
  }, [response]);
  // useEffect(() => {
  //   if (fResponse) {
  //     handleGoogleLogin();
  //   }
  // }, [fResponse]);
  const handleGoogleLogin = async () => {
    try {
      setFetching(true);
      const res = response as AuthRedirectResult;
      if (res?.params.token) {
        saveAuthToken(res.params.token);
        const me = await getMe();
        if (me) {
          useStore.setState((s) => ({
            ...s,
            me: me,
            hasAuth: true,
          }));
        }
        return router.push("/home");
      }
    } catch (error) {
      showErrorAlert({
        title: "Error occurred during. Please try again.",
        alertType: "error",
      });
    } finally {
      setFetching(false);
    }
  };

  function onBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  }
  // ✅ Apple sign-in
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        await handleSocialLogin({
          provider: "apple",
          token: credential.identityToken,
        });
      }
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        console.log("User cancelled Apple Sign-In.");
      } else {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAppleAvailable);
  }, []);
  return (
    <OnboardingScreenContainer withScroll={false} skip allowBack={false}>
      <Box className="w-[98%] bg-background/90 max-w-[26rem] gap-4 mt-4 mx-auto rounded-xl p-6">
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
          value={form.email}
          title="Email"
          autoCapitalize="words"
          autoComplete="email"
          onUpdate={(text) => setForm({ ...form, email: text })}
          placeholder="Email address"
        />
        <CustomInput
          className="bg-background-muted"
          value={form.password}
          title="Password"
          secureTextEntry
          isLogin={true}
          onUpdate={(text) => setForm({ ...form, password: text })}
          placeholder="•••••••••"
        />
        <Button className="w-full mt-2" size="xl" onPress={handleSubmit}>
          {loading && <SpinningLoader />}
          <ButtonText>Login</ButtonText>
        </Button>

        <View className="flex-row mt-2 gap-3 items-center">
          <Divider className="flex-1" />
          <Text size="xs">OR</Text>
          <Divider className="flex-1" />
        </View>

        <View className="gap-4">
          <Button
            className=" h-12 bg-background-muted mt-4 gap-2"
            onPress={() => {
              promptAsync();
            }}
          >
            {fetching ? (
              <SpinningLoader />
            ) : (
              <Icon size={"sm"} as={GoogleIcon} />
            )}
            <ButtonText className=" text-typography font-bold text-lg">
              Sign in with Google
            </ButtonText>
          </Button>
          {/* <ExternalLink
            className="flex-1"
            href={`${config.origin}/api/auth-url/facebook` as any}
          >
            <Text>Continue with Facebook</Text>
          </ExternalLink> */}
          {/* <Button
            className="flex-1 h-12 bg-background-muted gap-2"
            onPress={() => FPromptAsync()}
          >
            <Icon size={"sm"} as={FacebookIcon} />
            <ButtonText>Continue with Facebook</ButtonText>
          </Button> */}
          {isAppleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={5}
              style={{
                width: "100%",
                height: 40,
              }}
              onPress={handleAppleSignIn}
            />
          )}
          <View className=" flex-row justify-center gap-2 mt-4">
            <Text>Don’t have an account?</Text>
            <Pressable
              onPress={() => {
                return router.push("/(auth)/signup");
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
