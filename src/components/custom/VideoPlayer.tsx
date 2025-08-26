import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { StyleProp, ViewStyle, TouchableWithoutFeedback } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { View, Icon, Text, useResolvedTheme } from "../ui";
import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { cn } from "@/lib/utils";
import { Slider, SliderThemeType } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { hapticFeed } from "@/components/HapticTab";
import { PropertyTitle } from "@/components/property/PropertyTitle";
import PropertyLikeButton from "@/components/property/PropertyLikeButton";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import PropertyWishListButton from "@/components/property/PropertyWishListButton";

interface VideoPlayerProps {
  uri: string;
  style?: StyleProp<ViewStyle>;
  rounded?: boolean;
  property?: Property;
  canPlayVideo?: boolean;
  fullScreen?: boolean;
  shouldPlay?: boolean;
  onPress?: (uri: string) => void;
}

export type VideoPlayerHandle = {
  play: () => void;
  pause: () => void;
  seekTo?: (sec: number) => void;
};

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  (
    {
      uri,
      style,
      rounded = false,
      canPlayVideo = true,
      onPress,
      fullScreen = false,
      property,
      shouldPlay,
    },
    ref
  ) => {
    const [showControls, setShowControls] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // Setup player
    const player = useVideoPlayer({ uri, useCaching: true }, (player) => {
      try {
        player.loop = true;
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
        player.play();
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
    useEffect(() => {
      if (shouldPlay) {
        player.play();
      } else {
        player?.pause?.();
      }
    }, [shouldPlay, player]);
    useImperativeHandle(
      ref,
      () => ({
        play: () => player.play(),
        pause: () => player?.pause(),
        seekTo: (sec: number) => {
          player.currentTime = sec;
        },
      }),
      [player]
    );

    useEffect(() => {
      return () => {
        player?.release?.(); // instead of just pause
      };
    }, [player]);
    return (
      <SafeAreaView className="flex-1" edges={[]}>
        <TouchableWithoutFeedback
          onPress={() => fullScreen && setShowControls(!showControls)}
        >
          <View
            className={cn(
              "relative w-full h-full bg-background-muted ",
              rounded && "rounded-xl overflow-hidden"
            )}
          >
            <VideoView
              style={[style, { backgroundColor: "transparent" }]}
              player={player}
              contentFit={"cover"}
              nativeControls={false}
              className={cn("w-full h-full", rounded && "rounded-xl")}
            />

            {/* Controls Overlay */}
            <View className="absolute inset-0 z-10 bg-black/20 items-center justify-center">
              {/* Play / Pause */}
              {showControls && (
                <View className="flex-row gap-4 items-center">
                  {fullScreen && (
                    <AnimatedPressable
                      onPress={() => handleRewind(false)}
                      className="p-2 rounded-full"
                    >
                      <Icon as={RotateCcw} className="text-white w-10 h-10" />
                    </AnimatedPressable>
                  )}
                  <AnimatedPressable
                    onPress={() => {
                      if (!canPlayVideo || status === "loading")
                        return onPress?.(uri);
                      isPlaying ? handlePause() : handlePlay();
                    }}
                    className="p-3 items-center justify-center bg-primary/40 rounded-full"
                  >
                    {status === "loading" ? (
                      <SpinningLoader />
                    ) : isPlaying ? (
                      <Icon as={Pause} className="text-white w-10 h-10" />
                    ) : (
                      <Icon
                        as={Play}
                        className={cn(
                          "text-white fill-white w-10 h-10",
                          !fullScreen && "w-8 h-8"
                        )}
                      />
                    )}
                  </AnimatedPressable>
                  {fullScreen && (
                    <AnimatedPressable
                      onPress={() => handleRewind(true)}
                      className="p-2 rounded-full"
                    >
                      <Icon as={RotateCw} className="text-white w-10 h-10" />
                    </AnimatedPressable>
                  )}
                </View>
              )}

              {/* Bottom Controls */}
              {fullScreen && (
                <PlayerControl
                  handleMuted={handleMuted}
                  handleSkip={handleSkip}
                  muted={isMuted}
                  property={property}
                  currentTime={currentTime || 0}
                  length={length}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
);

interface PlayerControlProps {
  handleMuted: () => void;
  handleSkip: (val: number) => void;
  muted: boolean;
  currentTime: number;
  property?: Property;
  length: number;
}

function PlayerControl({
  length,
  currentTime,
  handleSkip,
  muted,
  handleMuted,
  property,
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
    <View className="absolute bottom-10 w-full left-0 right-0 ">
      {/* Time */}
      <View className="flex-1 gap-6 mb-6 p-4">
        <View className="flex-row justify-between items-end gap-4">
          {property && <PropertyTitle property={property} />}
          <View className=" gap-4 ml-auto items-center">
            {property && (
              <View className=" items-center">
                <PropertyLikeButton property={property} />
                <Text>{property.interaction?.liked || 0}</Text>
              </View>
            )}
            {property && <PropertyWishListButton property={property} />}
            {/* Mute / Unmute */}
            <AnimatedPressable onPress={handleMuted} className="ml-2">
              <Icon
                as={muted ? VolumeX : Volume2}
                className="text-white w-8 h-8"
              />
            </AnimatedPressable>
          </View>
        </View>
        <View className="w-full gap-2">
          <Slider
            progress={progress}
            minimumValue={min}
            theme={sliderTheme}
            maximumValue={duration}
            bubble={(value) => formatTime(value)}
            onHapticFeedback={hapticFeed}
            onSlidingComplete={handleSkip}
            onValueChange={handleSkip}
            bubbleTranslateY={-40}
            sliderHeight={3}
            bubbleContainerStyle={{ padding: 10 }}
          />
          <View className="flex-row justify-between">
            <Text className="text-white text-sm">
              {formatTime(currentTime)}
            </Text>
            <Text className="text-white text-sm">{formatTime(length)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
