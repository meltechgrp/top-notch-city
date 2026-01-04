import { Icon, Pressable, View } from "@/components/ui";
import { CameraIcon, Mic } from "lucide-react-native";

export function ActionButtons({
  show,
  onCamera,
  onMic,
}: {
  show: boolean;
  onCamera: () => void;
  onMic: () => void;
}) {
  if (!show) return null;

  return (
    <View className="flex-row gap-2">
      <Pressable
        className="p-3 border border-outline-100 rounded-full"
        onPress={onCamera}
      >
        <Icon as={CameraIcon} />
      </Pressable>
      <Pressable
        className="p-3 border border-outline-100 rounded-full"
        onPress={onMic}
      >
        <Icon as={Mic} />
      </Pressable>
    </View>
  );
}
