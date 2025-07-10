import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function UploadLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor:
            theme == "dark" ? Colors.light.background : Colors.dark.background,
        },
        headerTitleStyle: {
          color: theme == "dark" ? Colors.dark.text : Colors.light.text,
        },
      }}
    >
      <Stack.Screen
        name="add"
        options={{
          headerTitle: "",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          headerTitle: "",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
