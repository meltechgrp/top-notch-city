import { messagesActions } from "@/components/chat";
import { ChatRoomMessageProps } from "@/components/chat/ChatRoomMessage";
import QuoteMessage from "@/components/chat/ChatRoomQuoteMessage";
import Editor, { EditorComponentRefHandle } from "@/components/editor";
import { User } from "@/db/models/users";
import { useMe } from "@/hooks/useMe";
import useSound from "@/hooks/useSound";
import { fullName, guidGenerator } from "@/lib/utils";
import React, { useCallback } from "react";
import { View } from "react-native";

type Props = View["props"] & {
  chatId: string;
  onPost: (isEdit: boolean) => void;
  placeholder?: string;
  defaultText?: string;
  activeQuoteMsg: ChatRoomMessageProps["message"] | undefined;
  clearActiveQuoteMsg: () => void;
  isEditing: boolean;
  receiver: User;
  selectedMessage: ChatRoomMessageProps["message"] | undefined;
};

const ChatRoomFooter = React.forwardRef<EditorComponentRefHandle, Props>(
  (props, ref) => {
    const {
      chatId,
      onPost,
      className,
      placeholder,
      activeQuoteMsg,
      clearActiveQuoteMsg,
      isEditing,
      selectedMessage,
      receiver,
    } = props;
    const { me } = useMe();

    const { playSound } = useSound();

    const { saveLocalMessage, editServerMessage } = messagesActions();
    async function onSubmit({ text, files }: { text: string; files: Media[] }) {
      if (me) {
        const tempId = guidGenerator();
        const mock: ServerMessage = {
          message_id: isEditing ? selectedMessage?.server_message_id! : tempId,
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
          content: text,
          sender_info: {
            id: me.id,
          },
          receiver_info: {
            id: receiver.server_user_id,
          },
          reply_to_message_id: activeQuoteMsg?.server_message_id,
          isMock: !isEditing,
          status: "pending",
          file_data: files?.map((f) => ({
            id: f.id,
            file_url: f.url,
            is_local: true,
            file_type: f.media_type,
          })),
        };
        await saveLocalMessage({
          data: mock,
          chatId,
          playSound: () => playSound("MESSAGE_SENT"),
        });
        if (isEditing) {
          await editServerMessage({ data: mock });
        }
        onPost(isEditing);
        clearActiveQuoteMsg();
      }
    }
    const Quote = useCallback(
      () => (
        <View className="px-4 pb-0 pt-2">
          <QuoteMessage
            quote={activeQuoteMsg!}
            forEditor={true}
            onClear={clearActiveQuoteMsg}
          />
        </View>
      ),
      [activeQuoteMsg, clearActiveQuoteMsg]
    );
    return (
      <View>
        <Editor
          chatId={chatId}
          HeaderComponent={activeQuoteMsg ? Quote : null}
          onSend={onSubmit}
          placeholder={placeholder}
          className={className}
          autoFocus={false}
          value={props.defaultText}
          ref={ref}
          fullName={fullName(receiver)}
          noMedia={isEditing}
        />
      </View>
    );
  }
);

export default ChatRoomFooter;
