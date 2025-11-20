import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { useUser } from "@/hooks/useUser";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  const theme = useResolvedTheme();
  const { isAdmin, isAgent } = useUser();
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
          title: isAdmin || isAgent ? "Dashboard" : "More",
        }}
      />
    </Stack>
  );
}
