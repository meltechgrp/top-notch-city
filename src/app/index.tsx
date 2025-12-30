import * as React from "react";
import * as SplashScreen from "expo-splash-screen";
import { Redirect } from "expo-router";
import { mainStore } from "@/store";
import { useMe } from "@/hooks/useMe";

const LandingScreen = () => {
  const isOnboarded = mainStore.isOnboarded.get();
  const { isLoggedIn } = useMe();

  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setReady(true);
    }, 700);

    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) return null;

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/signin" />;
  }

  return <Redirect href="/home" />;
};

export default LandingScreen;
