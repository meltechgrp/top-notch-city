import Animated, { useSharedValue } from "react-native-reanimated";
import { Slider, SliderThemeType } from "react-native-awesome-slider";
import * as Haptics from "expo-haptics";
import { Text, useResolvedTheme, View } from "../ui";
import { Colors } from "@/constants/Colors";
import { cn, formatMoney } from "@/lib/utils";

export interface CustomSliderProps {
  progress: number;
  minimumValue?: number;
  maximumValue?: number;
  steps?: number;
  showBubble?: boolean;
  bubbleTranslateY?: number;
  bubbleWidth?: number;
  haptic?: boolean;
  isMoney?: boolean;
  onValueChange: (val: number) => void;
}

const thumbWidth = 15;

export function CustomSlider({
  progress,
  minimumValue = 0,
  maximumValue = 100,
  steps = 10,
  showBubble = false,
  bubbleTranslateY = -30,
  bubbleWidth = 90,
  haptic = true,
  isMoney = false,
  onValueChange,
}: CustomSliderProps) {
  const theme = useResolvedTheme();
  const current = useSharedValue(progress);
  const min = useSharedValue(minimumValue);
  const max = useSharedValue(maximumValue);
  const handleHaptic = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const isDark = theme === "dark";

  const sliderTheme: SliderThemeType = {
    maximumTrackTintColor: isDark
      ? Colors.dark.background
      : Colors.light.background,
    minimumTrackTintColor: Colors.primary,
    bubbleBackgroundColor: isDark
      ? Colors.dark.background
      : Colors.light.background,
    bubbleTextColor: isDark ? Colors.light.text : Colors.dark.text,
    cacheTrackTintColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
  };
  return (
    <View className="w-full">
      {/* Current progress */}
      <Text className="text-center mb-2 text-base font-medium">
        {isMoney
          ? formatMoney(Math.round(progress), "ngn", 0)
          : Math.round(progress)}
      </Text>

      {/* Slider */}
      <Slider
        progress={current}
        minimumValue={min}
        maximumValue={max}
        steps={steps}
        theme={sliderTheme}
        onValueChange={onValueChange}
        hapticMode={haptic ? "step" : undefined}
        onHapticFeedback={handleHaptic}
        renderMark={({ index }) => (
          <View
            className={cn(
              "w-1.5 h-1.5 bg-primary rounded-full",
              progress > index * (maximumValue / steps)
                ? "bg-primary"
                : "bg-background"
            )}
          ></View>
        )}
        renderBubble={
          showBubble
            ? () => (
                <View>
                  <Text>{Math.round(progress)}</Text>
                </View>
              )
            : undefined
        }
        bubbleTranslateY={bubbleTranslateY}
        bubbleWidth={bubbleWidth}
        bubbleMaxWidth={bubbleWidth}
        thumbWidth={thumbWidth}
        forceSnapToStep
      />
      {/* Min / Max labels */}
      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-typography">Min: {minimumValue}</Text>
        <Text className="text-sm text-typography">Max: {maximumValue}</Text>
      </View>
    </View>
  );
}
