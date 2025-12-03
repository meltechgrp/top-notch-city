import { View, Image } from "react-native";
import {
  Box,
  Text,
  Button,
  ButtonText,
  Icon,
  ImageBackground,
} from "@/components/ui";
import { CheckCircle } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function AgentSuccessScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      className="flex-1"
      source={require("@/assets/images/landing/agent.png")}
    >
      <Box className="flex-1 bg-black/50 items-center justify-center px-6 ">
        {/* ✅ Success icon */}
        <View className="items-center mb-6">
          <Icon as={CheckCircle} className="text-green-500 mb-4 w-12 h-12" />
          <Text className="text-2xl font-bold text-center text-white">
            Submission Successful!
          </Text>
        </View>

        {/* ✅ Message */}
        <Text className="text-center text-base mt-6 text-white">
          Thank you for providing your information. Our team is currently
          reviewing your submission. You will be notified shortly once your
          agent profile has been approved.
        </Text>

        {/* ✅ CTA button */}
        <Button
          onPress={() => router.replace("/home")}
          size="xl"
          className="mt-8 self-center rounded-xl"
        >
          <ButtonText>Back to Home</ButtonText>
        </Button>
      </Box>
    </ImageBackground>
  );
}
