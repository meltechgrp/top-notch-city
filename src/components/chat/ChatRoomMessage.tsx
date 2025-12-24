import { Icon, Image, Text } from "@/components/ui";
import { chunk } from "lodash-es";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/lib/utils";
import React, { useMemo } from "react";
import {
  Keyboard,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import PostTextContent from "./PostTextContent";
import { generateMediaUrl } from "@/lib/api";
import { useLayout } from "@react-native-community/hooks";
import { hapticFeed } from "@/components/HapticTab";
import { MessageStatusIcon } from "@/components/chat/MessageStatus";
import { router } from "expo-router";
import { RotateCcw } from "lucide-react-native";
import QuoteMessage from "@/components/chat/ChatRoomQuoteMessage";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";

export type ChatRoomMessageProps = View["props"] & {
  me: Account;
  sender?: string;
  message: Message;
  onLongPress: (message: Message) => void;
  isDeleting?: boolean;
  resendMessage?: (msg: Message) => void;
};
export default function ChatRoomMessage(props: ChatRoomMessageProps) {
  const {
    me,
    sender,
    onLongPress,
    isDeleting,
    message,
    resendMessage,
    ...others
  } = props;
  const { width, onLayout } = useLayout();
  const images = useMemo(
    () =>
      message?.file_data?.map((item) => ({
        id: item.file_id,
        url: item.file_url,
        mediaType: "IMAGE",
      })),
    [message]
  ) as Media[];
  const isMine = React.useMemo(() => message.sender_info?.id === me?.id, []);
  const formatedTime = React.useMemo(
    () =>
      formatMessageTime(message.created_at as unknown as Date, {
        onlyTime: true,
      }),
    []
  );

  const messageInfo = React.useMemo(
    () => (
      <View
        className={cn(
          "flex-row items-center pb-1 px-2 gap-1",
          isMine ? "justify-end" : "justify-start"
        )}
      >
        {!isMine && !message?.deleted_at && message?.updated_at && (
          <Text className="text-[10px] text-typography">Edited</Text>
        )}
        {!isMine && message?.deleted_at && (
          <Text className="text-[10px] text-typography">Deleted</Text>
        )}
        <Text className="text-xs text-typography/70">{formatedTime}</Text>
        {isMine && <MessageStatusIcon status={message.status} />}
      </View>
    ),
    [formatedTime, message.content, message.status, message.updated_at]
  );
  const pressProps = {
    onLongPress: () => {
      hapticFeed();
      if (message.status === "pending") {
        return;
      }
      onLongPress(message);
    },
    delayLongPress: 400,
  };

  const dismissKeyboard = (event: any) => {
    const target = event?.target;

    if (target) {
      const currentlyFocusedInput = TextInput.State.currentlyFocusedInput?.();

      if (currentlyFocusedInput && target === currentlyFocusedInput) {
        return;
      }
    }

    Keyboard.dismiss();
  };

  return (
    <>
      <View className="flex-row w-full gap-2 items-center">
        <Pressable
          {...pressProps}
          {...others}
          onPress={dismissKeyboard}
          onLayout={onLayout}
          className={cn([
            " px-4 w-full flex-row py-2",
            isDeleting && "opacity-30",
          ])}
        >
          {isMine && <View className="flex-1" />}
          <View
            className={cn(
              "max-w-[80%] p-1 rounded-xl",
              isMine ? "bg-gray-600" : "bg-background-muted",
              isMine ? "items-end" : "items-start"
            )}
          >
            {images ? (
              <ProfileImageTrigger
                image={images}
                className={cn(
                  "gap-1 flex-row flex-wrap ",
                  isMine ? "items-end" : "items-start"
                )}
              >
                {chunk(images, 2).map((row, i) => (
                  <View key={i} className="flex-row gap-1">
                    {row.map((item, i) => (
                      <Pressable
                        key={item.id}
                        className={cn(["rounded-2xl mb-1 flex-1 h-40"])}
                      >
                        <Image
                          source={{
                            uri: message.isMock
                              ? item.url
                              : generateMediaUrl({
                                  url: item.url,
                                  mediaType: "IMAGE",
                                  id: item.id,
                                }).uri,
                            cacheKey: item.id,
                          }}
                          rounded
                          alt={"chat image"}
                        />
                      </Pressable>
                    ))}
                  </View>
                ))}
              </ProfileImageTrigger>
            ) : null}
            {message?.property_info && (
              <View
                className={cn(
                  "gap-1 flex-row flex-wrap ",
                  isMine ? "items-end" : "items-start"
                )}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(protected)/property/[propertyId]",
                      params: {
                        propertyId: message.property_info?.id!,
                      },
                    })
                  }
                  className={cn(["rounded-2xl mb-1 flex-1 h-40"])}
                >
                  <Image
                    source={{
                      uri: generateMediaUrl({
                        url: message.property_info?.image_url,
                        mediaType: "IMAGE",
                        id: message.property_info?.id!,
                      }).uri,
                    }}
                    rounded
                    alt={"property"}
                  />
                </Pressable>
              </View>
            )}

            {!!message?.reply_to && (
              <QuoteMessage quote={message.reply_to as any} />
            )}
            <Pressable
              className={cn([
                "rounded-lg  justify-end overflow-hidden gap-1",
                // isMine
                //   ? "bg-primary  active:bg-primary"
                //   : "bg-background-muted active:bg-bg-background-info",
              ])}
              {...pressProps}
            >
              {message?.content && (
                <View className="px-1">
                  <PostTextContent
                    text={message.content || ""}
                    isMine={isMine}
                  />
                </View>
              )}
              {messageInfo}
            </Pressable>
            {!isMine && <View className="flex-1" />}
          </View>
          {message.status == "error" && (
            <TouchableOpacity
              onPress={() => {
                if (resendMessage) {
                  resendMessage(message);
                }
              }}
              className="pr-2 w-6 pl-4 justify-center items-center"
            >
              <Icon as={RotateCcw} className="text-primary" />
            </TouchableOpacity>
          )}
        </Pressable>
      </View>
    </>
  );
}
