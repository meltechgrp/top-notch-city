import WaveBar from "@/components/editor/audio/WaveBar";
import { cn } from "@/lib/utils";
import React, { memo, useEffect, useMemo, useState } from "react";
import { View, PanResponder } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  isChat?: boolean;
  seekTo?: (sec: number) => void;
};

const BAR_WIDTH = 2;
const BAR_GAP = 4;
const BAR_TOTAL = BAR_WIDTH + BAR_GAP;

function PlaybackWaveform({
  duration,
  currentTime,
  isPlaying,
  seekTo,
  isChat,
}: Props) {
  const [wid, setWidth] = useState(0);
  const playheadX = useSharedValue(0);
  const width = wid - 15;
  const pxPerSec = useMemo(
    () => (duration && width ? width / duration : 0),
    [duration, width]
  );

  useEffect(() => {
    playheadX.value = withTiming(currentTime * pxPerSec, {
      duration: isPlaying ? 120 : 0,
    });
  }, [currentTime, pxPerSec, isPlaying]);

  const bars = Math.floor(width / BAR_TOTAL);

  const pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => {
      const x = Math.max(0, Math.min(playheadX.value + g.dx, width));
      playheadX.value = x;
    },
    onPanResponderRelease: () => {
      seekTo?.(playheadX.value / pxPerSec);
    },
  });

  const playheadStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: playheadX.value }],
  }));

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className={cn(
        "h-6 flex-1 rounded-full bg-background-muted overflow-hidden flex-row items-center px-2",
        isChat && "h-8 rounded-lg"
      )}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <WaveBar key={i} index={i} playheadX={playheadX} />
      ))}
      <Animated.View
        {...pan.panHandlers}
        style={playheadStyle}
        className="absolute h-4 w-4 bg-primary rounded-full"
      />
    </View>
  );
}

export default memo(PlaybackWaveform);
