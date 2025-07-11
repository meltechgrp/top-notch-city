import AppCrashScreen from "@/components/shared/AppCrashScreen";
import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { ErrorBoundaryProps, Stack } from "expo-router";

export default function PropertysLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        headerBackVisible: false,
        headerLeft: headerLeft(),
        statusBarStyle: theme == "dark" ? "light" : "dark",
        headerTitleStyle: { color: theme == "dark" ? "white" : "black" },
        headerStyle: {
          backgroundColor:
            theme == "dark" ? Colors.light.background : Colors.dark.background, // 64 64 64
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
        name="[propertyId]/images"
        options={{
          headerShown: true,
          title: "Images",
        }}
      />
      <Stack.Screen
        name="[propertyId]/videos"
        options={{
          headerShown: true,
          title: "Videos",
        }}
      />
      <Stack.Screen
        name="[propertyId]/3d-view"
        options={{
          headerShown: true,
          title: "Visual Tour",
        }}
      />
      <Stack.Screen
        name="locations/index"
        options={{
          headerShown: true,
          title: "Trending Locations",
        }}
      />
      <Stack.Screen
        name="locations/[locationId]/index"
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="section"
        options={{
          headerShown: true,
          title: "Top Properties",
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          headerShown: true,
          headerTitle: "",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          headerShown: true,
          headerTitle: "",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="[propertyId]/booking"
        options={{
          headerShown: true,
          title: "Booking",
        }}
      />
    </Stack>
  );
}

// todo: move to app root layout
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashScreen />;
}
