import { cn } from "@/lib/utils";
import { View } from "react-native";
import { Heading } from "../ui";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { memo } from "react";

type IProps = {
  currentPage: number;
  setCurrentPage: (val: number) => void;
  tabs: string[];
};
function ReelTabs(props: IProps) {
  const { currentPage, setCurrentPage, tabs } = props;
  return (
    <View
      className={cn("w-full absolute top-4 android:top-12 left-0 right-0 z-50")}
    >
      <SafeAreaView edges={["top"]}>
        <View className="flex-row self-center p-1">
          {tabs.map((tab, index) => (
            <AnimatedPressable
              key={tab}
              onPress={() => {
                setCurrentPage(index);
              }}
              className={cn(
                " px-4 rounded-full py-2  flex-row gap-1 items-center",
                currentPage === index && "bg-primary"
              )}
            >
              <Heading
                className={cn(
                  " text-md",
                  currentPage === index && "text-white"
                )}
              >
                {tab}
              </Heading>
            </AnimatedPressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default memo(ReelTabs);
