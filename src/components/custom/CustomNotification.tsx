// components/CustomNotification.tsx
import React from "react";
import {
  Notifier,
  Easing,
  NotifierComponents,
  NotifierProps,
} from "react-native-notifier";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type Props = NotifierProps & {
  title: string;
  description?: string;
  theme?: "light" | "dark";
  alertType?: "error" | "warn" | "info" | "success";
  entity_type?: string;
  entity_id?: string;
};

// ❌ Alert-style error notification
export function showErrorAlert({
  title,
  description,
  alertType = "success",
  ...props
}: Props) {
  Notifier.showNotification({
    title,
    description,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: alertType,
      ContainerComponent: (props) => (
        <SafeAreaView {...props} edges={["top"]}></SafeAreaView>
      ),
    },
    duration: 4000,
    showAnimationDuration: 700,
    showEasing: Easing.ease,
    hideOnPress: true,
  });
}

// 🧠 Advanced example with callbacks and bounce
export function showBounceNotification({
  title,
  description,
  onPress,
  entity_id,
  entity_type,
  onHidden,
  theme = "dark",
}: Props) {
  Notifier.showNotification({
    title,
    description,
    Component: NotifierComponents.Notification,
    componentProps: {
      imageSource: require("@/assets/images/notification.png"),
      maxTitleLines: 1,
      containerStyle: {
        backgroundColor:
          theme == "dark"
            ? Colors["light"].background
            : Colors["dark"].background,
      },
      titleStyle: { color: Colors.primary },
      maxDescriptionLines: 2,
      descriptionStyle: { color: Colors[theme].text },
    },
    translucentStatusBar: true,
    duration: 4000,
    showAnimationDuration: 800,
    showEasing: Easing.bounce,
    hideOnPress: true,
    onPress: () => {
      console.log("pressed", entity_type);
      if (entity_type == "chat") {
        console.log("pressed", entity_id);
        router.push({
          pathname: "/(protected)/(tabs)/message/[chatId]",
          params: {
            chatId: entity_id as string,
          },
        });
      }
    },
    onHidden,
  });
}
