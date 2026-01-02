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
import {
  generateMediaUrl,
  generateMediaUrlSingle,
  getImageUrl,
} from "@/lib/api";
import { hapticFeed } from "@/components/HapticTab";
import { MessageStatusIcon } from "@/components/chat/MessageStatus";
import { router } from "expo-router";
import { RotateCcw } from "lucide-react-native";
import QuoteMessage from "@/components/chat/ChatRoomQuoteMessage";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { MiniVideoPlayer } from "@/components/custom/MiniVideoPlayer";
import { Message, MessageFile } from "@/db/models/messages";
import { withObservables } from "@nozbe/watermelondb/react";
import { messageCollection, propertiesCollection } from "@/db/collections";
import { Q } from "@nozbe/watermelondb";
import { Property } from "@/db/models/properties";

export type ChatRoomMessageProps = View["props"] & {
  me: Account;
  message: Message;
  files: MessageFile[];
  property: Property[];
  quotes: Message[];
  onLongPress: (message: Message) => void;
  isDeleting?: boolean;
  resendMessage?: (msg: Message) => void;
};
function ChatRoomMessage(props: ChatRoomMessageProps) {
  const {
    me,
    onLongPress,
    isDeleting,
    message,
    resendMessage,
    files,
    property: [property],
    quotes: [quote],
    ...others
  } = props;
  const images = useMemo(
    () =>
      files?.map((item) => ({
        id: item.id,
        url: item.url,
        media_type: item.file_type?.toLowerCase(),
      })),
    [files]
  ) as Media[];
  const isMine = React.useMemo(
    () => message.server_sender_id === me?.id,
    [me, message]
  );
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
        {!isMine && !message?.deleted_at && message?.is_edited && (
          <Text className="text-[10px] text-typography">Edited</Text>
        )}
        {!isMine && message?.deleted_at && (
          <Text className="text-[10px] text-typography">Deleted</Text>
        )}
        <Text className="text-xs text-typography/70">{formatedTime}</Text>
        {isMine && <MessageStatusIcon status={message.status} />}
      </View>
    ),
    [formatedTime, message.content]
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
              <View
                className={cn(
                  "gap-1 flex-row flex-wrap ",
                  isMine ? "items-end" : "items-start"
                )}
              >
                {chunk(images, 2).map((row, i) => (
                  <View key={i} className="flex-row gap-1">
                    {row.map((item, i) => {
                      const isVideo = item.media_type === "VIDEO";
                      return (
                        <View
                          key={item.id}
                          className={cn(["rounded-2xl mb-1 flex-1 h-40"])}
                        >
                          <ProfileImageTrigger
                            image={images}
                            index={i}
                            className="flex-1"
                          >
                            {isVideo ? (
                              <MiniVideoPlayer
                                uri={generateMediaUrlSingle(item.url)}
                                rounded
                                canPlay
                                autoPlay={false}
                                showPlayBtn
                              />
                            ) : (
                              <Image
                                source={{
                                  uri: generateMediaUrlSingle(item.url),
                                  cacheKey: item.id,
                                }}
                                rounded
                              />
                            )}
                          </ProfileImageTrigger>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            ) : null}
            {property && (
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
                        propertyId: property.slug!,
                      },
                    })
                  }
                  className={cn(["rounded-2xl mb-1 flex-1 h-40"])}
                >
                  {property.thumbnail && (
                    <Image
                      source={{
                        uri: generateMediaUrlSingle(property.thumbnail),
                        cacheKey: property.property_server_id,
                      }}
                      rounded
                      alt={"property"}
                    />
                  )}
                </Pressable>
              </View>
            )}

            {!!quote && <QuoteMessage quote={quote} me={me} />}
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
          {message.status == "failed" && (
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

const enhance = withObservables(
  ["message"],
  ({ message }: { message: Message }) => ({
    message: message.observe(),
    files: message.files,
    property: propertiesCollection.query(
      Q.where("property_server_id", message.property_server_id || null),
      Q.take(1)
    ),
    quotes: messageCollection.query(
      Q.where("server_message_id", message.reply_to_message_id || null),
      Q.take(1)
    ),
  })
);

export default enhance(ChatRoomMessage);
