import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import { showSnackbar } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChatMessage } from "@/actions/message";

type Args = {
  focusEditor: () => void;
  setEditorText: (text: string) => void;
  chatId: string;
};

export default function useMessageActions(args: Args) {
  const { focusEditor, setEditorText, chatId } = args;
  const queryClient = useQueryClient();
  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: ["messages", chatId],
    });
  }
  const { mutateAsync } = useMutation({
    mutationFn: deleteChatMessage,
  });
  const [selectedMessage, setSelectedMessage] = useState<Message>();
  const [activeQuoteMessage, setActiveQuoteMessage] = useState<Message>();

  const [showMessageActionsModal, setShowMessageActionsModal] = useState(false);
  function handleMessageLongPress(message: Message) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMessageActionsModal(true);
    setSelectedMessage(message);
  }

  function handleReply() {
    setActiveQuoteMessage(selectedMessage);
    focusEditor();
  }

  const [isDeletingMessageId, setIsDeletingMessageId] = useState<string | null>(
    null
  );
  async function handleDelete(onDone: (message: Message) => void) {
    if (!selectedMessage?.message_id) return;

    Alert.alert(
      "Confirm delete",
      "Delete message for yourself and others in this chat?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            await mutateAsync(selectedMessage.message_id, {
              onSuccess() {
                onDone(selectedMessage);
                showSnackbar({
                  type: "success",
                  duration: 3000,
                  message: "Message deleted.",
                });
                invalidate();
                setIsDeletingMessageId(null);
              },
              onError: (err) => {
                showSnackbar({
                  type: "error",
                  duration: 3000,
                  message: err.message || "Could not delete message!",
                });
                setIsDeletingMessageId(null);
              },
            });
          },
        },
      ]
    );
  }

  async function handleEdit() {
    setIsEditing(true);
    focusEditor();
    setEditorText(selectedMessage?.content || "");
  }
  const [isEditing, setIsEditing] = useState(false);
  function exitEditMode() {
    setIsEditing(false);
    setEditorText("");
  }

  return {
    selectedMessage,
    activeQuoteMessage,
    setActiveQuoteMessage,
    showMessageActionsModal,
    setShowMessageActionsModal,
    handleReply,
    handleMessageLongPress,
    handleDelete,
    isDeletingMessageId,
    isEditing,
    exitEditMode,
    handleEdit,
  };
}
