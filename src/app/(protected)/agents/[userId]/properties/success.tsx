import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Box,
  Button,
  ButtonText,
  Icon,
  ImageBackground,
  Text,
  View,
} from "@/components/ui";
import React from "react";
import { CheckCircle } from "lucide-react-native";

export default function ListingSuccess() {
  const { userId } = useLocalSearchParams() as { userId: string };
  const router = useRouter();
  return (
    <>
      <ImageBackground
        className="flex-1"
        source={require("@/assets/images/landing/home.png")}
      >
        <Box className="flex-1 bg-black/50 items-center justify-center px-6 ">
          <View className="items-center mb-6">
            <Icon as={CheckCircle} className="text-green-500 mb-4 w-12 h-12" />
            <Text className="text-2xl font-bold text-center text-white">
              Uploaded Successfully!
            </Text>
          </View>

          <Text className=" text-center px-4">
            Thank you for uploading your property. Our team is currently
            reviewing your submission, and you will be notified once it has been
            approved.
          </Text>
          <View className="flex-row gap-4 mt-6">
            <Button
              variant="outline"
              className="flex-1 h-12 mt-4"
              size="md"
              onPress={() =>
                router.dismissTo({
                  pathname: "/agents/[userId]/properties/add",
                  params: {
                    userId,
                  },
                })
              }
            >
              <ButtonText>Upload again</ButtonText>
            </Button>
            <Button
              variant="solid"
              className="flex-1 h-12 mt-4"
              size="md"
              onPress={() =>
                router.dismissTo({
                  pathname: "/agents/[userId]/properties",
                  params: {
                    userId,
                  },
                })
              }
            >
              <ButtonText>My Properties</ButtonText>
            </Button>
          </View>
        </Box>
      </ImageBackground>
    </>
  );
}
