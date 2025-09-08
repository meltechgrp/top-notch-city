import {
  ListOrdered,
  Mic,
  SearchIcon,
  Map,
  Settings2,
} from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Heading, Icon, Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity, ViewProps } from "react-native";
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
  filter: SearchFilters;
  activeIndex: number;
  total: number;
  onTabChange: (index: number) => void;
}
function SearchHeader({
  setShowFilter,
  setActivateVoice,
  setLocationBottomSheet,
  filter,
  activeIndex,
  onTabChange,
  setRoomsFilter,
  setPriceFilter,
  setTypesFilter,
  total,
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
                  <Pressable
                    onPress={() => {
                      onTabChange(activeIndex == 0 ? 1 : 0);
                    }}
                    className={cn(
                      " rounded-full py-2 w-14 flex-row gap-1 items-center"
                    )}
                  >
                    <Icon size="xl" as={activeIndex == 1 ? Map : ListOrdered} />
                    <Heading className={cn(" text-lg")}>
                      {activeIndex == 1 ? "Map" : "List"}
                    </Heading>
                  </Pressable>
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
                  className=" py-2 px-4 flex-row gap-2 items-center justify-center rounded-full bg-background-muted"
                  onPress={setTypesFilter}
                >
                  <Text>Property Type</Text>
                </AnimatedPressable>
              </View>
            </ScrollView>
            {activeIndex == 1 && (
              <View className="flex-row gap-4 px-4 mt-2">
                <View className=" ml-auto bg-background-muted py-2 px-4 rounded-full">
                  <Text>{total} results</Text>
                </View>
              </View>
            )}
          </Animated.View>
        </SafeAreaView>
      </View>
    </>
  );
}

export default memo(SearchHeader);
