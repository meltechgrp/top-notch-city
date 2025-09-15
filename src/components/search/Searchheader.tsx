import { SearchIcon, Settings2 } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Icon, Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ViewProps } from "react-native";
import { memo, useEffect } from "react";
import { cn, composeFullAddress } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";

interface Props extends Partial<ViewProps> {
  setLocationBottomSheet: () => void;
  setShowFilter: () => void;
  setRoomsFilter: () => void;
  setPriceFilter: () => void;
  setTypesFilter: () => void;
  setActivateVoice: () => void;
  refetchAndApply: () => Promise<void>;
  onUpdate: (values: Partial<SearchFilters>) => void;
  filter: SearchFilters;
}
function SearchHeader({
  setShowFilter,
  setActivateVoice,
  setLocationBottomSheet,
  filter,
  setRoomsFilter,
  setPriceFilter,
  setTypesFilter,
  onUpdate,
  refetchAndApply,
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
              <View className="flex-row items-center gap-x-4 px-4 w-full">
                <View className={"flex-1 flex-row gap-3"}>
                  <Pressable
                    onPress={setLocationBottomSheet}
                    className="h-12 bg-background-muted flex-1 rounded-full flex-row items-center px-2 py-1"
                  >
                    <Text numberOfLines={1} className="flex-1 px-2">
                      {filter?.state
                        ? composeFullAddress(filter, true)
                        : "Search for a state, city or location..."}
                    </Text>
                    <View className=" p-2 bg-primary rounded-full">
                      <Icon as={SearchIcon} color="white" />
                    </View>
                  </Pressable>
                  {/* <TouchableOpacity
                    className=" p-3 flex items-center justify-center rounded-full bg-background-muted" // consistent width
                    onPress={setActivateVoice}
                  >
                    <Icon as={Mic} className={cn("w-6 h-6")} />
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="px-4 pt-4 gap-4 flex-row">
                <AnimatedPressable
                  className=" py-2 px-4 flex-row gap-2 items-center justify-center rounded-full bg-primary"
                  onPress={setShowFilter}
                >
                  <Icon as={Settings2} size="md" className="text-white" />
                  <Text className="text-white">Filter</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  className=" py-2 px-6 flex-row gap-2 items-center justify-center rounded-full bg-background-muted"
                  onPress={setPriceFilter}
                >
                  <Text>Price</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  className=" py-2 px-5 flex-row gap-2 items-center justify-center rounded-full bg-background-muted"
                  onPress={setRoomsFilter}
                >
                  <Text>Rooms</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  className={cn(
                    " py-2 px-5 flex-row gap-2 items-center justify-center rounded-full bg-background-muted",
                    filter.category == "Land" && "bg-primary"
                  )}
                  onPress={async () => {
                    filter?.category
                      ? onUpdate({ category: "" })
                      : onUpdate({ category: "Land" });
                    await refetchAndApply();
                  }}
                >
                  <Text>Lands</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  className=" py-2 px-4 flex-row gap-2 items-center justify-center rounded-full bg-background-muted"
                  onPress={setTypesFilter}
                >
                  <Text>Property Type</Text>
                </AnimatedPressable>
              </View>
            </ScrollView>
          </Animated.View>
        </SafeAreaView>
      </View>
    </>
  );
}

export default memo(SearchHeader);
