import { AnimatedHeaderTitle } from "@/components/custom/AnimatedHeaderTitle";
import AppCrashScreen from "@/components/shared/AppCrashScreen";
import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import Platforms from "@/constants/Plaforms";
import { ErrorBoundaryProps, Stack } from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function AgentScreensLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        animationDuration: 1000,
        animationTypeForReplace: "push",
        headerTitleAlign: "center",
        animation: "slide_from_bottom",
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
        name="agent"
        options={{
          title: "Agent Application",
        }}
      />
      <Stack.Screen
        name="fields/[key]"
        options={{
          title: "Application form",
          presentation: Platforms.isAndroid() ? "modal" : "formSheet",
          sheetAllowedDetents: [0.8, 1],
          gestureEnabled: false,
          sheetGrabberVisible: true,
          sheetExpandsWhenScrolledToEdge: false,
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
        name="success"
        options={{
          title: "",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashScreen />;
}
