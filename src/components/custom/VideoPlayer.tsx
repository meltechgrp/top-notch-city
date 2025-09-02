import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { TouchableWithoutFeedback, AppState } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { View, Icon, Text } from "../ui";
import { Eye, Play } from "lucide-react-native";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { cn } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { useIsFocused } from "@react-navigation/native";
import PlayerController from "@/components/custom/PlayerController";
import { useStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { viewProperty } from "@/actions/property";
import { usePathname } from "expo-router";
import { ReelsShareSheet } from "@/components/modals/ReelsBottomsheet";
import config from "@/config";
import { hapticFeed } from "@/components/HapticTab";

export const VideoPlayer = memo(
  forwardRef<VideoPlayerHandle, VideoPlayerProps>(
    (
      {
        style,
        rounded = false,
        canPlayVideo = true,
        onPress,
        fullScreen = false,
        reel,
        shouldPlay = false,
        inTab = true,
      },
      ref
    ) => {
      const { muted } = useStore();
      const [showControls, setShowControls] = useState(true);
      const [showBottomSheet, setShowBottomSheet] = useState(false);
      const { uri } = reel;
      const isFocused = useIsFocused();
      const queryClient = useQueryClient();
      const path = usePathname();
      const { mutate } = useMutation({
        mutationFn: () => viewProperty({ id: reel.id }),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["properties"] });
          queryClient.invalidateQueries({ queryKey: ["reels"] });
        },
      });
      const isVisible = useMemo(
        () => path.includes("/reels") || path.includes("/videos"),
        [path]
      );
      // Setup player
      const player = useVideoPlayer({ uri, useCaching: true }, (player) => {
        try {
          player.loop = true;
          player.muted = !!muted;
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
          const timer = setTimeout(() => setShowControls(false), 1000);
          return () => clearTimeout(timer);
        }
      }, [isPlaying, showControls]);
      // App minimized
      useEffect(() => {
        const sub = AppState.addEventListener("change", (state) => {
          if (state !== "active") player.pause();
          else if (
            status == "readyToPlay" &&
            shouldPlay &&
            canPlayVideo &&
            isVisible
          )
            player.play();
        });
        return () => sub.remove();
      }, [player, status, shouldPlay, canPlayVideo, canPlayVideo, isVisible]);
      // Screen unfocused
      useEffect(() => {
        if (!isFocused || AppState.currentState !== "active") {
          player.pause();
          return;
        }

        if (
          shouldPlay &&
          status === "readyToPlay" &&
          canPlayVideo &&
          isVisible
        ) {
          player.play();
        } else {
          handleReset();
        }
      }, [isFocused, shouldPlay, status, canPlayVideo, isVisible]);
      function handleToggle() {
        if (isPlaying) {
          player.pause();
        } else {
          player.play();
        }
      }
      function handleReset() {
        if (player && inTab) {
          player?.status == "readyToPlay" && player?.pause?.();
          player.currentTime = 0;
        }
      }
      useEffect(() => {
        player.muted = !!muted;
      }, [muted]);
      function handleSkip(val: number) {
        player.currentTime = Math.round(val);
      }
      useEffect(() => {
        if (shouldPlay && status == "readyToPlay") {
          player.play();
        } else {
          handleReset();
        }
      }, [shouldPlay, player, status]);
      useImperativeHandle(
        ref,
        () => ({
          play: () => player.play(),
          pause: () => {},
          seekTo: (sec: number) => {
            player.currentTime = sec;
          },
          reset: () => {
            handleReset();
          },
        }),
        [player]
      );
      useEffect(() => {
        return () => {
          handleReset();
        };
      }, []);
      useEffect(() => {
        if (shouldPlay) {
          mutate();
        }
      }, [shouldPlay]);
      return (
        <>
          <View style={style}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (fullScreen) {
                  setShowControls(!showControls);
                  handleToggle();
                }
              }}
              onLongPress={() => {
                hapticFeed();
                setShowBottomSheet(true);
              }}
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
                  <View
                    className={cn(
                      " absolute flex-row justify-between items-center top-16 w-full px-4 left-0 right-0",
                      !inTab && "top-8"
                    )}
                  >
                    <View className="bg-primary rounded-md self-start py-1 px-2">
                      <Text className="text-lg text-white capitalize">
                        For {reel.purpose}
                      </Text>
                    </View>
                    <View className="flex-row gap-2 items-center">
                      <Icon size="sm" as={Eye} />
                      <Text className="text-lg">
                        {reel.interations?.viewed}
                      </Text>
                    </View>
                  </View>
                  {/* Play / Pause */}
                  {showControls && (
                    <View className="flex-row gap-4 items-center">
                      <AnimatedPressable
                        onPress={() => {
                          if (!canPlayVideo || status === "loading")
                            return onPress?.(uri);
                          else if (status == "readyToPlay") {
                            handleToggle();
                          }
                        }}
                        className="p-3 "
                      >
                        {status === "loading" ? (
                          <SpinningLoader />
                        ) : (
                          !isPlaying && (
                            <Icon
                              as={Play}
                              className={cn(
                                "text-white/70 fill-white w-12 h-12",
                                !fullScreen && "w-8 h-8"
                              )}
                            />
                          )
                        )}
                      </AnimatedPressable>
                    </View>
                  )}

                  {/* Bottom Controls */}
                  {fullScreen && (
                    <PlayerController
                      handleSkip={handleSkip}
                      reel={reel}
                      setShowBottomSheet={() => setShowBottomSheet(true)}
                      currentTime={currentTime || 0}
                      length={length}
                      inTab={inTab}
                    />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <ReelsShareSheet
            visible={showBottomSheet}
            id={reel.id}
            onDismiss={() => setShowBottomSheet(false)}
            propertyUrl={`${config.websiteUrl}/property/${reel.id}`}
          />
        </>
      );
    }
  )
);
