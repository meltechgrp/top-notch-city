import { Modal, Pressable } from "react-native";
import { Box, Text, View, Button } from "@/components/ui";
import * as Camera from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Audio from "expo-audio";

export default function PermissionModal({
  visible,
  onClose,
  type,
  refresh,
}: {
  visible: boolean;
  onClose: () => void;
  type: string | null;
  refresh: () => void;
}) {
  if (!type) return null;

  const messages = {
    Camera: "We need access to your camera for capturing photos and videos.",
    "Location Services":
      "Location helps us provide accurate nearby search results.",
    Microphone: "Microphone access is required for voice features.",
    Notifications:
      "Enable notifications to receive important updates and alerts.",
  };

  async function requestPermission() {
    try {
      switch (type) {
        case "Camera":
          await Camera.requestCameraPermissionsAsync();
          break;
        case "Location Services":
          await Location.requestForegroundPermissionsAsync();
          break;
        case "Microphone":
          await Audio.requestRecordingPermissionsAsync();
          break;
        case "Notifications":
          await Notifications.requestPermissionsAsync();
          break;
      }
      refresh();
    } catch (err) {}
    onClose();
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Box className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="w-full rounded-2xl bg-background-muted p-6 gap-4">
          <Text className="text-xl font-bold">{type} Permission</Text>
          <Text className="text-typography/70">
            {messages[type as keyof typeof messages]}
          </Text>

          <View className="mt-6 gap-4">
            <Button onPress={requestPermission}>
              <Text>Allow</Text>
            </Button>
            <Pressable onPress={onClose}>
              <Text className="text-center text-red-500">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Box>
    </Modal>
  );
}
