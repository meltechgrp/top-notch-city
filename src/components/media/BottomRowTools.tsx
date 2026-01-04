import * as React from "react";
import { View } from "react-native";
import { CameraMode } from "expo-camera";
import { Pressable, Text } from "@/components/ui";
import { cn } from "@/lib/utils";

interface BottomRowToolsProps {
  cameraMode: CameraMode;
  bottom: number;
  setCameraMode: React.Dispatch<React.SetStateAction<CameraMode>>;
}
export default function BottomRowTools({
  cameraMode,
  setCameraMode,
  bottom,
}: BottomRowToolsProps) {
  return (
    <View
      style={{ paddingBottom: bottom + 8 }}
      className="flex-row justify-center gap-12 items-center bg-background-muted/80 p-4"
    >
      <Pressable onPress={() => setCameraMode("picture")}>
        <Text
          style={{
            fontWeight: cameraMode === "picture" ? "bold" : "300",
          }}
          className={cn("text-lg", cameraMode === "picture" && "text-primary")}
        >
          Photo
        </Text>
      </Pressable>
      <Pressable onPress={() => setCameraMode("video")}>
        <Text
          style={{
            fontWeight: cameraMode === "video" ? "bold" : "300",
          }}
          className={cn("text-lg", cameraMode === "video" && "text-primary")}
        >
          Video
        </Text>
      </Pressable>
    </View>
  );
}
