import { cn } from "@/lib/utils";
import { View } from "react-native";
import { Icon, Text } from "../ui";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { Layers2, MapPin } from "lucide-react-native";
import { memo } from "react";

type IProps = {
  total?: number;
  isLocation?: boolean;
  loading?: boolean;
  useMyLocation: () => Promise<void>;
};
function SearchTabs(props: IProps) {
  const { total = 0, useMyLocation, isLocation, loading } = props;
  return (
    <View className={cn("w-full absolute left-0 bottom-4 right-0 z-50")}>
      <SafeAreaView edges={["bottom"]}>
        <View className="flex-row justify-between items-end px-4">
          <View className=" bg-background-muted/60 py-2 px-4 rounded-full">
            <Text>{total} results</Text>
          </View>
          <View className=" items-center gap-6">
            <AnimatedPressable
              className=" p-5 flex-row gap-2 items-center justify-center rounded-full bg-background-muted"
              onPress={() => {}}
            >
              <Icon as={Layers2} size="xl" />
            </AnimatedPressable>
            <AnimatedPressable
              className={cn(
                " p-5 flex-row gap-2 items-center justify-center rounded-full bg-background-muted",
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
