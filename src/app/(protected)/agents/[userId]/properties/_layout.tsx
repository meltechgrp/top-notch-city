import headerLeft from "@/components/shared/headerLeft";
import { useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function PropertiesLayout() {
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
        name="add"
        options={{
          headerTitle: "",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          headerShown: false,
          headerTitle: "",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
