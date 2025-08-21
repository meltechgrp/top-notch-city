import React, { useEffect, useState } from "react";
import { StyleProp, ViewStyle, TouchableWithoutFeedback } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { Pressable, View, Icon, Text } from "../ui";
import { CirclePlay, Pause, Volume2, VolumeX } from "lucide-react-native";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { cn } from "@/lib/utils";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";

interface VideoPlayerProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
  rounded?: boolean;
  canPlayVideo?: boolean;
  isSmallView?: boolean;
  onPress?: (uri: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  style,
  rounded = false,
  canPlayVideo = true,
  isSmallView,
  onPress,
}) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Setup player
  const player = useVideoPlayer({ uri, useCaching: true }, (player) => {
    try {
      player.loop = false;
      player.muted = true;
      player.timeUpdateEventInterval = 1;
    } catch (e) {
      console.warn("VideoPlayer setup failed", e);
    }
  });

  let time = useEvent(player, "timeUpdate")?.currentTime;
  let max = useEvent(player, "sourceLoad")?.duration || 0;
  useEffect(() => {
    setProgress(time || player.currentTime);
    setDuration(max || player.duration);
  }, [time, max, player]);
  const isPlaying = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  }).isPlaying;

  const status = useEvent(player, "statusChange", {
    status: player.status,
  }).status;

  // Auto-hide controls after 3s when playing
  useEffect(() => {
    if (isPlaying && showControls) {
      const timer = setTimeout(() => setShowControls(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, showControls]);

  // format mm:ss
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowControls(!showControls)}>
      <View
        className={cn(
          "relative w-full h-full bg-black",
          rounded && "rounded-xl overflow-hidden"
        )}
      >
        <VideoView
          style={[style, { backgroundColor: "transparent" }]}
          player={player}
          contentFit="contain"
          allowsFullscreen
          nativeControls={false}
          className={cn("w-full h-full", rounded && "rounded-xl")}
        />

        {/* Controls Overlay */}
        {showControls && (
          <View className="absolute inset-0 z-10 bg-black/20 items-center justify-center">
            {/* Play / Pause */}
            <Pressable
              onPress={() => {
                if (!canPlayVideo || status === "loading")
                  return onPress?.(uri);
                isPlaying ? player.pause() : player.play();
              }}
              className="p-3 bg-black/40 rounded-full"
            >
              {status === "loading" ? (
                <SpinningLoader />
              ) : isPlaying ? (
                <Icon as={Pause} className="text-white w-12 h-12" />
              ) : (
                <Icon as={CirclePlay} className="text-white w-12 h-12" />
              )}
            </Pressable>

            {/* Bottom Controls */}
            <View className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 flex-row items-center gap-4">
              {/* Time */}
              <Text className="text-white text-xs">
                {formatTime(progress)} / {formatTime(duration)}
              </Text>

              {/* Progress Bar */}
              <Slider
                maxValue={Math.floor(duration)}
                value={progress}
                minValue={0}
                size="md"
                step={10}
                onChange={(val) => {
                  setProgress(val);
                  player.seekBy(val);
                }}
                className="flex-1 bg-background-muted"
                orientation="horizontal"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              {/* Mute / Unmute */}
              <Pressable
                onPress={() => {
                  player.muted = !isMuted;
                  setIsMuted(!isMuted);
                }}
                className="ml-2"
              >
                <Icon
                  as={isMuted ? VolumeX : Volume2}
                  className="text-white w-6 h-6"
                />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
