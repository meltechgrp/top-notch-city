import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function ChatsLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackVisible: true,
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
          headerShown: false,
          headerTitle: "Messages",
          headerLeft: undefined,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
