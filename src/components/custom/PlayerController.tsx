import ReelInteractionBar from "@/components/reel/ReelInteractionBar";
import { Icon, Pressable, Text, useResolvedTheme, View } from "@/components/ui";
import { Divider } from "@/components/ui/divider";
import { Colors } from "@/constants/Colors";
import { cn, formatMessageTime, formatMoney } from "@/lib/utils";
import { router } from "expo-router";
import { ChevronRight, House, MapPin } from "lucide-react-native";
import { memo, useEffect } from "react";
import { Slider, SliderThemeType } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";

interface PlayerControlProps {
  handleSkip: (val: number) => void;
  setShowBottomSheet: () => void;
  currentTime: number;
  reel: Reel;
  length: number;
  inTab?: boolean;
  showSlider?: boolean;
}

function PlayerController({
  length,
  currentTime,
  handleSkip,
  reel,
  setShowBottomSheet,
  inTab,
  showSlider = true,
}: PlayerControlProps) {
  const theme = useResolvedTheme();
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const duration = useSharedValue(0);
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
  useEffect(() => {
    progress.set(currentTime);
    duration.set(length);
  }, [length, currentTime]);
  // format mm:ss
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };
  return (
    <View className="absolute bottom-0 w-full left-0 right-0 ">
      {/* Time */}
      <View className={cn("flex-1 gap-2 pb-1 android:pb-4", !inTab && "pb-8")}>
        <View className="flex-row justify-between items-end gap-4 px-3">
          <View className="flex-1 gap-1">
            <View className="bg-primary rounded-md self-start py-1 px-2">
              <Text className="text-lg text-white capitalize">
                For {reel.purpose}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-white">
              {formatMoney(reel.price, "NGN", 0)}
            </Text>
            {inTab && (
              <View className="flex-row gap-2 items-center">
                <Icon size="sm" as={House} className="text-primary" />
                <Text className="text-lg  text-white">{reel.title}</Text>
                <Divider orientation="vertical" className="bg-gray-500" />
                <Text className="text-sm text-white">
                  {formatMessageTime(new Date(reel.created_at), {
                    hideTimeForFullDate: true,
                  })}
                </Text>
              </View>
            )}
            <View className="flex-row gap-2 items-center">
              <Icon size="sm" as={MapPin} className="text-primary" />
              <Text numberOfLines={1} className="text-xs  text-white">
                {reel.location}
              </Text>
            </View>
          </View>
          <ReelInteractionBar
            showMuted
            reel={reel}
            setShowBottomSheet={setShowBottomSheet}
          />
        </View>
        <View className={cn("w-full gap-4", !inTab && "px-4")}>
          {inTab && (
            <Pressable
              both
              onPress={() =>
                router.push({
                  pathname: "/property/[propertyId]",
                  params: {
                    propertyId: reel.id,
                  },
                })
              }
              className="bg-gray-500/80 ml-4 flex-row rounded-md justify-between items-center self-start px-3 py-2"
            >
              <Text className="text-white text-sm ">More details</Text>
              <Icon as={ChevronRight} />
            </Pressable>
          )}
          {showSlider && (
            <Slider
              progress={progress}
              minimumValue={min}
              theme={sliderTheme}
              maximumValue={duration}
              bubble={(value) => formatTime(value)}
              onSlidingComplete={handleSkip}
              onValueChange={handleSkip}
              bubbleTranslateY={-40}
              sliderHeight={4}
              thumbWidth={9}
              bubbleContainerStyle={{ padding: 10 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

export default memo(PlayerController);
