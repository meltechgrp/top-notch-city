import headerLeft from "@/components/shared/headerLeft";
import { Icon, Pressable, Text, useResolvedTheme } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { Plus } from "lucide-react-native";

export default function AgentLayout() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
        headerTitleAlign: "center",
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
          headerShown: true,
          headerLeft: headerLeft(),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/property/add")}
              both
              className="flex-row items-center gap-1 p-2 px-4 rounded-xl bg-primary"
            >
              <Text className="text-white">Add</Text>
              <Icon size="sm" as={Plus} className="text-white" />
            </Pressable>
          ),
          headerTitle: "My Properties",
        }}
      />
    </Stack>
  );
}
