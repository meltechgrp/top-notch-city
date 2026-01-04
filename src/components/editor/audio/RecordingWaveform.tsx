import React, { memo, useEffect, useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

const BAR_WIDTH = 2;
const BAR_GAP = 4;
const MAX_BARS = 30;

function RecordingWaveform() {
  const [bars, setBars] = useState<number[]>([]);
  useEffect(() => {
    const id = setInterval(() => {
      setBars((prev) => {
        const next = [...prev, Math.random() * 12 + 4];
        return next.length > MAX_BARS ? next.slice(1) : next;
      });
    }, 120);

    return () => clearInterval(id);
  }, []);

  return (
    <View className="overflow-hidden flex-1 h-6">
      <View className="flex-row flex-1 justify-end overflow-hidden items-center">
        {bars.map((h, i) => (
          <Animated.View
            key={i}
            style={{
              height: h,
              width: BAR_WIDTH,
              marginRight: BAR_GAP,
            }}
            className="bg-primary rounded-full"
          />
        ))}
      </View>
    </View>
  );
}

export default memo(RecordingWaveform);
