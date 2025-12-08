import AppCrashScreen from "@/components/shared/AppCrashScreen";
import { ErrorBoundaryProps, Stack } from "expo-router";
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "signin",
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackVisible: true,
        statusBarStyle: "light",
      }}
    >
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signin"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify-otp"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify-success"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashScreen err={error} />;
}
