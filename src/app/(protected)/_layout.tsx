import { useWebSocket } from "@/actions/utills";
import AppCrashScreen from "@/components/shared/AppCrashScreen";
import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "home",
};

export default function ProtectedRoutesLayout() {
  const theme = useResolvedTheme();
  const { connect, closeConnection } = useWebSocket();

  useEffect(() => {
    connect();

    return () => {
      closeConnection();
    };
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
        name="dashboard"
        options={{
          headerTitle: "Analytics",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="report"
        options={{
          headerTitle: "Contact Admin",
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
