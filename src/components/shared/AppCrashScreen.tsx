import { Box, Button, ButtonText, Text } from "@/components/ui";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { reloadAppAsync } from "expo";
import BeachPersonWaterParasolIcon from "@/components/icons/BeachPersonWaterParasolIcon";

export default function AppCrashScreen() {
  return (
    <Box className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <View className="py-6 flex-1 pt-20">
          <View className="flex-1 justify-center px-4">
            <View className="items-center mb-8">
              <BeachPersonWaterParasolIcon width={64} height={64} />
            </View>
            <Text className="text-center text-foreground text-2xl font-semibold">
              Something went wrong!
            </Text>
            <Text className="text-center text-foreground mt-2 mb-6">
              Please reload to try again!
            </Text>
          </View>

          <View className="px-4">
            <Button
              onPress={() => {
                reloadAppAsync();
              }}
            >
              <ButtonText>Try Again</ButtonText>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Box>
  );
}
