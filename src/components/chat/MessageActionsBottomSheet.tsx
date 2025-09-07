import { ChatRoomMessageProps } from "@/components/chat/ChatRoomMessage";
import withRenderVisible from "@/components/shared/withRenderOpen";
import { cn } from "@/lib/utils";
import { ToastAndroid, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Platforms from "@/constants/Plaforms";
import { useStore } from "@/store";
import { useMemo } from "react";
import BottomSheetPlainTwo from "@/components/shared/BottomSheetPlainTwo";
import Layout from "@/constants/Layout";
import { Copy, Edit, Reply, Trash } from "lucide-react-native";
import { Icon, Text, Pressable } from "@/components/ui";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  handleReply: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
  message?: ChatRoomMessageProps["message"];
};

function MessageActionsBottomSheet(props: Props) {
  const { visible, onDismiss, handleReply, handleDelete, handleEdit, message } =
    props;
  const me = useStore((s) => s.me);
  const isMine = me?.id === message?.sender_info?.id;

  const messageActions = useMemo(() => {
    return [
      ...(message?.content && message.content.trim().length > 0
        ? [
            {
              label: "Copy",
              value: "copy" as const,
              icon: <Icon as={Copy} />,
            },
          ]
        : []),
      // {
      //   label: "Reply",
      //   value: "reply" as const,
      //   icon: <Icon as={Reply} />,
      // },
      ...(isMine && message?.content && message.content.trim().length > 0
        ? [
            {
              label: "Edit",
              value: "edit" as const,
              icon: <Icon as={Edit} />,
            },
          ]
        : []),
      ...(isMine
        ? [
            {
              label: "Delete",
              value: "delete" as const,
              icon: <Icon as={Trash} />,
              destructive: true,
            },
          ]
        : []),
    ];
  }, [isMine, message]);

  const handleCopy = async () => {
    if (message?.content) {
      await Clipboard.setStringAsync(message.content);
      ToastAndroid.show("Message copied to clipboard", 1500);
      Platforms.isIOS() &&
        showErrorAlert({
          title: "Message copied to clipboard",
          alertType: "success",
          duration: 1500,
        });
    }
  };

  const handleActionPress = (action: (typeof messageActions)[0]) => {
    switch (action.value) {
      // case "reply":
      //   handleReply();
      //   break;

      case "copy":
        handleCopy();
        break;

      case "delete":
        handleDelete();
        break;

      case "edit":
        handleEdit();

      default:
        break;
    }

    onDismiss();
  };

  return (
    <BottomSheetPlainTwo
      visible={visible}
      onDismiss={onDismiss}
      title="Message Actions"
    >
      <View style={{ height: Layout.window.height / 4 }}>
        {messageActions.map((action, i) => (
          <Pressable
            key={action.value}
            both
            onPress={() => handleActionPress(action)}
            className={cn(
              "flex-row items-center gap-2 py-4 border-outline-100 px-8 ",
              i !== 0 && "border-t border-outline"
            )}
          >
            {action.icon}
            <Text
              className={cn("text-sm", action.destructive && "text-red-500")}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </BottomSheetPlainTwo>
  );
}

export default withRenderVisible(MessageActionsBottomSheet);
