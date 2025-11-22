import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function ChatsLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
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
        name="[chatId]/index"
        options={{
          headerLeft: headerLeft(),
          headerTitle: "Messages",
          animation: "none",
        }}
      />
    </Stack>
  );
}
