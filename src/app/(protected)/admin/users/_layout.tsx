import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function UserLayoutsComponent() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
