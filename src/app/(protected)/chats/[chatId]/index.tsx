import { router, useLocalSearchParams } from "expo-router";
import { useBackHandler } from "@react-native-community/hooks";
import ChatWrapper from "@/components/chat/ChatWrapper";

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams<{
    chatId: string;
  }>();
  useBackHandler(() => {
    router.replace("/(protected)/(tabs)/chats");
    return true;
  });
  return <ChatWrapper chatId={chatId} />;
}
