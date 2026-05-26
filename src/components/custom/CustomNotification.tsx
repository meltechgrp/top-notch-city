import React from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Check, CircleAlert, FileWarning, Info, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import eventBus from "@/lib/eventBus";
import { Text } from "@/components/ui";
import { Colors } from "@/constants/Colors";

type AlertType = "error" | "warn" | "info" | "success";

type NotificationPayload = {
  id: string;
  title: string;
  description?: string;
  theme?: "light" | "dark";
  alertType?: AlertType;
  duration?: number;
  hideOnPress?: boolean;
  onHidden?: () => void;
  onPress?: () => void;
  entity_type?: string;
  entity_id?: string;
};

type Props = Omit<Partial<NotificationPayload>, "id"> & {
  title: string;
};

const EVENT_NAME = "SHOW_APP_NOTIFICATION";
const DEFAULT_DURATION = 4000;

export function showErrorAlert({
  title,
  description,
  alertType = "success",
  duration = DEFAULT_DURATION,
  hideOnPress = true,
  ...props
}: Props) {
  eventBus.dispatchEvent(EVENT_NAME, {
    ...props,
    id: `${Date.now()}-${Math.random()}`,
    title,
    description,
    alertType,
    duration,
    hideOnPress,
  } satisfies NotificationPayload);
}

export function showBounceNotification({
  title,
  description,
  onPress,
  onHidden,
  theme = "dark",
  duration = DEFAULT_DURATION,
  hideOnPress = true,
  ...props
}: Props) {
  eventBus.dispatchEvent(EVENT_NAME, {
    ...props,
    id: `${Date.now()}-${Math.random()}`,
    title,
    description,
    alertType: "info",
    theme,
    duration,
    hideOnPress,
    onHidden,
    onPress,
  } satisfies NotificationPayload);
}

export function NotificationHost() {
  const [queue, setQueue] = React.useState<NotificationPayload[]>([]);
  const [active, setActive] = React.useState<NotificationPayload | null>(null);
  const translateY = React.useRef(new Animated.Value(-120)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = React.useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      active?.onHidden?.();
      setActive(null);
    });
  }, [active, opacity, translateY]);

  React.useEffect(() => {
    const handler = (payload: NotificationPayload) => {
      setQueue((current) => [...current, payload]);
    };

    eventBus.addEventListener(EVENT_NAME, handler);
    return () => {
      eventBus.removeEventListener(EVENT_NAME, handler);
    };
  }, []);

  React.useEffect(() => {
    if (active || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setActive(next);
  }, [active, queue]);

  React.useEffect(() => {
    if (!active) return;

    translateY.setValue(-120);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    hideTimer.current = setTimeout(close, active.duration ?? DEFAULT_DURATION);

    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, [active, close, opacity, translateY]);

  const handlePress = React.useCallback(() => {
    active?.onPress?.();
    if (active?.hideOnPress !== false) close();
  }, [active, close]);

  if (!active) return null;

  const palette = getPalette(active.alertType, active.theme);
  const Icon = getIcon(active.alertType);

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={close}
    >
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <SafeAreaView pointerEvents="box-none" edges={["top"]}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.wrapper,
              {
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            <Pressable
              onPress={handlePress}
              style={[
                styles.card,
                {
                  backgroundColor: palette.background,
                  borderColor: palette.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: palette.iconBackground },
                ]}
              >
                <Icon size={20} color={palette.icon} />
              </View>
              <View style={styles.content}>
                <Text
                  numberOfLines={2}
                  style={[styles.title, { color: palette.title }]}
                >
                  {active.title}
                </Text>
                {!!active.description && (
                  <Text
                    numberOfLines={3}
                    style={[styles.description, { color: palette.description }]}
                  >
                    {active.description}
                  </Text>
                )}
              </View>
              <Pressable hitSlop={12} onPress={close} style={styles.close}>
                <X size={18} color={palette.description} />
              </Pressable>
            </Pressable>
          </Animated.View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function getIcon(alertType: AlertType = "success") {
  switch (alertType) {
    case "error":
      return CircleAlert;
    case "warn":
      return FileWarning;
    case "info":
      return Info;
    case "success":
    default:
      return Check;
  }
}

function getPalette(alertType: AlertType = "success", theme = "dark") {
  const dark = theme === "dark";
  const base = {
    background: dark ? "#101214" : "#ffffff",
    title: dark ? "#ffffff" : "#111827",
    description: dark ? "#cbd5e1" : "#475569",
  };

  switch (alertType) {
    case "error":
      return {
        ...base,
        border: "#ef4444",
        icon: "#ffffff",
        iconBackground: "#dc2626",
      };
    case "warn":
      return {
        ...base,
        border: "#f59e0b",
        icon: "#111827",
        iconBackground: "#fbbf24",
      };
    case "info":
      return {
        ...base,
        border: Colors.primary,
        icon: "#ffffff",
        iconBackground: Colors.primary,
      };
    case "success":
    default:
      return {
        ...base,
        border: "#22c55e",
        icon: "#ffffff",
        iconBackground: "#16a34a",
      };
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  card: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 80,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  content: {
    flex: 1,
    minHeight: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  close: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
});
