import { useRouter } from "expo-router";
import { Box, Button, ButtonText, Text, View } from "@/components/ui";
import React, { useRef } from "react";

export default function ListingSuccess() {
  const router = useRouter();
  return (
    <>
      <Box className="flex-1 justify-start py-6 items-center px-4">
        <View className=" my-6">
          <Text className=" text-center px-4">
            Congratulations! Your property has been uploaded succesfully, and
            awaits approval.
          </Text>
        </View>

        <View className="flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1 h-12 mt-4"
            size="md"
            onPress={() => router.dismissTo("/property/add")}
          >
            <ButtonText>Upload again</ButtonText>
          </Button>
          <Button
            variant="solid"
            className="flex-1 h-12 mt-4"
            size="md"
            onPress={() => router.dismissTo("/properties")}
          >
            <ButtonText>My Properties</ButtonText>
          </Button>
        </View>
      </Box>
    </>
  );
}
