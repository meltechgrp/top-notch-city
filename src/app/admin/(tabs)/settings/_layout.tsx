import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function AdminSettingsLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
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
          headerLeft: undefined,
          headerTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          headerTitle: "Categories",
        }}
      />
      <Stack.Screen
        name="amenities"
        options={{
          headerTitle: "Amenities",
        }}
      />
    </Stack>
  );
}
