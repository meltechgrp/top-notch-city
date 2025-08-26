import { ChatRoomMessageProps } from "@/components/chat/ChatRoomMessage";
import Editor, { EditorComponentRefHandle } from "@/components/custom/Editor";
import { useStore } from "@/store";
import { ImagePickerAsset } from "expo-image-picker";
import React from "react";
import { TextInput, View } from "react-native";

type Props = View["props"] & {
  chatId: string;
  onPost: (
    data: {
      text: string;
      files: ImagePickerAsset[];
      id?: string;
    },
    isEdit: boolean
  ) => void;
  placeholder?: string;
  defaultText?: string;
  activeQuoteMsg: ChatRoomMessageProps["message"] | undefined;
  clearActiveQuoteMsg: () => void;
  isEditing: boolean;
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
    } = props;
    const me = useStore((s) => s.me);
    function onSubmit(data: { text: string; files: ImagePickerAsset[] }) {
      if (me) {
        onPost({ ...data, id: selectedMessage?.message_id }, isEditing);
        clearActiveQuoteMsg();
      }
    }

    return (
      <View>
        <Editor
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
