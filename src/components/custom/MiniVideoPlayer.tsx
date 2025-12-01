import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { Icon } from "@/components/ui";
import { Play } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const MiniVideoPlayer = ({
  uri,
  style,
  autoPlay = false,
  showPlayBtn = false,
  rounded = true,
  canPlay = true,
  showLoading = true,
}: {
  uri: string;
  style?: any;
  autoPlay?: boolean;
  rounded?: boolean;
  canPlay?: boolean;
  showLoading?: boolean;
  showPlayBtn?: boolean;
}) => {
  const autoplayDone = useRef(false);
  const player = useVideoPlayer({ uri, useCaching: true }, (player) => {
    player.loop = false;
    player.muted = false;
  });

  // LIVE player status updates
  const statusEvent = useEvent(player, "statusChange", {
    status: player.status,
  });
  const status = statusEvent?.status;

  const playingEvent = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const isPlaying = playingEvent?.isPlaying;

  useEffect(() => {
    if (!autoPlay || autoplayDone.current) return;
    if (!canPlay) return;

    if (status === "readyToPlay") {
      autoplayDone.current = true;
      player.play();
    }
  }, [status, autoPlay, canPlay]);
  useEffect(() => {
    if (!isPlaying) return;

    if (!canPlay) {
      player.pause();
    }
  }, [canPlay, isPlaying]);

  return (
    <Pressable style={[{ width: "100%" }, style]}>
      <View
        style={{
          width: "100%",
          height: "100%",
          overflow: rounded ? "hidden" : "visible",
          borderRadius: rounded ? 8 : 0,
          backgroundColor: "#000",
        }}
      >
        <SafeAreaView edges={["bottom", "top"]} className="flex-1">
          <VideoView
            player={player}
            contentFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </SafeAreaView>

        {status !== "readyToPlay" && showLoading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
        {showPlayBtn && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <Icon as={Play} size="sm" className="text-primary" />
          </View>
        )}
      </View>
    </Pressable>
  );
};
