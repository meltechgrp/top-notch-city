import React, { memo } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const BAR_WIDTH = 2;
const BAR_GAP = 4;
const BAR_TOTAL = BAR_WIDTH + BAR_GAP;

type Props = {
  index: number;
  playheadX: SharedValue<number>;
};

function WaveBar({ index, playheadX }: Props) {
  const barX = index * BAR_TOTAL;

  const style = useAnimatedStyle(() => ({
    opacity: barX <= playheadX.value ? 1 : 0.3,
  }));

  return (
    <Animated.View
      style={style}
      className="h-3 w-[2px] mr-[4px] rounded-full bg-primary"
    />
  );
}

export default memo(WaveBar);
