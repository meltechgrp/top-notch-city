import AppCrashScreen from "@/components/shared/AppCrashScreen";
import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import Platforms from "@/constants/Plaforms";
import { ErrorBoundaryProps, Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "/",
};

export default function ProtectedRoutesLayout() {
  const theme = useResolvedTheme();
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
        name="start"
        options={{
          headerTitle: "Start",
          presentation: Platforms.isAndroid() ? "modal" : "formSheet",
          sheetAllowedDetents: [0.8, 1],
          sheetGrabberVisible: true,
          contentStyle: {
            flex: 1,
            paddingBottom: 0,
            backgroundColor:
              theme == "dark"
                ? Colors.light.background
                : Colors.dark.background,
          },
        }}
      />
      <Stack.Screen
        name="staffs"
        options={{
          headerShown: true,
          headerLeft: headerLeft(),
          headerTitle: "Staffs",
          presentation: Platforms.isAndroid() ? "modal" : "formSheet",
          sheetAllowedDetents: [0.9, 1],
          sheetGrabberVisible: true,
          contentStyle: {
            flex: 1,
            paddingBottom: 0,
            backgroundColor:
              theme == "dark"
                ? Colors.light.background
                : Colors.dark.background,
          },
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
  return <AppCrashScreen err={error} />;
}
