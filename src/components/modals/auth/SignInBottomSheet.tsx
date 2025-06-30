
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";

import { Button, ButtonText, Text, View, Box, Icon, Pressable } from "@/components/ui";

import React, { useCallback, useEffect, useState } from "react";
import { hapticFeed } from "@/components/HapticTab";
import { loginWithSocial } from "@/actions/auth";
import { showSnackbar } from "@/lib/utils";
import { saveAuthToken } from "@/lib/secureStore";
import { useStore } from "@/store";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import eventBus from "@/lib/eventBus";
import GoogleIcon from "@/components/icons/GoogleIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import BottomSheet from "../../shared/BottomSheet";
import { Divider } from "@/components/ui/divider";
import { CustomInput } from "@/components/custom/CustomInput";


export default function SignInBottomSheet({
  visible,
  onDismiss,
  onLoginSuccess
}: AuthModalProps) {
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_KEY,
      iosClientId: process.env.EXPO_PUBLIC_APPLE_AUTH_KEY,
    });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "990600566300859",
  });

WebBrowser.maybeCompleteAuthSession();
  // 🔑 Basic email sign-in
  const handleEmailSubmit = useCallback(async () => {
    hapticFeed();
    setLoading(true);
    try {
       await handleSocialLogin({ email });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [email]);

  // ✅ Social handler (common logic)
  const handleSocialLogin = useCallback(
    async (socialData: {
      email: string;
      first_name?: string;
      last_name?: string;
    }) => {
      try {
        const res = await loginWithSocial(socialData);
        if (res?.access_token) {
          saveAuthToken(res.access_token);
          useStore.setState((s) => ({ ...s, hasAuth: true }));
          eventBus.dispatchEvent("REFRESH_PROFILE", null);
          onDismiss?.()
          onLoginSuccess?.();
        }
      } catch (error) {
        console.error(error);
		showSnackbar({
		  message: "Error occurred during. Please try again.",
		  type: "error",
		});
      }
    },
    []
  );

  // ✅ Google response handler
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

  // ✅ Facebook response handler
  useEffect(() => {
    if (fbResponse?.type === "success" && fbResponse.authentication) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${fbResponse.authentication?.accessToken}&fields=id,name,email,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();
        console.log(userInfo); // Or map fields if needed
      })();
    }
  }, [fbResponse]);

  // ✅ Apple sign-in
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("Apple credential:", credential);
      if (!credential.email) {
        showSnackbar({
          message: "Error occuried. Please try again.",
          type: "error",
        });
        return;
      }

      await handleSocialLogin({
        email: credential.email,
        first_name: credential.fullName?.givenName ?? undefined,
        last_name: credential.fullName?.familyName ?? undefined,
      });
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
    <BottomSheet
      visible={visible}
      withScroll
      withHeader
      rounded={false}
      onDismiss={onDismiss}
      title="Sign In or Sign Up"
      snapPoint={["54%", '60%']}
    >
      <Box className=" gap-6 flex-1 p-6 pt-3">
        <CustomInput
          className="bg-background-muted"
          value={email}
          onUpdate={setEmail}
          placeholder="Email address"
        />

        <Button
          className="w-full mt-2 gap-2"
          size="xl"
          onPress={handleEmailSubmit}
        >
          {loading && <SpinningLoader />}
          <ButtonText>Continue</ButtonText>
        </Button>

        <View className="flex-row my-3 gap-3 items-center">
          <Divider className="flex-1" />
          <Text size="xs">OR</Text>
          <Divider className="flex-1" />
        </View>

        <View className="gap-4">

          {isAppleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={5}
              style={{ width: "100%", height: 44, marginTop: 16 }}
              onPress={handleAppleSignIn}
            />
          )}
          <Button
            className="flex-1 h-14 bg-background-muted mt-4 gap-2"
            onPress={() => googlePromptAsync()}
          >
            <Icon as={GoogleIcon} />
            <ButtonText>Continue with Google</ButtonText>
          </Button>

          <Button
            className="flex-1 h-14 bg-background-muted mt-4 gap-2"
            onPress={() => fbPromptAsync()}
          >
            <Icon as={FacebookIcon} />
            <ButtonText>Continue with Facebook</ButtonText>
          </Button>

		 <Pressable className="mx-auto mt-4">
			<Text underline size="lg">Skip</Text>
		 </Pressable>
        </View>
      </Box>
    </BottomSheet>
  );
}
