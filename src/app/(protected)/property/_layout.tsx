import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function PropertysLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerBackVisible: false,
        headerLeft: headerLeft(),
        statusBarStyle: theme == "dark" ? "light" : "dark",
        headerTitleStyle: { color: theme == "dark" ? "white" : "black" },
        headerStyle: {
          backgroundColor:
            theme == "dark" ? Colors.light.background : Colors.dark.background,
        },
      }}
    >
      <Stack.Screen
        name="[propertyId]/index"
        options={{
          headerTransparent: true,
          headerShown: false,
          headerTitleStyle: { color: "white", fontSize: 20 },
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="[propertyId]/edit"
        options={{
          title: "Edit",
        }}
      />
      <Stack.Screen
        name="[propertyId]/3d-view"
        options={{
          title: "Visual Tour",
        }}
      />
    </Stack>
  );
}
