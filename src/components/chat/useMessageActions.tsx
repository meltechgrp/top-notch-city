import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { deleteChatMessage } from "@/actions/message";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useChatStore } from "@/store/chatStore";

type Args = {
  focusEditor: () => void;
  setEditorText: (text: string) => void;
  chatId: string;
};

export default function useMessageActions(args: Args) {
  const { focusEditor, setEditorText, chatId } = args;
  const { deleteChatMessage: deleteMessage } = useChatStore.getState();
  function invalidate(chatId: string, messageId: string, soft: boolean) {
    deleteMessage(chatId, messageId, soft);
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
  async function handleDelete() {
    if (!selectedMessage?.message_id) return;

    Alert.alert("Confirm delete", "Delete message for yourself in this chat?", [
      {
        text: "Cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await mutateAsync(
            {
              message_id: selectedMessage.message_id,
              delete_for_everyone: false,
            },
            {
              onSuccess() {
                showErrorAlert({
                  alertType: "success",
                  duration: 3000,
                  title: "Message deleted.",
                });
                invalidate(chatId, selectedMessage.message_id, true);
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
            }
          );
        },
      },
    ]);
  }
  async function handleDeleteAll() {
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
            await mutateAsync(
              {
                message_id: selectedMessage.message_id,
                delete_for_everyone: true,
              },
              {
                onSuccess() {
                  showErrorAlert({
                    alertType: "success",
                    duration: 3000,
                    title: "Message deleted.",
                  });
                  invalidate(chatId, selectedMessage.message_id, true);
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
              }
            );
          },
        },
      ]
    );
  }
  const [isEditing, setIsEditing] = useState(false);

  async function handleEdit() {
    setIsEditing(true);
    focusEditor();
    setEditorText(selectedMessage?.content || "");
  }
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
    handleDeleteAll,
  };
}
