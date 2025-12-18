import { updateGreetingMessage } from "@/actions/user";
import { CustomInput } from "@/components/custom/CustomInput";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { Box, Button, Icon, Text, View } from "@/components/ui";
import { useMutation } from "@tanstack/react-query";
import { Save } from "lucide-react-native";
import { useState } from "react";

export default function Greeting() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateGreetingMessage,
    mutationKey: ["greet"],
    onSuccess: () => {
      showErrorAlert({
        title: "Message Updated successfully",
        alertType: "success",
      });
    },
    onError: () => {
      showErrorAlert({
        title: "Something went wrong",
        alertType: "error",
      });
    },
  });
  const [message, setMessage] = useState(
    "Thank you for contacting Humphrey! Please let me know how i can help..."
  );
  return (
    <Box className="flex-1 p-4 gap-8 ">
      <View className="gap-1">
        <Text className="text-xl font-medium">Message</Text>
        <Text className="text-xs text-typography/80 mb-4">
          Greet customers when they message you the through your properties.
        </Text>
        <View className=" min-h-40">
          <CustomInput
            value={message}
            onUpdate={setMessage}
            multiline
            placeholder="Enter greeting message"
          />
        </View>
      </View>
      <View className="flex-1">
        <Button
          onPress={async () => await mutateAsync(message)}
          className="h-12"
        >
          {isPending ? <SpinningLoader /> : <Icon as={Save} />}
          <Text>Save</Text>
        </Button>
      </View>
    </Box>
  );
}
