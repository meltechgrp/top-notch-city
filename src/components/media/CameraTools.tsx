import { View } from "react-native";
import { FlashMode } from "expo-camera";
import { Icon, Pressable } from "@/components/ui";
import {
  Flashlight,
  FlashlightOff,
  Zap,
  ZapOff,
  ZoomIn,
  ZoomOut,
} from "lucide-react-native";

interface CameraToolsProps {
  cameraZoom: number;
  cameraFlash: FlashMode;
  cameraTorch: boolean;
  top: number;
  setCameraZoom: React.Dispatch<React.SetStateAction<number>>;
  setCameraTorch: React.Dispatch<React.SetStateAction<boolean>>;
  setCameraFlash: React.Dispatch<React.SetStateAction<FlashMode>>;
}
export default function CameraTools({
  cameraZoom,
  cameraFlash,
  cameraTorch,
  setCameraZoom,
  setCameraTorch,
  setCameraFlash,
  top,
}: CameraToolsProps) {
  return (
    <View
      style={{
        position: "absolute",
        right: 8,
        zIndex: 1,
        gap: 16,
        top: top + 8,
      }}
    >
      <Pressable
        onPress={() => setCameraTorch((prevValue) => !prevValue)}
        className="p-2"
      >
        <Icon
          as={cameraTorch ? Flashlight : FlashlightOff}
          className="w-7 h-7"
        />
      </Pressable>
      <Pressable
        onPress={() =>
          setCameraFlash((prevValue) => (prevValue === "off" ? "on" : "off"))
        }
        className="p-2"
      >
        <Icon as={cameraFlash ? Zap : ZapOff} className="w-7 h-7" />
      </Pressable>
      <Pressable
        onPress={() => {
          if (cameraZoom < 1) {
            setCameraZoom((prevValue) => prevValue + 0.01);
          }
        }}
        className="p-2"
      >
        <Icon as={ZoomIn} className="w-7 h-7" />
      </Pressable>
      <Pressable
        onPress={() => {
          if (cameraZoom > 0) {
            setCameraZoom((prevValue) => prevValue - 0.01);
          }
        }}
        className="p-2"
      >
        <Icon as={ZoomOut} className="w-7 h-7" />
      </Pressable>
    </View>
  );
}
