import { generateMediaUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import React, { memo, useMemo } from "react";
import { ImageStyle, StyleProp, ViewProps } from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { Icon, Image, Pressable, View } from "../ui";
import { CirclePlay, Pause, Trash } from "lucide-react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { ConfirmationModal } from "../modals/ConfirmationModal";
import { usePropertyDataMutations } from "@/tanstack/mutations/usePropertyDataMutations";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { ImageContentFit } from "expo-image";

interface Props extends AnimatedProps<ViewProps> {
  style?: StyleProp<ImageStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  index?: number;
  rounded?: boolean;
  source: Media;
  withBackdrop?: boolean;
  isOwner?: boolean;
  canPlayVideo?: boolean;
  isVisible?: boolean;
  nativeControls?: boolean;
  isSmallView?: boolean;
  propertyId?: string;
  contentFit?: ImageContentFit;
  onPress?: (val: string) => void;
}

const PropertyMedia: React.FC<Props> = (props) => {
  const {
    style,
    index = 0,
    rounded = false,
    withBackdrop = false,
    canPlayVideo = true,
    testID,
    nativeControls = false,
    className,
    isVisible = true,
    isOwner,
    onPress,
    source,
    imageStyle,
    isSmallView,
    propertyId,
    contentFit = "cover",
    ...animatedViewProps
  } = props;
  const { uri, isImage, id } = useMemo(
    () => generateMediaUrl(source),
    [source]
  );
  const { mutateAsync, isPending } =
    usePropertyDataMutations().deletePropertyMediaMutation;
  // Setup player if media is video
  const player =
    !isImage && uri
      ? useVideoPlayer({ uri, useCaching: true }, (player) => {
          try {
            player.loop = false;
            player.muted = true;
          } catch (e) {
            console.warn("VideoPlayer setup failed", e);
          }
        })
      : undefined;

  const isPlaying = player
    ? useEvent(player, "playingChange", {
        isPlaying: player.playing,
      }).isPlaying
    : false;
  const status = player
    ? useEvent(player, "statusChange", {
        status: player.status,
      }).status
    : false;
  return (
    <Animated.View
      testID={testID}
      className={cn("relative flex-1", className)}
      {...animatedViewProps}
    >
      {isVisible && isImage ? (
        <Pressable className="flex-1" onPress={() => onPress?.(uri)}>
          <Image
            rounded={rounded}
            source={{ uri, cacheKey: id }}
            cacheKey={id}
            contentFit={contentFit}
            transition={500}
            style={imageStyle}
          />
        </Pressable>
      ) : null}
      {isVisible && !isImage && player ? (
        <Pressable
          onPress={() => onPress?.(uri)}
          className={cn(
            "relative w-full h-full",
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
          {/* ▶️ Play icon overlay */}
          <Pressable
            onPress={() => {
              if (!canPlayVideo || status == "loading") return onPress?.(uri);
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
            className="absolute z-10 inset-0 items-center justify-center"
          >
            {/* {canPlayVideo && ( */}
            <View className="p-2 rounded-full bg-black/30 ">
              {isPlaying ? (
                <Icon as={Pause} className=" text-primary w-10 h-10" />
              ) : (
                <>
                  {status !== "loading" ? (
                    <Icon
                      as={CirclePlay}
                      className={cn(
                        " text-primary w-10 h-10",
                        isSmallView && "w-7 h-7"
                      )}
                    />
                  ) : (
                    <SpinningLoader />
                  )}
                </>
              )}
            </View>
            {/* )} */}
          </Pressable>
        </Pressable>
      ) : null}

      {withBackdrop && (
        <View
          className={cn(
            "absolute w-full h-full bg-black/50 ios:z-10",
            rounded && "rounded-xl"
          )}
        />
      )}
      {isOwner && (
        <View className=" absolute top-1 right-1">
          <ConfirmationModal
            header="Delete media"
            className=""
            optionalComponent={
              <View className="bg-background-muted/80 rounded-full p-1.5">
                {isPending ? (
                  <SpinningLoader />
                ) : (
                  <Icon size="xl" as={Trash} className="text-primary" />
                )}
              </View>
            }
            visible
            description="This action will delete this property media file"
            onDelete={async () => {
              await mutateAsync(
                {
                  propertyId: propertyId!,
                  mediaId: source.id,
                },
                {
                  onSuccess: () => {
                    showErrorAlert({
                      title: "Media deleted successfuly",
                      alertType: "success",
                    });
                  },
                  onError: () => {
                    showErrorAlert({
                      title: "Error occuried!, try again.",
                      alertType: "error",
                    });
                  },
                }
              );
            }}
            onConfirm={async () => {}}
            actionText=""
          />
        </View>
      )}
    </Animated.View>
  );
};

export default memo(PropertyMedia);
