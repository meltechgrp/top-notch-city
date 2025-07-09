import { View, Image } from "react-native";
import { Box, Text, Button, ButtonText, Icon } from "@/components/ui";
import { CheckCircle } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function AgentSuccessScreen() {
  const router = useRouter();

  return (
    <Box className="flex-1 items-center justify-center px-6 bg-background">
      {/* ✅ Success icon */}
      <View className="items-center mb-6">
        <Icon as={CheckCircle} className="text-green-500 mb-4" />
        <Text className="text-2xl font-bold text-center text-typography">
          Submission Successful!
        </Text>
      </View>

      {/* ✅ Hero image or illustration */}
      <Image
        source={require("@/assets/images/landing/agent.png")}
        style={{ width: 240, height: 240 }}
        resizeMode="contain"
      />

      {/* ✅ Message */}
      <Text className="text-center text-base mt-6 text-typography">
        Thank you for providing your information. Our team is currently
        reviewing your submission. You will be notified shortly once your agent
        profile has been approved.
      </Text>

      {/* ✅ CTA button */}
      <Button
        onPress={() => router.replace("/home")}
        size="xl"
        className="mt-8 w-full rounded-full"
      >
        <ButtonText>Back to Home</ButtonText>
      </Button>
    </Box>
  );
}
