import { markAsRead } from "@/actions/notification";
import * as ExpoNotifications from "expo-notifications";
import { router } from "expo-router";
const getNotificationData = (
  response: ExpoNotifications.NotificationResponse
) => {
  return response.notification.request.content.data as UserNotification;
};

export function pushNotificationResponseHandler(
  response: ExpoNotifications.NotificationResponse,
  isAppStart?: boolean
) {
  const isPushNotification =
    response.notification.request.trigger &&
    (
      response.notification.request
        .trigger as ExpoNotifications.PushNotificationTrigger
    ).type === "push";
  if (!isPushNotification) return;

  const notificationType = getNotificationData(response)
    ?.entity_type as NotificationType;
  const notificationId = getNotificationData(response)?.id as string;
  markAsRead({ id: notificationId });
  if (notificationType) {
    handleNotificationResponseByType(response, isAppStart);
    return;
  } else {
    if (isAppStart) {
      router.replace("/home");
    }
    handleNotificationResponseByType(response);
  }
}

function handleNotificationResponseByType(
  response: ExpoNotifications.NotificationResponse,
  isAppStart?: boolean
) {
  const notificationData = getNotificationData(response);
  if (!notificationData) return;
  const notificationType = notificationData?.entity_type as NotificationType;

  const navigateTo = (href: Parameters<typeof router.push>[0]) => {
    if (isAppStart) {
      router.push("/home");
      router.push(href);
    } else {
      router.navigate(href);
    }
  };
  console.log(notificationType);
  switch (notificationType) {
    case "chat": {
      navigateTo({
        pathname: "/(protected)/messages/[chatId]",
        params: {
          chatId: notificationData?.entity_id as string,
        },
      });
      break;
    }
    case "property": {
      navigateTo({
        pathname: "/(protected)/property/[propertyId]",
        params: {
          propertyId: notificationData?.entity_id as string,
        },
      });
      break;
    }
    default:
      if (isAppStart) {
        navigateTo("/home");
      }
      console.log(
        "No handler defined for notification type: ",
        notificationType
      );
  }
}

export async function defaultNotificationHandler(
  notification: ExpoNotifications.Notification
) {
  return {
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  };
}
