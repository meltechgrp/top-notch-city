import { ListFilterIcon, Mic, SearchIcon } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Icon, Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { cn, composeFullAddress } from "@/lib/utils";

interface Props {
  setLocationBottomSheet: () => void;
  setShowFilter: () => void;
  setActivateVoice: () => void;
  filter: SearchFilters;
}

export function SearchHeader({
  setShowFilter,
  setActivateVoice,
  setLocationBottomSheet,
  filter,
}: Props) {
  const translateY = useSharedValue(50);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 2500,
      easing: Easing.out(Easing.exp),
    });
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  return (
    <>
      <View className=" absolute top-0 left-0 w-full z-30">
        <SafeAreaView
          edges={["top"]}
          style={{ backgroundColor: "transparent" }}
        >
          <View className=" w-full android:pt-2 ">
            <View className="flex-row items-center gap-x-4 px-4 w-full">
              <Animated.View
                className={"flex-1 flex-row gap-3"}
                style={animatedStyle}
              >
                <Pressable
                  onPress={setLocationBottomSheet}
                  className="h-12 bg-background-muted flex-1 rounded-full flex-row items-center px-2 py-1"
                >
                  <Text numberOfLines={1} className="flex-1 px-2">
                    {filter?.city && filter?.state
                      ? composeFullAddress(filter, true)
                      : "Search a city..."}
                  </Text>
                  <View className=" p-2 bg-primary rounded-full">
                    <Icon as={SearchIcon} color="white" />
                  </View>
                </Pressable>
                <TouchableOpacity
                  className=" p-3 flex items-center justify-center rounded-full bg-background-muted" // consistent width
                  onPress={setActivateVoice}
                >
                  <Icon as={Mic} className={cn("w-6 h-6")} />
                </TouchableOpacity>
                <TouchableOpacity
                  className=" p-3 flex items-center justify-center rounded-full bg-background-muted" // consistent width
                  onPress={setShowFilter}
                >
                  <Icon as={ListFilterIcon} className={cn("w-6 h-6")} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}
