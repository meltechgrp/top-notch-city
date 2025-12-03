import AppCrashScreen from "@/components/shared/AppCrashScreen";
import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { ErrorBoundaryProps, Stack } from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "users",
};

export default function ProtectedRoutesLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        animationDuration: 1000,
        animationTypeForReplace: "push",
        headerTitleAlign: "center",
        animation: "slide_from_right",
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
        name="users"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="properties"
        options={{
          headerTitle: "All Properties",
        }}
      />
      <Stack.Screen
        name="pending"
        options={{
          headerTitle: "Pending Properties",
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          headerTitle: "Admin Analytics",
        }}
      />
      <Stack.Screen
        name="amenities"
        options={{
          headerTitle: "Amenities",
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          headerTitle: "Categories",
        }}
      />
      <Stack.Screen
        name="reports"
        options={{
          headerTitle: "Reports",
        }}
      />
      <Stack.Screen
        name="requests"
        options={{
          headerTitle: "Agent Applications",
        }}
      />
    </Stack>
  );
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashScreen />;
}
