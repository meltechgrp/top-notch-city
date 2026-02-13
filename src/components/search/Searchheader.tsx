import { ChevronLeftIcon, SearchIcon, Settings2 } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { debounce } from "lodash-es";
import { Icon, Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { ViewProps } from "react-native";
import { memo, useEffect, useMemo, useState } from "react";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { router } from "expo-router";
import { Keyboard } from "react-native";
import { useRef } from "react";
import { CustomInput } from "@/components/custom/CustomInput";

interface Props extends Partial<ViewProps> {
  setLocationBottomSheet: () => void;
  setShowFilter: () => void;
  refetch: () => Promise<void>;
  filter: SearchFilters;
  disableBack?: boolean;
  onUpdate: (values: Partial<SearchFilters>) => void;
}
function SearchHeader({
  setShowFilter,
  setLocationBottomSheet,
  filter,
  disableBack,
  onUpdate,
  refetch,
  ...props
}: Props) {
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [text, setText] = useState("");
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
  const debouncedSearch = useMemo(
    () =>
      debounce(async (val: string) => {
        onUpdate({ keyword: val });
        await refetch();
        Keyboard.dismiss();
      }, 2000), // user stops typing for 2s
    [refetch, onUpdate],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onChangeText = (val: string) => {
    setText(val);
    debouncedSearch(val);
  };
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
                {!disableBack && (
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
                )}

                <View className={"flex-1"}>
                  <View className="px-1 overflow-hidden flex-row gap-2 flex-1 items-center bg-background-muted rounded-full border border-outline-200">
                    <CustomInput
                      placeholder="Search for a state or city"
                      value={text}
                      containerClassName=" border-0 p-0 min-h-12 flex-1"
                      className="h-12 border-0 p-0"
                      autoFocus
                      numberOfLines={1}
                      onUpdate={onChangeText}
                      onSubmitEditing={() => {}}
                      submitBehavior={"blurAndSubmit"}
                      enablesReturnKeyAutomatically
                      returnKeyLabel="Search"
                      returnKeyType="search"
                    />
                    <View className=" ml-auto p-2 bg-primary rounded-full">
                      <Icon as={SearchIcon} />
                    </View>
                  </View>
                </View>

                <AnimatedPressable
                  className=" py-2 px-4 flex-row gap-2 items-center justify-center rounded-full bg-primary"
                  onPress={setShowFilter}
                >
                  <Icon as={Settings2} size="md" className="text-white" />
                  {/* <Text className="text-white text-sm">Filter</Text> */}
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
