import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChatMessage } from "@/actions/message";
import { showErrorAlert } from "@/components/custom/CustomNotification";

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
                showErrorAlert({
                  alertType: "success",
                  duration: 3000,
                  title: "Message deleted.",
                });
                invalidate();
                setIsDeletingMessageId(null);
              },
              onError: (err) => {
                showErrorAlert({
                  alertType: "error",
                  duration: 3000,
                  title: err.message || "Could not delete message!",
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
