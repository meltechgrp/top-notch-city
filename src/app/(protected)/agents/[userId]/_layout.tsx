import { AnimatedHeaderTitle } from "@/components/custom/AnimatedHeaderTitle";
import AppCrashScreen from "@/components/shared/AppCrashScreen";
import headerLeft from "@/components/shared/headerLeft";
import { Icon, Pressable, Text, useResolvedTheme, View } from "@/components/ui";
import config from "@/config";
import { Colors } from "@/constants/Colors";
import { useStore } from "@/store";
import {
  ErrorBoundaryProps,
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useMemo } from "react";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function ProfileScreensLayout() {
  const theme = useResolvedTheme();
  const router = useRouter();
  const { me } = useStore();
  const { user } = useLocalSearchParams() as { user: string };
  const isOwner = useMemo(() => me?.id == user, [user, me]);

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
        name="index"
        options={{
          headerTitle: "Profile",
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "Account",
        }}
      />
      <Stack.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
        }}
      />
      <Stack.Screen
        name="qrcode"
        options={{
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
