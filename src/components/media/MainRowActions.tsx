import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CameraMode } from "expo-camera";
import IconButton from "@/components/media/IconButton";
import { Icon, Image, Pressable } from "@/components/ui";
import { SwitchCamera } from "lucide-react-native";
import { ShutterButton } from "@/components/media/Shutter";
import Carousel from "react-native-reanimated-carousel";
import { MiniVideoPlayer } from "@/components/custom/MiniVideoPlayer";

interface MainRowActionsProps {
  handleTakePicture: () => void;
  cameraMode: CameraMode;
  isRecording: boolean;
  pickMedia: () => void;
  openPreview: () => void;
  bottom: number;
  setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>;
  media: Media[];
}
export default function MainRowActions({
  cameraMode,
  handleTakePicture,
  isRecording,
  pickMedia,
  setCameraFacing,
  bottom,
  media,
  openPreview,
}: MainRowActionsProps) {
  return (
    <View style={[styles.container, { bottom: bottom + 60 }]}>
      <View>
        {media?.length ? (
          <Carousel
            data={media}
            pagingEnabled={true}
            snapEnabled={true}
            width={75}
            height={75}
            style={{
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              borderRadius: 50,
            }}
            mode={"horizontal-stack"}
            modeConfig={{
              snapDirection: "left",
              stackInterval: 20,
            }}
            customConfig={() => ({ type: "positive", viewCount: 10 })}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={openPreview}
                style={{ width: 70, height: 70 }}
                className="rounded-full overflow-hidden"
                key={item.id}
              >
                {item.media_type === "VIDEO" ? (
                  <MiniVideoPlayer uri={item.url} canPlay={false} showPlayBtn />
                ) : (
                  <Image source={{ uri: item.url }} />
                )}
              </Pressable>
            )}
          />
        ) : (
          <IconButton
            onPress={pickMedia}
            androidName="library"
            iosName="photo.stack"
            className="p-3 border border-outline-100 rounded-full bg-background/50"
          />
        )}
      </View>
      <ShutterButton
        onPress={handleTakePicture}
        isRecording={isRecording}
        cameraMode={cameraMode}
      />
      <Pressable
        onPress={() =>
          setCameraFacing((prevValue) =>
            prevValue === "back" ? "front" : "back"
          )
        }
        className="p-3 border border-outline-100 bg-background/50 rounded-full"
      >
        <Icon as={SwitchCamera} className="w-7 h-7" />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 100,
    paddingHorizontal: 16,
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
  },
});
