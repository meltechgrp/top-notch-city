import { defaultNotificationHandler } from "@/lib/notification";
import * as ExpoNotifications from "expo-notifications";
import { usePathname } from "expo-router";
import { useEffect } from "react";

export default function useSuppressChatPushNotification(
  chatId?: string,
  ignore = false
) {
  const currentPathname = usePathname();

  useEffect(() => {
    ExpoNotifications.setNotificationHandler({
      handleNotification: async (notification) => {
        if (ignore) return defaultNotificationHandler(notification);
        const notyData = notification.request.content.data;
        const isNewMessageNoty = notyData.entity_type === "chat";

        if (isNewMessageNoty && notyData.entity_id === chatId) {
          return {
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: false,
            iosDisplayInForeground: false,
          };
        } else {
          return defaultNotificationHandler(notification);
        }
      },
    });

    return () => {
      ExpoNotifications.setNotificationHandler({
        handleNotification: defaultNotificationHandler,
      });
    };
  }, [currentPathname, chatId, ignore]);
}
