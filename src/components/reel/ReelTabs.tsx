import { cn } from "@/lib/utils";
import { View } from "react-native";
import { Heading, Icon, Pressable } from "../ui";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { memo } from "react";
import { Search } from "lucide-react-native";
import { router } from "expo-router";

type IProps = {
  currentPage: number;
  setCurrentPage: (val: number) => void;
  tabs: string[];
};
function ReelTabs(props: IProps) {
  const { currentPage, setCurrentPage, tabs } = props;
  return (
    <View
      className={cn("w-full absolute top-2 android:top-8 left-0 right-0 z-50")}
    >
      <SafeAreaView edges={["top"]}>
        <View className="flex-row justify-center relative items-center px-4">
          <View className="flex-row flex-1 justify-center p-1">
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
          <Pressable onPress={() => router.push("/explore")} className=" pr-2">
            <Icon as={Search} className="w-6 h-6" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default memo(ReelTabs);
