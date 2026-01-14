import { cn } from "@/lib/utils";
import { View } from "react-native";
import { Heading, Icon, Text } from "../ui";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { Layers2, ListOrdered, Map, MapPin } from "lucide-react-native";
import { memo } from "react";

type IProps = {
  total?: number;
  isLocation?: boolean;
  loading?: boolean;
  useMyLocation: () => Promise<void>;
  activeIndex: number;
  onTabChange: (index: number) => void;
};
function SearchTabs(props: IProps) {
  const {
    total = 0,
    useMyLocation,
    isLocation,
    loading,
    onTabChange,
    activeIndex,
  } = props;
  return (
    <View className={cn("w-full absolute left-0 bottom-4 right-0 z-50")}>
      <SafeAreaView edges={["bottom"]}>
        <View className="flex-row justify-between items-end px-4">
          <View className=" bg-background-muted/70 py-2.5 px-4 rounded-full">
            {loading ? (
              <Text className="text-xs">Searching...</Text>
            ) : (
              <Text>{total} results</Text>
            )}
          </View>
          <View className="flex-row bg-background-muted rounded-3xl">
            <AnimatedPressable
              onPress={() => {
                onTabChange(0);
              }}
              className={cn(
                " py-3 bg-background-muted px-4 rounded-3xl flex-row gap-1 items-center",
                activeIndex == 0 && "bg-primary"
              )}
            >
              <Icon size="lg" className="text-white" as={Map} />
              <Heading className={cn(" text-md font-bold text-white")}>
                Map
              </Heading>
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => {
                onTabChange(1);
              }}
              className={cn(
                " py-3 bg-background-muted px-4 rounded-3xl flex-row gap-1 items-center",
                activeIndex == 1 && "bg-primary"
              )}
            >
              <Icon size="lg" className="text-white" as={ListOrdered} />
              <Heading className={cn(" text-md font-bold text-white")}>
                List
              </Heading>
            </AnimatedPressable>
          </View>
          <View className=" items-center min-w-6 gap-6">
            {activeIndex == 0 && (
              <AnimatedPressable
                className=" p-4 flex-row gap-2 items-center justify-center rounded-full bg-background-muted/70"
                onPress={() => {}}
              >
                <Icon as={Layers2} size="xl" />
              </AnimatedPressable>
            )}
            <AnimatedPressable
              className={cn(
                " p-4 flex-row gap-2 items-center justify-center rounded-full bg-background-muted/70",
                isLocation && "bg-primary"
              )}
              onPress={async () => useMyLocation()}
            >
              <Icon as={MapPin} size="xl" />
            </AnimatedPressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default memo(SearchTabs);
