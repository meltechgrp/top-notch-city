import "./global.css";
import React, { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui";
import "react-native-reanimated";
import { ErrorBoundaryProps, router, Slot } from "expo-router";
import AppCrashScreen from "@/components/shared/AppCrashScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@/components/layouts/ThemeProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as SplashScreen from "expo-splash-screen";
import GlobalManager from "@/components/shared/GlobalManager";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import * as Clarity from "@microsoft/react-native-clarity";
import { RoleSwitchPill } from "@/components/globals/RoleSwitchPill";
import { Linking, Platform } from "react-native";
import { cacheStorage } from "@/lib/asyncStorage";
import { NotifierWrapper } from "react-native-notifier";
import * as Notifications from "expo-notifications";
import { useStore } from "@/store";
import Constants from "expo-constants";
import { updatePushNotificationToken } from "@/actions/utills";
import { pushNotificationResponseHandler } from "@/lib/notification";
import { showBounceNotification } from "@/components/custom/CustomNotification";

const query = new QueryClient();

// Initialize Microsoft Clarity
Clarity.initialize("s756k52ds5", {
  logLevel: Clarity.LogLevel.Verbose, // Note: Use "LogLevel.Verbose" value while testing to debug initialization issues.
});

export const unstable_settings = {
  initialRouteName: "(onboarding)/splash",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useReactQueryDevTools(query);

  useMountPushNotificationToken();
  useNotificationObserver();
  useEffect(function linkingWorkaround() {
    Linking.addEventListener("url", ({ url }) => {
      console.log(`Deep link: ${url}`);
      let pathToNavigate: string | undefined;

      if (url.startsWith("exp://") || url.startsWith("exp+topnotch-city://")) {
        pathToNavigate = url.split("--")[1];
      } else if (url.startsWith("https://topnotch-city.com")) {
        const path = url.split("topnotch-city.com")[1];
        console.log(`Deep link: ${path}`);
        pathToNavigate = path;
      } else pathToNavigate = url.split("://")[1];

      if (pathToNavigate) {
        pathToNavigate = `/(protected)/${pathToNavigate}`;
        router.push(pathToNavigate as any);
      }
    });
  }, []);
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <QueryClientProvider client={query}>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NotifierWrapper>
              <GluestackUIProvider>
                <BottomSheetModalProvider>
                  <Slot />
                  <RoleSwitchPill />
                  <GlobalManager />
                </BottomSheetModalProvider>
              </GluestackUIProvider>
            </NotifierWrapper>
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashScreen />;
}

function useMountPushNotificationToken() {
  const hasAuth = useStore((v) => v.hasAuth);

  if (Platform.OS === "web") {
    return;
  }

  useEffect(() => {
    if (hasAuth) {
      setTimeout(() => {
        registerForPushNotificationsAsync()
          .then((token) => {
            token && updatePushNotificationToken(token);
          })
          .catch((error) => {
            console.error("Error registering for push notifications:", error);
          });
      }, 30000);

      const notificationListener =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log(
            notification.request.content,
            notification.request.trigger,
            "test"
          );
          showBounceNotification({
            title: notification.request.content.title || "New Notification",
            description: notification.request.content.body || undefined,
          });
        });
      return () => {
        notificationListener.remove();
      };
    }
  }, [hasAuth]);
}

export function useHandleNotification() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }
  }, []);
}

function useNotificationObserver() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        pushNotificationResponseHandler(response);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export async function registerForPushNotificationsAsync() {
  let token: Notifications.ExpoPushToken | null = null;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const hasRequested = await cacheStorage.get(
    "REQUESTED_FOR_PUSH_NOTIFICATION_PERMISSION"
  );

  if (hasRequested === "True") {
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    finalStatus = status;
    cacheStorage.set(
      "REQUESTED_FOR_PUSH_NOTIFICATION_PERMISSION",
      "True",
      TWENTY_FOUR_HOURS
    );
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });
  updatePushNotificationToken(token.data);

  return token?.data;
}
