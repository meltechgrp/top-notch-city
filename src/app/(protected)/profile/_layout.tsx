import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerLeft: headerLeft(),
        headerTitleStyle: {
          color: theme == "dark" ? Colors.dark.text : Colors.light.text,
        },
        headerStyle: {
          backgroundColor:
            theme == "dark" ? Colors.light.background : Colors.dark.background,
        },
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
          headerTitle: "qrcode",
          presentation: "formSheet",
          sheetAllowedDetents: [0.6, 1],
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
        name="account"
        options={{
          headerTitle: "Edit Account",
        }}
      />
      <Stack.Screen
        name="bio"
        options={{
          headerTitle: "Edit Bio",
          presentation: "formSheet",
          sheetAllowedDetents: [0.6, 1],
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
        name="edit"
        options={{
          headerTitle: "Edit Bio",
          presentation: "formSheet",
          sheetAllowedDetents: [0.6, 1],
          gestureEnabled: false,
          sheetGrabberVisible: false,
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
    </Stack>
  );
}
