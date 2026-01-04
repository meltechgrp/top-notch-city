import React from "react";
import { View } from "react-native";
import { Play, Pause } from "lucide-react-native";
import { Icon, Pressable, Text } from "@/components/ui";
import AudioWaveform from "./AudioWaveform";
import { formatTime } from "@/lib/utils";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

type Props = {
  url: string | null;
};

export default function AudioPreviewPlayer({ url }: Props) {
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
    <View className="flex-row items-center gap-3 flex-1">
      <Pressable onPress={status.playing ? onPause : onPlay}>
        <Icon as={status.playing ? Pause : Play} className="fill-gray-500" />
      </Pressable>

      <AudioWaveform
        seekTo={(sec) => player.seekTo(sec)}
        currentTime={status.currentTime}
        isPlaying={status.playing}
        duration={status.duration}
      />

      <Text className="text-sm ml-2">{formatTime(status.currentTime)}</Text>
    </View>
  );
}
