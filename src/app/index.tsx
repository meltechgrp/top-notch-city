import * as React from "react";
import * as SplashScreen from "expo-splash-screen";
import { Redirect } from "expo-router";
import { mainStore } from "@/store";
import { useMe } from "@/hooks/useMe";
import { useValue } from "@legendapp/state/react";

export default function LandingScreen() {
  const isOnboarded = useValue(mainStore.isOnboarded);
  const { isLoggedIn, isLoading } = useMe();

  const isReady = !isLoading;

  React.useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/signin" />;
  }

  return <Redirect href="/home" />;
}
