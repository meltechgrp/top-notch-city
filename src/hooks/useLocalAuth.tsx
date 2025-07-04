// hooks/useLocalAuth.ts
import { useState, useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";

type UseLocalAuthOptions = {
  onSuccessRoute: any;
  onFailRoute?: any;
};

export function useLocalAuth({
  onSuccessRoute,
  onFailRoute = "/menu",
}: UseLocalAuthOptions) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const authenticate = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supported = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !supported) {
        router.replace(onFailRoute);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access",
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
      });

      if (result.success) {
        router.replace(onSuccessRoute);
      } else {
        router.replace(onFailRoute);
      }
      setLoading(false);
    } catch (error) {
      console.log("Local Auth error:", error);
      router.replace(onFailRoute);
    } finally {
      setLoading(false);
    }
  }, []);

  return { authenticate, loading };
}
