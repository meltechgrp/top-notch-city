import { Text, View } from "@/components/ui";
import { Pressable } from "react-native";
import { format } from "date-fns";

type Props = {
  activity: Activity;
  onPress: (activity: Props["activity"]) => void;
};

export default function ActivityListItem({ activity, onPress }: Props) {
  return (
    <>
      <Pressable
        onPress={() => onPress(activity)}
        className={
          "flex-row items-center px-4 py-3 bg-background-muted rounded-xl"
        }
      >
        <View className="flex-1 gap-1.5">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-medium capitalize">
              {activity.action}
            </Text>
            <Text className="text-xs text-primary">
              {format(new Date(activity.created_at), "hh:mm - dd MMM yy")}
            </Text>
          </View>
          <Text numberOfLines={1} className="text-sm text-typography/80">
            {activity.description}
          </Text>
        </View>
      </Pressable>
    </>
  );
}
