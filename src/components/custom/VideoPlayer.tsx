import React, { useEffect, useState } from "react";
import { StyleProp, ViewStyle, TouchableWithoutFeedback } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { Pressable, View, Icon, Text, useResolvedTheme } from "../ui";
import {
  CirclePlay,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { cn } from "@/lib/utils";
import { Slider, SliderThemeType } from "react-native-awesome-slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";

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
  let currentTime = Math.round(
    useEvent(player, "timeUpdate")?.currentTime || 0
  );
  let length = Math.round(useEvent(player, "sourceLoad")?.duration || 0);
  const isPlaying = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  }).isPlaying;

  const status = useEvent(player, "statusChange", {
    status: player.status,
  }).status;
  // Auto-hide controls after 3s when playing
  useEffect(() => {
    if (isPlaying && showControls) {
      const timer = setTimeout(() => setShowControls(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, showControls]);

  function handlePlay() {
    if (length == currentTime) {
      player.replay();
    } else {
      player.play();
    }
  }
  function handleMuted() {
    player.muted = !isMuted;
    setIsMuted(!isMuted);
  }
  function handlePause() {
    player.pause();
  }
  function handleRewind(forward: boolean) {
    player.seekBy(forward ? 10 : -10);
  }
  function handleSkip(val: number) {
    player.currentTime = Math.round(val);
  }
  return (
    <SafeAreaView edges={["bottom", "top"]} className="flex-1">
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
            contentFit="cover"
            allowsFullscreen
            nativeControls={false}
            className={cn("w-full h-full", rounded && "rounded-xl")}
          />

          {/* Controls Overlay */}
          <View className="absolute inset-0 z-10 bg-black/20 items-center justify-center">
            {/* Play / Pause */}
            {showControls && (
              <View className="flex-row gap-4 items-center">
                {/* {currentTime > 15 && (
                  <Pressable
                    onPress={() => handleRewind(false)}
                    className="p-2 rounded-full"
                  >
                    <Icon as={RotateCcw} className="text-white w-10 h-10" />
                  </Pressable>
                )} */}
                <Pressable
                  onPress={() => {
                    if (!canPlayVideo || status === "loading")
                      return onPress?.(uri);
                    isPlaying ? handlePause() : handlePlay();
                  }}
                  className="p-3 bg-black/40 rounded-full"
                >
                  {status === "loading" ? (
                    <SpinningLoader />
                  ) : isPlaying ? (
                    <Icon as={Pause} className="text-white w-10 h-10" />
                  ) : (
                    <Icon as={CirclePlay} className="text-white w-10 h-10" />
                  )}
                </Pressable>
                {/* {(length - 10)! <= currentTime && (
                  <Pressable
                    onPress={() => handleRewind(true)}
                    className="p-2 rounded-full"
                  >
                    <Icon as={RotateCw} className="text-white w-10 h-10" />
                  </Pressable>
                )} */}
              </View>
            )}

            {/* Bottom Controls */}
            {canPlayVideo && (
              <PlayerControl
                handleMuted={handleMuted}
                handleSkip={handleSkip}
                muted={isMuted}
                currentTime={currentTime || 0}
                length={length}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

interface PlayerControlProps {
  handleMuted: () => void;
  handleSkip: (val: number) => void;
  muted: boolean;
  currentTime: number;
  length: number;
}

function PlayerControl({
  length,
  currentTime,
  handleSkip,
  muted,
  handleMuted,
}: PlayerControlProps) {
  const theme = useResolvedTheme();
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const duration = useSharedValue(0);
  const isDark = theme === "dark";

  const sliderTheme: SliderThemeType = {
    maximumTrackTintColor: isDark
      ? Colors.dark.background
      : Colors.light.background,
    minimumTrackTintColor: Colors.primary,
    bubbleBackgroundColor: isDark
      ? Colors.dark.background
      : Colors.light.background,
    bubbleTextColor: isDark ? Colors.light.text : Colors.dark.text,
    cacheTrackTintColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
  };
  useEffect(() => {
    progress.set(currentTime);
    duration.set(length);
  }, [length, currentTime]);
  // format mm:ss
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-black/40">
      {/* Time */}
      <View className="flex-row mb-4 items-center flex-1 gap-4 p-4">
        <Text className="text-white text-xs">
          {formatTime(currentTime)} / {formatTime(length)}
        </Text>

        <Slider
          progress={progress}
          minimumValue={min}
          theme={sliderTheme}
          maximumValue={duration}
          bubble={(value) => formatTime(value)}
          // onHapticFeedback={handleHaptic}
          onSlidingComplete={handleSkip}
          onValueChange={handleSkip}
          bubbleTranslateY={-30}
        />
        {/* Mute / Unmute */}
        <Pressable onPress={handleMuted} className="ml-2">
          <Icon as={muted ? VolumeX : Volume2} className="text-white w-6 h-6" />
        </Pressable>
      </View>
    </View>
  );
}
