import * as React from "react";
import Animated, { LinearTransition } from "react-native-reanimated";
import { cn } from "@/lib/utils";
import { Pressable, ScrollView } from "react-native";
import { useImperativeHandle } from "react";
import { CloseIcon, Image, Text, View } from "@/components/ui";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { MotiView } from "moti";
import { generateMediaUrlSingle } from "@/lib/api";
import { MiniVideoPlayer } from "@/components/custom/MiniVideoPlayer";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
const ITEM_SIZE = 84;

type Props = {
  media: Media[];
  max?: number;
  onChange: (media: React.SetStateAction<Media[]>) => void;
  className?: string;
};

export type MediaPickerRef = {
  pick: () => Promise<void>;
  take: () => Promise<void>;
};

const MediaPicker = React.forwardRef<MediaPickerRef, Props>((props, ref) => {
  const { media, max = 3, onChange, className } = props;

  const [previewFiles, setPreviewFiles] = React.useState<UploadedFile[]>([]);

  const currentCount = media?.length || 0;
  const { pickMedia, takeMedia, progressMap, processFiles } = useMediaUpload({
    type: "all",
    onFiles: (media) => {
      setPreviewFiles(media);
      processFiles(media);
    },
    onSuccess: (media) => {
      setPreviewFiles([]);
      onChange((prev) => {
        const merged = [...prev, ...media]
          .filter(
            (item, idx, arr) => idx === arr.findIndex((t) => t.url === item.url)
          )
          .slice(0, max);
        return merged;
      });
    },
    onError: () => setPreviewFiles([]),
    maxSelection: max - currentCount,
  });

  const remove = React.useCallback(
    (url: string) => {
      onChange((prev) => prev.filter((m) => m.url !== url));
    },
    [onChange]
  );

  useImperativeHandle(ref, () => {
    return {
      pick: pickMedia,
      take: takeMedia,
    };
  }, []);
  if (!media.length && !previewFiles.length) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <Animated.View
        className={cn("flex-row gap-x-2 bg-transparent", className)}
        layout={LinearTransition}
      >
        {previewFiles.map((file) => {
          const progress = Math.round(progressMap[file.id] ?? 0);

          return (
            <View
              key={file.id}
              style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
              className="rounded-xl bg-background-muted items-center justify-center"
            >
              <MotiView
                from={{ rotate: "0deg" }}
                animate={{ rotate: "360deg" }}
                transition={{ loop: true, duration: 900 }}
                className="w-8 h-8 border-2 border-outline-200 border-t-primary rounded-full"
              />
              <Text className="absolute text-xs text-primary font-semibold">
                {progress}%
              </Text>
            </View>
          );
        })}
        {media.map((m, i) => {
          const isVideo = m.media_type === "VIDEO";

          return (
            <View
              key={m.id}
              style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
              className="relative"
            >
              <ProfileImageTrigger image={media} index={i} className="flex-1">
                {isVideo ? (
                  <MiniVideoPlayer
                    uri={generateMediaUrlSingle(m.url)}
                    rounded
                    canPlay
                    autoPlay={false}
                    showPlayBtn
                  />
                ) : (
                  <Image
                    source={{ uri: generateMediaUrlSingle(m.url) }}
                    rounded
                  />
                )}
              </ProfileImageTrigger>

              <Pressable
                onPress={() => remove(m.url)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full items-center justify-center"
              >
                <CloseIcon
                  color="white"
                  style={{ transform: [{ scale: 0.5 }] }}
                />
              </Pressable>
            </View>
          );
        })}
      </Animated.View>
    </ScrollView>
  );
});

export default MediaPicker;
