import * as React from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { useStore } from "@/store";

const videoSource = require("@/assets/images/splash-video.mp4");

export default function SplashScreen() {
  const { hasAuth } = useStore();
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  React.useEffect(() => {
    if (!player) return;
    const onEnded = () => {
      if (hasAuth) {
        router.replace("/home");
      } else {
        router.replace("/signin");
      }
    };

    player.addListener("playToEnd", onEnded);

    return () => {
      player.addListener("playToEnd", onEnded);
    };
  }, [player]);

  return (
    <View style={styles.container}>
      <VideoView
        style={{
          width: 250,
          height: 300,
        }}
        player={player}
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
