import { View } from "react-native";
import { Text } from "../ui";

type PostTextContentProps = {
  text: string;
  isMine: boolean;
};

export default function PostTextContent(props: PostTextContentProps) {
  const { text, isMine } = props;
  return (
    <View className="gap-y-1">
      <Text className={isMine ? "text-white text-start" : ""} selectable>
        {text}
      </Text>
    </View>
  );
}
