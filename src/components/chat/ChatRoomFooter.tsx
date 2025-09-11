import { ChatRoomMessageProps } from "@/components/chat/ChatRoomMessage";
import Editor, { EditorComponentRefHandle } from "@/components/custom/Editor";
import { guidGenerator } from "@/lib/utils";
import { useStore } from "@/store";
import { ImagePickerAsset } from "expo-image-picker";
import React from "react";
import { View } from "react-native";

type Props = View["props"] & {
  chatId: string;
  onPost: (data: Message, isEdit: boolean) => void;
  placeholder?: string;
  defaultText?: string;
  activeQuoteMsg: ChatRoomMessageProps["message"] | undefined;
  clearActiveQuoteMsg: () => void;
  isEditing: boolean;
  receiver: ReceiverInfo;
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
    const me = useStore((s) => s.me);
    function onSubmit({
      text,
      files,
    }: {
      text: string;
      files: ImagePickerAsset[];
    }) {
      if (me) {
        const tempId = guidGenerator();
        const mock: Message = {
          message_id: isEditing ? selectedMessage?.message_id! : tempId,
          created_at: new Date().toString(),
          content: text,
          sender_info: {
            id: me.id,
          },
          isMock: true,
          status: "pending",
          file_data: files?.map((f) => ({
            file_id: guidGenerator(),
            file_url: f.uri,
            file_type: "image",
            file_name: "image",
          })),
          read: false,
        };
        onPost(mock, isEditing);
        clearActiveQuoteMsg();
      }
    }
    return (
      <View>
        <Editor
          chatId={chatId}
          headerComponent={null}
          onSend={onSubmit}
          placeholder={placeholder}
          className={className}
          autoFocus={false}
          value={props.defaultText}
          ref={ref}
          noMedia={isEditing}
        />
      </View>
    );
  }
);

export default ChatRoomFooter;
