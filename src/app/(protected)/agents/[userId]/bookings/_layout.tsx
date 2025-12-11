import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function BookingLayout() {
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
        name="index"
        options={{
          headerTitle: "Booking History",
        }}
      />
    </Stack>
  );
}
