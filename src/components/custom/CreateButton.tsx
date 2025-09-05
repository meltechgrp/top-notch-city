import { cn } from "@/lib/utils";

import { Pressable, View } from "react-native";
import { Icon, Text } from "../ui";
import { MessageCircleMore } from "lucide-react-native";

type CreateButtonProps = {
  onPress: () => void;
  className?: string;
  total?: number;
};

function CreateButton(props: CreateButtonProps) {
  return (
    <View className={cn("absolute bottom-16 right-3", props.className)}>
      <Pressable
        className="bg-primary/80 relative rounded-2xl p-1 flex w-16 h-16 flex-row items-center justify-center z-30 shadow "
        accessibilityRole="button"
        accessibilityLabel="Create"
        onPress={props.onPress}
      >
        <Icon size="xl" as={MessageCircleMore} className="text-white" />
        {props?.total ? (
          <View className=" absolute bg-background-muted rounded-full px-1 top-1 z-50 right-1">
            <Text className="font-bold">{props.total}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

export default CreateButton;
