import "./global.css";
import React, { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui";
import "react-native-reanimated";
import { ErrorBoundaryProps, Slot } from "expo-router";
import AppCrashScreen from "@/components/shared/AppCrashScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import GlobalManager from "@/components/shared/GlobalManager";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as SplashScreen from "expo-splash-screen";
import { LogBox, Platform } from "react-native";
import { cacheStorage } from "@/lib/asyncStorage";
import { NotifierWrapper } from "react-native-notifier";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { updatePushNotificationToken } from "@/actions/utills";
import { pushNotificationResponseHandler } from "@/lib/notification";
import useSuppressChatPushNotification from "@/components/chat/useSuppressChatPushNotification";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { enableScreens } from "react-native-screens";
import { ImageViewerProvider } from "@/components/custom/ImageViewerProvider";
import { registerDevice } from "@/actions/user";
import useGetLocation from "@/hooks/useGetLocation";
import { useMe } from "@/hooks/useMe";

enableScreens(true);
const query = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 1,
    },
  },
});

export const unstable_settings = {
  initialRouteName: "/",
};
LogBox.ignoreLogs([
  "[Reanimated] Reading from `value` during component render.",
]);
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useNotificationObserver();
  const { retryGetLocation } = useGetLocation();
  useSuppressChatPushNotification();
  useMountPushNotificationToken();
  useEffect(() => {
    (async () => {
      await retryGetLocation();
      await registerDevice();
    })();
  }, []);
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotifierWrapper>
          <GluestackUIProvider>
            <KeyboardProvider>
              <QueryClientProvider client={query}>
                <ImageViewerProvider>
                  <BottomSheetModalProvider>
                    <Slot />
                    <GlobalManager />
                  </BottomSheetModalProvider>
                </ImageViewerProvider>
              </QueryClientProvider>
            </KeyboardProvider>
          </GluestackUIProvider>
        </NotifierWrapper>
      </GestureHandlerRootView>
    </>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashScreen err={error} />;
}

function useMountPushNotificationToken() {
  const { isLoggedIn } = useMe();

  if (Platform.OS === "web") {
    return;
  }

  useEffect(() => {
    setTimeout(() => {
      if (isLoggedIn) {
        registerForPushNotificationsAsync()
          .then((token) => {
            token && updatePushNotificationToken(token);
          })
          .catch((error) => {
            console.error("Error registering for push notifications:", error);
          });
      }
    }, 5000);
  }, [isLoggedIn]);
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
