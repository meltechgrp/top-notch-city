import React, { memo } from "react";
import { View } from "react-native";
import { Play, Pause } from "lucide-react-native";
import { Icon, Pressable, Text } from "@/components/ui";
import AudioWaveform from "./AudioWaveform";
import { cn, formatTime } from "@/lib/utils";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

type Props = {
  url: string | null;
  isChat?: boolean;
  isMine?: boolean;
};
function AudioPreviewPlayer({ url, isChat, isMine }: Props) {
  if (!url) {
    return null;
  }
  const player = useAudioPlayer({ uri: url });
  const status = useAudioPlayerStatus(player);
  function onPlay() {
    player.seekTo(0);
    player.play();
  }
  function onPause() {
    player.pause();
  }
  return (
    <View
      className={cn(
        "flex-row items-center gap-3 flex-1",
        isChat && "flex-col items-start gap-1 pt-2 -mb-5",
      )}
    >
      <View className="flex-row flex-1 gap-3 items-center">
        <Pressable
          className={cn(isChat && "bg-background-muted rounded-full p-2")}
          onPress={status.playing ? onPause : onPlay}
        >
          <Icon as={status.playing ? Pause : Play} className="fill-gray-500" />
        </Pressable>

        <AudioWaveform
          isChat={isChat}
          seekTo={(sec) => player.seekTo(sec)}
          currentTime={status.currentTime}
          isPlaying={status.playing}
          duration={status.duration}
        />
      </View>

      <Text className={cn("text-sm ml-2", !isMine && "ml-auto")}>
        {formatTime(status.playing ? status.currentTime : player.duration)}
      </Text>
    </View>
  );
}

export default memo(AudioPreviewPlayer);
