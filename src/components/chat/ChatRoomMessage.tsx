import { Icon, Image, Text } from "@/components/ui";
import { chunk } from "lodash-es";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import { Keyboard, TextInput, View, Pressable } from "react-native";
import PostTextContent from "./PostTextContent";
import { generateMediaUrl } from "@/lib/api";
import { PropertyModalMediaViewer } from "@/components/modals/property/PropertyModalMediaViewer";
import { useLayout } from "@react-native-community/hooks";
import { hapticFeed } from "@/components/HapticTab";
import { MessageStatusIcon } from "@/components/chat/MessageStatus";
import { router } from "expo-router";

export type ChatRoomMessageProps = View["props"] & {
  me: Me;
  sender?: string;
  message: Message;
  onLongPress: (message: Message) => void;
  isDeleting?: boolean;
};
export default function ChatRoomMessage(props: ChatRoomMessageProps) {
  const { me, sender, onLongPress, isDeleting, message, ...others } = props;
  const { width, onLayout } = useLayout();
  const images = useMemo(
    () =>
      message.file_data.map((item) => ({
        id: item.file_id,
        url: item.file_url,
        media_type: "IMAGE",
      })),
    [message]
  ) as Media[];
  const isMine = React.useMemo(() => message.sender_info?.id === me.id, []);
  const [visible, setVisible] = useState(false);
  const formatedTime = React.useMemo(
    () =>
      formatMessageTime(message.created_at as unknown as Date, {
        onlyTime: true,
      }),
    []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const messageInfo = React.useMemo(
    () => (
      <View
        className={cn(
          "flex-row items-center pb-1 px-2",
          isMine ? "justify-end" : "justify-start"
        )}
      >
        {message.updated_at && (
          <Text className="text-[10px] text-typography mr-1">Edited</Text>
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

  const handleOpen = (index: number) => {
    hapticFeed(true);
    setSelectedIndex(index);
    setVisible(true);
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
          {message.file_data?.length ? (
            <View
              className={cn(
                "gap-1 flex-row flex-wrap ",
                isMine ? "items-end" : "items-start"
              )}
            >
              {chunk(message.file_data, 2).map((row, i) => (
                <View key={i} className="flex-row gap-1">
                  {row.map((item, i) => (
                    <Pressable
                      key={item.file_id}
                      onPress={() => handleOpen(i)}
                      className={cn(["rounded-2xl mb-1 flex-1 h-40"])}
                    >
                      <Image
                        source={{
                          uri: message.isMock
                            ? item.file_url
                            : generateMediaUrl({
                                url: item.file_url,
                                media_type: "IMAGE",
                                id: item.file_id,
                              }).uri,
                          cacheKey: item.file_id,
                        }}
                        rounded
                        alt={item.file_name}
                      />
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>
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
                      media_type: "IMAGE",
                      id: message.property_info?.id!,
                    }).uri,
                  }}
                  rounded
                  alt={"property"}
                />
              </Pressable>
            </View>
          )}
          <Pressable
            // className={cn([
            //   "rounded-lg overflow-hidden gap-2",
            //   isMine
            //     ? "bg-primary  active:bg-primary"
            //     : "bg-background-muted active:bg-bg-background-info",
            // ])}
            {...pressProps}
          >
            {message?.content && (
              <View className="px-1 mb-1">
                <PostTextContent text={message.content || ""} isMine={isMine} />
              </View>
            )}
          </Pressable>
          {messageInfo}
          {!isMine && <View className="flex-1" />}
        </View>
      </Pressable>
      <PropertyModalMediaViewer
        width={width}
        media={images}
        factor={1.7}
        showImages
        stackMode={false}
        visible={visible}
        contentFit="cover"
        setVisible={setVisible}
        selectedIndex={selectedIndex}
      />
    </>
  );
}
