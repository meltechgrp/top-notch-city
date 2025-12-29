import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { View, Icon, Text, Pressable } from "../ui";
import { Eye, Play } from "lucide-react-native";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { cn } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import PlayerController from "@/components/custom/PlayerController";
import { ReelsShareSheet } from "@/components/modals/ReelsBottomsheet";
import config from "@/config";
import { hapticFeed } from "@/components/HapticTab";
import { ReelViewsController } from "@/components/reel/ReelViewsController";
import Platforms from "@/constants/Plaforms";
import { useLike } from "@/hooks/useLike";
import { mainStore } from "@/store";

export const VideoPlayer = memo(
  forwardRef<VideoPlayerHandle, VideoPlayerProps>(
    (
      {
        style,
        rounded = false,
        onPress,
        fullScreen = false,
        reel,
        shouldPlay = false,
        inTab = true,
      },
      ref
    ) => {
      const muted = mainStore.muted.get();
      const [showControls, setShowControls] = useState(false);
      const [showBottomSheet, setShowBottomSheet] = useState(false);
      const mounted = useRef(true);
      const { toggleLike } = useLike({ queryKey: ["reels"] });
      // Setup player
      const player = useVideoPlayer(
        { uri: reel.video, useCaching: true },
        (player) => {
          try {
            player.loop = true;
            player.muted = !!muted;
            player.timeUpdateEventInterval = 1;
          } catch (e) {
            console.warn("VideoPlayer setup failed", e);
          }
        }
      );
      ReelViewsController({
        id: reel.id,
        viewed: reel.owner_interaction.viewed,
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
      useEffect(() => {
        if (isPlaying && showControls) {
          const timer = setTimeout(() => setShowControls(false), 1000);
          return () => clearTimeout(timer);
        }
      }, [isPlaying, showControls]);

      useEffect(() => {
        if (shouldPlay) {
          player.play();
        } else {
          player.pause();
        }
      }, [shouldPlay]);
      function handleToggle() {
        if (isPlaying) {
          player.pause();
        } else {
          player.play();
        }
      }
      function handleReset() {
        if (!mounted.current || !player || !inTab) return;

        try {
          player.pause?.();
          player.currentTime = 0;
        } catch (e) {
          console.warn("handleReset failed:", e);
        }
      }
      useEffect(() => {
        return () => {
          mounted.current = false;
        };
      }, []);
      useEffect(() => {
        player.muted = !!muted;
      }, [muted]);
      function handleSkip(val: number) {
        player.currentTime = Math.round(val);
      }
      useImperativeHandle(
        ref,
        () => ({
          play: () => player.play(),
          pause: () => player.pause(),
          seekTo: (sec: number) => {
            player.currentTime = sec;
          },
          reset: () => {
            handleReset();
          },
          status: player.status,
        }),
        [player]
      );
      useEffect(() => {
        return () => {
          handleReset();
        };
      }, []);
      return (
        <>
          <View className="flex-1">
            <Pressable
              onDoublePress={() => toggleLike({ id: reel.id })}
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

                <View className="absolute inset-0 z-10 bg-black/20 items-center justify-center">
                  <View className=" absolute top-40 left-4 items-center flex-row gap-2">
                    <Icon size={"md"} as={Eye} />
                    <Text className="font-bold">{reel.interations.viewed}</Text>
                  </View>
                  {showControls && (
                    <View className="flex-row gap-4 items-center">
                      <AnimatedPressable
                        onDoublePress={() => toggleLike({ id: reel.id })}
                        onPress={() => {
                          if (status == "readyToPlay") {
                            handleToggle();
                          }
                        }}
                        className="p-3 "
                      >
                        {status !== "readyToPlay" ? (
                          <SpinningLoader />
                        ) : (
                          <Icon
                            as={Play}
                            className={cn(
                              "text-primary fill-primary w-12 h-12",
                              !fullScreen && "w-8 h-8"
                            )}
                          />
                        )}
                      </AnimatedPressable>
                    </View>
                  )}

                  {fullScreen && (
                    <PlayerController
                      handleSkip={handleSkip}
                      reel={reel}
                      setShowBottomSheet={() => setShowBottomSheet(true)}
                      currentTime={currentTime || 0}
                      length={length}
                      showSlider={Platforms.isIOS()}
                      inTab={inTab}
                    />
                  )}
                </View>
              </View>
            </Pressable>
          </View>
          <ReelsShareSheet
            visible={showBottomSheet}
            id={reel.id}
            onDismiss={() => setShowBottomSheet(false)}
            propertyUrl={`${config.websiteUrl}/property/${reel.slug}`}
          />
        </>
      );
    }
  )
);
