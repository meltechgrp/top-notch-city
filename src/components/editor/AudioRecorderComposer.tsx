import React from "react";
import { View } from "react-native";
import { Pause, Trash2 } from "lucide-react-native";
import { Icon, Pressable, Text } from "@/components/ui";
import AudioWaveform from "./AudioWaveform";
import AudioPreviewPlayer from "./AudioPreviewPlayer";
import { formatTime } from "@/lib/utils";

type Props = {
  isRecording: boolean;
  duration: number;
  currentTime: number;
  onCancel: () => void;
  onPause: () => void;
  url: string | null;
};

export function AudioRecorderComposer({
  isRecording,
  duration,
  onCancel,
  onPause,
  url,
  currentTime,
}: Props) {
  return (
    <View className="flex-row items-center gap-3 flex-1">
      <Pressable
        className="p-2.5 border bg-background-muted border-outline-100 rounded-full"
        onPress={onCancel}
      >
        <Icon as={Trash2} />
      </Pressable>

      <View className="flex-row items-center gap-2 bg-background-muted flex-1 h-12 border border-outline-100 rounded-3xl px-3 ">
        {isRecording ? (
          <>
            <View className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <Text className="text-sm">{formatTime(duration / 1000)}s</Text>
            <AudioWaveform
              currentTime={currentTime}
              duration={duration}
              isRecording
            />
          </>
        ) : (
          <AudioPreviewPlayer url={url} />
        )}
      </View>

      {isRecording && (
        <Pressable
          className="p-2.5 border bg-background-muted border-outline-100 rounded-full"
          onPress={onPause}
        >
          <Icon as={Pause} />
        </Pressable>
      )}
    </View>
  );
}
