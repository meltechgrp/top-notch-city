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
import { MoreHorizontal, Share2 } from "lucide-react-native";
import { useMemo } from "react";
import { Share } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function UserProfileScreensLayout() {
  const theme = useResolvedTheme();
  const router = useRouter();
  const { me } = useStore();
  const { userId } = useLocalSearchParams() as { userId: string };
  const isOwner = useMemo(() => me?.id == userId, [userId, me]);

  async function onInvite() {
    try {
      const message =
        `📣 *Check out my profile on TopNotch City Estate!*\n\n` +
        `Looking for your dream apartment or real estate deals? View my listings and let's get started.\n\n` +
        `👉 Tap here to view my profile: ${config.websiteUrl}/agents/${userId}\n\n` +
        `Download the app for the best experience and updates.`;

      const result = await Share.share({
        title: "Visit My Profile on TopNotch City Estate",
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      alert(error.message);
    }
  }
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
        name="index"
        options={({ route }) => {
          const params = route.params as any;
          const title = params?.title ?? "Profile";

          return {
            headerTitle: () => (
              <AnimatedHeaderTitle defaultTitle="Profile" title={title} />
            ),
            headerRight: () => (
              <View className="flex-row gap-3 items-center">
                <Pressable
                  className=" bg-gray-500 rounded-xl p-1 px-1.5"
                  onPress={() => {
                    //   router.push("/(protected)/agents/[user]/account");
                  }}
                >
                  <Icon size="xl" as={MoreHorizontal} className="text-white" />
                </Pressable>
              </View>
            ),
          };
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
    </Stack>
  );
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashScreen />;
}
