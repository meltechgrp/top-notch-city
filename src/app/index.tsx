import * as React from "react";
import * as SplashScreen from "expo-splash-screen";
import { Redirect } from "expo-router";
import { mainStore } from "@/store";
import { useMe } from "@/hooks/useMe";

export default function LandingScreen() {
  const isOnboarded = mainStore.isOnboarded.get();
  const [loading, setLoading] = React.useState(true);
  const { isLoggedIn } = useMe();
  setTimeout(() => {
    setLoading(false);
  }, 1500);
  React.useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);
  if (loading) return null;
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/signin" />;
  }

  return <Redirect href="/home" />;
}
