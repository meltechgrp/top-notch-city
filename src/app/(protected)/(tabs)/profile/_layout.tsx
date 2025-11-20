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
        name="account"
        options={{
          title: "Account",
        }}
      />
      <Stack.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
        }}
      />
    </Stack>
  );
}
