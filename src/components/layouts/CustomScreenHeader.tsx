import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { ChevronLeftIcon, Icon } from "../ui";

type Props = {
  headerCenterContent: React.ReactNode;
  headerRightContent?: React.ReactNode;
};
export default function CustomScreenHeader(props: Props) {
  const { headerCenterContent, headerRightContent } = props;

  return (
    <View className="flex-row items-center justify-between w-full h-[48px] border-b border-outline overflow-hidden">
      <View className="flex-row items-center gap-x-4">
        <Pressable
          onPress={() => {
            router.push("/messages");
          }}
          className="py-2 flex-row items-center pl-4 pr-3"
        >
          <Icon size="xl" as={ChevronLeftIcon} />
        </Pressable>
        <View className="flex-1">{headerCenterContent}</View>
        <View className="px-4">{headerRightContent}</View>
      </View>
    </View>
  );
}
