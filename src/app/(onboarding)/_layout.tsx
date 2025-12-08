import AppCrashScreen from "@/components/shared/AppCrashScreen";
import { ErrorBoundaryProps, Stack } from "expo-router";
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "onboarding",
};

export default function OnBoardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarHidden: true,
        headerBackVisible: true,
      }}
    />
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashScreen err={error} />;
}
