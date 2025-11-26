import { cn } from "@/lib/utils";
import { TouchableOpacity, View } from "react-native";
import { Heading } from "@/components/ui";
type IProps = {
  currentPage: number;
  setCurrentPage: (val: number) => void;
  tabs: string[];
};
export function ActivitiesTabs(props: IProps) {
  const { currentPage, setCurrentPage, tabs } = props;
  return (
    <View className={cn("w-full h-12")}>
      <View className="flex-row justify-center relative items-center">
        <View className="flex-row flex-1 justify-center py-1">
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setCurrentPage(index);
              }}
              className={cn(
                " px-4 py-2 border-b border-transparent flex-row gap-1 items-center",
                currentPage === index && "border-b-primary"
              )}
            >
              <Heading
                className={cn(
                  " text-md text-typography/80",
                  currentPage === index && "text-white"
                )}
              >
                {tab}
              </Heading>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
