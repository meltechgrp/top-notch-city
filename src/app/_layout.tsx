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
import { QueryClient } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Linking, LogBox, Platform } from "react-native";
import { cacheStorage } from "@/lib/asyncStorage";
import { NotifierWrapper } from "react-native-notifier";
import * as Notifications from "expo-notifications";
import { useStore } from "@/store";
import Constants from "expo-constants";
import { updatePushNotificationToken } from "@/actions/utills";
import { pushNotificationResponseHandler } from "@/lib/notification";
import { showBounceNotification } from "@/components/custom/CustomNotification";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSuppressChatPushNotification from "@/components/chat/useSuppressChatPushNotification";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { useReactQueryDevTools } from "@dev-plugins/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const unstable_settings = {
  initialRouteName: "(onboarding)/splash",
};
// Optional: Ignore the warning in React Native’s LogBox too
LogBox.ignoreLogs([
  "[Reanimated] Reading from `value` during component render.",
]);

// Disable strict mode logging
configureReanimatedLogger({
  level: ReanimatedLogLevel.error, // only show errors
  strict: false, // disables strict mode warnings
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  useNotificationObserver();
  useSuppressChatPushNotification();
  useMountPushNotificationToken();
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      let pathToNavigate: string | undefined;

      try {
        const parsedUrl = new URL(url);

        // 1️⃣ Handle known schemes (expo, custom)
        const knownSchemes = ["exp:", "expo:", "com.meltech.topnotchcity:"];
        console.log(parsedUrl.pathname, url);
        if (parsedUrl.pathname == "/oauthredirect") {
          return router.push("/(protected)/(tabs)/home");
        } else if (knownSchemes.includes(parsedUrl.protocol)) {
          const segments = parsedUrl.pathname.split("/").filter(Boolean);
          pathToNavigate = segments.join("/");
        }

        // 2️⃣ Handle web links
        else if (
          ["topnotchcity.com", "www.topnotchcity.com"].includes(
            parsedUrl.hostname
          )
        ) {
          pathToNavigate = parsedUrl.pathname.slice(1); // remove leading "/"
        }

        // 3️⃣ Fallback: try manually removing scheme
        else {
          const parts = url.split("://");
          if (parts.length > 1) {
            const rest = parts[1].split("/").filter(Boolean);
            pathToNavigate = rest.join("/");
          }
        }
        console.log(pathToNavigate);
        // 4️⃣ Final routing
        if (pathToNavigate) {
          router.push(`/(protected)/${pathToNavigate}` as any);
        }
      } catch (e) {}
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove(); // Clean up on unmount
    };
  }, []);
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);

  return (
    <>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NotifierWrapper>
              <GluestackUIProvider>
                <KeyboardProvider>
                  <BottomSheetModalProvider>
                    <Slot />
                    <GlobalManager />
                  </BottomSheetModalProvider>
                </KeyboardProvider>
              </GluestackUIProvider>
            </NotifierWrapper>
          </GestureHandlerRootView>
        </ThemeProvider>
      </PersistQueryClientProvider>
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
    setTimeout(() => {
      if (hasAuth) {
        registerForPushNotificationsAsync()
          .then((token) => {
            token && updatePushNotificationToken(token);
          })
          .catch((error) => {
            console.error("Error registering for push notifications:", error);
          });
      }
    }, 5000);
    // const notificationListener =
    //   Notifications.addNotificationReceivedListener((notification) => {
    //     console.log(notification.request.content?.data, "test");
    //     const data = notification.request.content.data;
    //     if (data?.entity_type !== "chat") {
    //       showBounceNotification({
    //         title: notification.request.content.title || "New Notification",
    //         description: notification.request.content.body || undefined,
    //       });
    //     }
    //   });
    // return () => {
    //   notificationListener.remove();
    // };
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

  // if (hasRequested === "True") {
  //   return;
  // }

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
