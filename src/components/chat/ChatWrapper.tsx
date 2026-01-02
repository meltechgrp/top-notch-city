import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import ChatRoom from "@/components/chat/ChatRoom";
import Platforms from "@/constants/Plaforms";
import { withObservables } from "@nozbe/watermelondb/react";
import { chatCollection } from "@/db/collections";
import { Q } from "@nozbe/watermelondb";
import { Chat } from "@/db/models/messages";

interface ChatWrapperProps {
  chats: Chat[];
  chatId: string;
}

function ChatWrapper({ chats }: ChatWrapperProps) {
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        // maxHeight: 600,
      }}
      behavior={"padding"}
      keyboardVerticalOffset={Platforms.isIOS() ? 100 : 80}
    >
      <ChatRoom
        chat={chats[0]}
        ChatRoomFooterProps={{
          placeholder: "Write a message",
          defaultText: "",
        }}
      />
    </KeyboardAvoidingView>
  );
}

const enhance = withObservables(["chatId"], ({ chatId }) => {
  return {
    chats: chatCollection
      .query(Q.where("server_chat_id", chatId), Q.take(1))
      .observe(),
  };
});

export default enhance(ChatWrapper);
