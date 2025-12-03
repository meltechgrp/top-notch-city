import { Box, Icon, Pressable, Text, View } from "@/components/ui";
import { ChevronRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import * as Camera from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Audio from "expo-audio";
import PermissionModal from "@/components/modals/profile/PermissionModal";

export default function DevicePermissions() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<string | null>(
    null
  );

  const [statuses, setStatuses] = useState({
    Camera: "Loading...",
    "Location Services": "Loading...",
    Microphone: "Loading...",
    Notifications: "Loading...",
  });

  async function loadPermissions() {
    try {
      const camera = await Camera.getCameraPermissionsAsync();
      const location = await Location.getForegroundPermissionsAsync();
      const microphone = await Audio.getRecordingPermissionsAsync();
      const notifications = await Notifications.getPermissionsAsync();

      setStatuses({
        Camera: camera.granted ? "Allowed" : "Not Allowed",
        "Location Services": location.granted ? "Allowed" : "Not Allowed",
        Microphone: microphone.granted ? "Allowed" : "Not Allowed",
        Notifications: notifications.granted ? "Allowed" : "Not Allowed",
      });
    } catch (err) {}
  }

  useEffect(() => {
    loadPermissions();
  }, []);

  const openModal = (type: string) => {
    setCurrentPermission(type);
    setModalVisible(true);
  };

  return (
    <Box className="flex-1 gap-4 p-4">
      <Text className="text-base text-typography/80">Your preferences</Text>

      <View className="gap-6">
        {Object.entries(statuses).map(([key, status]) => (
          <View key={key} className="flex-row justify-between items-center">
            <Text className="text-lg font-medium">{key}</Text>

            <Pressable
              className="flex-row gap-4 items-center"
              onPress={() => openModal(key)}
            >
              <Text
                className={`${
                  status === "Allowed" ? "text-green-600" : "text-red-500"
                }`}
              >
                {status}
              </Text>
              <Icon className="w-7 h-7" as={ChevronRight} />
            </Pressable>
          </View>
        ))}
      </View>

      <PermissionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={currentPermission}
        refresh={loadPermissions}
      />
    </Box>
  );
}
