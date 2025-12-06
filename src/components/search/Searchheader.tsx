import { ChevronLeftIcon, Settings2 } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Icon, Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { ViewProps } from "react-native";
import { memo, useEffect } from "react";
import { composeFullAddress } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { router } from "expo-router";

interface Props extends Partial<ViewProps> {
  setLocationBottomSheet: () => void;
  setShowFilter: () => void;
  filter: SearchFilters;
}
function SearchHeader({
  setShowFilter,
  setLocationBottomSheet,
  filter,
  ...props
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
      <View
        {...props}
        className=" absolute bg-background top-0 pb-2.5 left-0 w-full z-30"
      >
        <SafeAreaView
          edges={["top"]}
          style={{ backgroundColor: "transparent" }}
        >
          <Animated.View style={animatedStyle}>
            <View className=" w-full android:pt-2">
              <View className="flex-row items-center gap-x-2 px-4 w-full">
                <Pressable
                  onPress={() => {
                    if (router.canGoBack()) router.back();
                    else router.push("/");
                  }}
                  style={[[props?.style]]}
                  className="py-px flex-row items-center p-2.5 bg-background-muted rounded-full"
                >
                  <Icon className=" w-7 h-7" as={ChevronLeftIcon} />
                </Pressable>

                <View className={"flex-1 flex-row gap-3"}>
                  <Pressable
                    onPress={setLocationBottomSheet}
                    className="h-12 bg-background-muted flex-1 rounded-full flex-row items-center px-2 py-1"
                  >
                    <Text numberOfLines={1} className="flex-1 text-sm px-2">
                      {filter?.state
                        ? composeFullAddress(filter)
                        : "Search for a state, city or location..."}
                    </Text>
                  </Pressable>
                </View>

                <AnimatedPressable
                  className=" py-2 px-4 flex-row gap-2 items-center justify-center rounded-full bg-primary"
                  onPress={setShowFilter}
                >
                  <Icon as={Settings2} size="md" className="text-white" />
                  <Text className="text-white text-sm">Filter</Text>
                </AnimatedPressable>
              </View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    </>
  );
}

export default memo(SearchHeader);
