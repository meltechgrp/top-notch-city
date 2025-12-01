import AppCrashScreen from "@/components/shared/AppCrashScreen";
import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import useGetLocation from "@/hooks/useGetLocation";
import { useWebSocketHandler } from "@/hooks/useWebSocketHandler";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "/home",
};

export default function ProtectedRoutesLayout() {
  const theme = useResolvedTheme();
  const { retryGetLocation } = useGetLocation();
  useWebSocketHandler();
  useEffect(() => {
    setTimeout(retryGetLocation, 1000);
  }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animationDuration: 1000,
        animationTypeForReplace: "push",
        headerTitleAlign: "center",
        headerBackVisible: false,
        headerShadowVisible: true,
        headerLeft: headerLeft(),
        headerTitleStyle: {
          color: theme == "dark" ? Colors.dark.text : Colors.light.text,
        },
        headerStyle: {
          backgroundColor:
            theme == "dark" ? Colors.light.background : Colors.dark.background,
        },
        statusBarStyle: theme == "dark" ? "light" : "dark",
      }}
    >
      <Stack.Screen
        name="notification"
        options={{
          headerTitle: "Notifications",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="report"
        options={{
          headerTitle: "Send us a Feedback",
          headerShown: true,
        }}
      />
    </Stack>
  );
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashScreen />;
}
