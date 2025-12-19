import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import Platforms from "@/constants/Plaforms";
import { useMe } from "@/hooks/useMe";
import { fullName } from "@/lib/utils";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function ProfileScreensLayout() {
  const theme = useResolvedTheme();
  const { me } = useMe();
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
        name="qrcode"
        options={{
          headerShown: false,
          headerTitle: "qrcode",
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          headerTitle: "Edit profile",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          headerTitle: "Edit",
          presentation: Platforms.isAndroid() ? "modal" : "formSheet",
          sheetAllowedDetents: [0.8, 1],
          gestureEnabled: false,
          sheetGrabberVisible: true,
          sheetExpandsWhenScrolledToEdge: false,
          contentStyle: {
            flex: 1,
            paddingBottom: 0,
            backgroundColor:
              theme == "dark"
                ? Colors.light.background
                : Colors.dark.background,
          },
        }}
      />

      <Stack.Screen
        name="wishlist"
        options={{
          headerTitle: "Wishlist",
        }}
      />
      <Stack.Screen
        name="properties"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="bookings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          headerTitle: "Analytics",
        }}
      />
      <Stack.Screen
        name="greeting"
        options={{
          headerTitle: "Greeting message",
        }}
      />
      <Stack.Screen
        name="activities"
        options={{
          headerTitle: me ? fullName(me) : "Activities",
          animation: "slide_from_bottom",
          presentation: "fullScreenModal",
        }}
      />
    </Stack>
  );
}
