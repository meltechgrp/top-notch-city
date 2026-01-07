import * as React from "react";
import * as SplashScreen from "expo-splash-screen";
import { Redirect } from "expo-router";
import { mainStore } from "@/store";
import { useMe } from "@/hooks/useMe";
import { Box, Image, View } from "@/components/ui";
import splash from "@/assets/images/splash.png";

SplashScreen.preventAutoHideAsync();
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

  if (ready && !isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  if (ready && !isLoggedIn) {
    return <Redirect href="/signin" />;
  }

  if (ready && isLoggedIn) {
    return <Redirect href="/home" />;
  }
  return (
    <Box className="flex-1 items-center justify-center">
      <View style={{ width: 200, height: 200 }}>
        <Image
          source={splash}
          style={{ width: 200, height: 200 }}
          contentFit="contain"
        />
      </View>
    </Box>
  );
};

export default LandingScreen;
