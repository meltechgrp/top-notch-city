import * as React from "react";
import { router, useGlobalSearchParams } from "expo-router";
import { View } from "@/components/ui";
import { loginWithSocial } from "@/actions/auth";
import { saveAuthToken } from "@/lib/secureStore";
import { useStore } from "@/store";
import { getMe } from "@/actions/user";
import { showErrorAlert } from "@/components/custom/CustomNotification";

export default function RedirectScreen() {
  const g = useGlobalSearchParams();
  console.log(g, "global");
  const handleSocialLogin = React.useCallback(
    async (socialData: { provider: string; token: string }) => {
      try {
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
        return router.push("/home");
      } catch (error) {
        showErrorAlert({
          title: "Error occurred during. Please try again.",
          alertType: "error",
        });
        return router.push("/signin");
      }
    },
    []
  );
  React.useEffect(() => {
    if (g?.code) {
      handleSocialLogin({
        provider: "google",
        token: g.code as string,
      });
    }
  }, [g]);
  return <View className=" bg-background flex-1"></View>;
}
