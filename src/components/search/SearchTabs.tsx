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
          <View className=" bg-background-muted/70 py-2 px-4 rounded-full">
            {loading ? (
              <Text className="text-xs">Searching...</Text>
            ) : (
              <Text>{total} results</Text>
            )}
          </View>
          <AnimatedPressable
            onPress={() => {
              onTabChange(activeIndex == 0 ? 1 : 0);
            }}
            className={cn(
              " rounded-full py-3 border border-outline bg-background px-8 flex-row gap-1 items-center"
            )}
          >
            <Icon
              size="lg"
              className="text-white"
              as={activeIndex == 1 ? Map : ListOrdered}
            />
            <Heading className={cn(" text-md font-bold text-white")}>
              {activeIndex == 1 ? "Map" : "List"}
            </Heading>
          </AnimatedPressable>
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
