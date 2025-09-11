import { cn } from "@/lib/utils";

import { Pressable, View } from "react-native";
import { Icon, Text } from "../ui";
import { MessageCircleMore } from "lucide-react-native";

type CreateButtonProps = {
  onPress: () => void;
  className?: string;
  total?: number;
};

function CreateButton({ total = 0, ...props }: CreateButtonProps) {
  const exceeds9 = total > 9;
  const _count = exceeds9 ? "9+" : total;
  return (
    <View className={cn("absolute bottom-16 right-3", props.className)}>
      <Pressable
        className="bg-primary/80 relative rounded-2xl p-1 flex w-16 h-16 flex-row items-center justify-center z-30 shadow "
        accessibilityRole="button"
        accessibilityLabel="Create"
        onPress={props.onPress}
      >
        <Icon size="xl" as={MessageCircleMore} className="text-white" />
        {total ? (
          <View className=" absolute bg-background-muted rounded-full px-1.5 top-1 z-50 right-1">
            <Text className="text-sm font-bold">{_count}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

export default CreateButton;
