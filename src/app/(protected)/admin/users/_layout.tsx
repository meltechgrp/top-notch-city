import headerLeft from "@/components/shared/headerLeft";
import { Icon, Pressable, useResolvedTheme, View } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function UserLayoutsComponent() {
  const theme = useResolvedTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: false,
        headerLeft: headerLeft(),
        headerTitleStyle: {
          color: theme == "dark" ? Colors.dark.text : Colors.light.text,
        },
        headerStyle: {
          backgroundColor:
            theme == "dark" ? Colors.light.background : Colors.dark.background,
        },
        headerRight: () => (
          <View className="px-4 flex-row gap-6">
            <Pressable onPress={() => {}}>
              <Icon as={Plus} className="w-6 h-6" />
            </Pressable>
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Admin Users",
        }}
      />
      <Stack.Screen
        name="[userId]/index"
        options={{
          headerTitle: "Admin User Profile",
        }}
      />
    </Stack>
  );
}
