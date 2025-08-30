import { ListFilterIcon, Mic, SearchIcon } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Heading, Icon, Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { cn, composeFullAddress } from "@/lib/utils";
import { useFilterOptions } from "@/hooks/useFilteredProperties";
import { Divider } from "@/components/ui/divider";

interface Props {
  setLocationBottomSheet: () => void;
  setShowFilter: () => void;
  setActivateVoice: () => void;
  filter: SearchFilters;
  onApply: (data: SearchFilters) => void;
  properies: Property[];
  activeIndex: number;
}
const options = [
  { label: "Rent", value: "rent" },
  { label: "Buy", value: "sell" },
];
export function SearchHeader({
  setShowFilter,
  setActivateVoice,
  setLocationBottomSheet,
  filter,
  onApply,
  properies,
  activeIndex,
}: Props) {
  const translateY = useSharedValue(50);
  const { subcategories } = useFilterOptions(properies);
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
                <TouchableOpacity
                  className=" p-3 flex items-center justify-center rounded-full bg-background-muted" // consistent width
                  onPress={setShowFilter}
                >
                  <Icon as={ListFilterIcon} className={cn("w-6 h-6")} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
          {activeIndex == 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="px-4 pt-4 gap-4 flex-row">
                <View className="flex-row rounded-xl gap-5">
                  {options.map(({ label, value }) => (
                    <Pressable
                      both
                      key={label}
                      onPress={() => onApply({ ...filter, purpose: value })}
                      className={cn(
                        "px-6 rounded-xl py-2  bg-background-muted flex-row gap-1 items-center",
                        filter.purpose === value && "bg-primary"
                      )}
                    >
                      <Text
                        className={cn(
                          "text-base",
                          filter.purpose === value && "text-white"
                        )}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Divider orientation="vertical" className="bg-typography" />
                <View className="flex-row rounded-xl gap-5">
                  {subcategories.map((label) => (
                    <Pressable
                      both
                      key={label}
                      onPress={() =>
                        onApply({ ...filter, sub_category: label })
                      }
                      className={cn(
                        "px-6 rounded-xl py-2  bg-background-muted flex-row gap-1 items-center",
                        filter.sub_category === label && "bg-primary"
                      )}
                    >
                      <Text
                        className={cn(
                          "text-base",
                          filter.sub_category === label && "text-white"
                        )}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </View>
    </>
  );
}
