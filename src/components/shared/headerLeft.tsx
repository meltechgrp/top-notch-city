import { router } from "expo-router";
import { Pressable } from "react-native";
import { Icon } from "../ui";
import { ChevronLeftIcon } from "lucide-react-native";

export default function headerLeft(handler?: () => void) {
  return (props: any) => (
    <Pressable
      onPress={() => {
        if (router.canGoBack()) handler ? handler() : router.back();
        else router.push("/");
      }}
      style={[[props?.style]]}
      className="py-1 flex-row items-center pr-2 android:pr-4"
    >
      <Icon className=" w-8 h-8" as={ChevronLeftIcon} />
    </Pressable>
  );
}
