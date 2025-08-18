import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Image,
  Text,
} from "@/components/ui";
// import QuoteMessage from '@/components/chat/ChatRoomQuoteMessage'
// import MediaPreviewComponent from '@/components/chat/MediaPreviewComponent'
// import PostLinkPreview from '@/components/contents/PostLinkPreview'
// import PostTextContent from '@/components/contents/PostTextContent'
// import { SplitListItemEmbedWithDataFetching } from '@/components/splits/SplitListItemEmbed'
import Layout from "@/constants/Layout";
// import { ChatMessagesQuery, ChatQuery } from '@/graphql-types/chat.queries.gql'
// import { MessageStatus } from '@/graphql-types/index.gql'
// import { MeQuery } from '@/graphql-types/queries.gql'
import { cn } from "@/lib/utils";
import { formatMessageTime, fullName } from "@/lib/utils";
import { router } from "expo-router";
import { ClockIcon, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import PostTextContent from "./PostTextContent";
import { generateMediaUrl } from "@/lib/api";

export type ChatRoomMessageProps = View["props"] & {
  me: Me;
  sender: SenderInfo | null;
  message: Message;
  onLongPress: (message: any) => void;
  isDeleting?: boolean;
};
export default function ChatRoomMessage(props: ChatRoomMessageProps) {
  const { me, sender, onLongPress, isDeleting, message, ...others } = props;
  const isMine = React.useMemo(() => message.sender_info?.id === me.id, []);
  const formatedTime = React.useMemo(
    () => formatMessageTime(message.created_at as unknown as Date),
    []
  );
  const messageInfo = React.useMemo(
    () => (
      <View
        className={cn(
          "flex-row items-end pb-1 px-2",
          isMine ? "justify-end" : "justify-start"
        )}
      >
        {/* {message.edited_at && (
          <Text className="text-[8px] text-typography/70 mr-1">Edited</Text>
        )} */}
        <Text className="text-[8px] text-typography/70">{formatedTime}</Text>
        {!message.read && (
          <ClockIcon
            width={12}
            height={12}
            className="ml-1 text-typography/70 "
          />
        )}
      </View>
    ),
    [formatedTime, message.content]
  );
  const pressProps = {
    onLongPress: () => {
      // if (message.status === 'Pending' || message.deletedAt) {
      // 	return;
      // }
      // onLongPress(message);
    },
    delayLongPress: 400,
  };

  return (
    <>
      <Pressable
        {...pressProps}
        {...others}
        className={cn([
          "w-full px-4 flex-row py-2",
          isDeleting && "opacity-30",
        ])}
      >
        {isMine && <View className="flex-1" />}
        <View
          className={cn("max-w-[80%]", isMine ? "items-end" : "items-start")}
        >
          {!isMine && (
            <View className="pb-2 flex-row items-center">
              <Avatar>
                <AvatarFallbackText>
                  {fullName(message.sender_info)}
                </AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: generateMediaUrl({
                      id: "",
                      url: message.sender_info.profile_image,
                      media_type: "IMAGE",
                    }).uri,
                  }}
                />
              </Avatar>
              <Pressable>
                <Text className="ml-2 text-sm">
                  {fullName(message.sender_info)}
                </Text>
              </Pressable>
            </View>
          )}
          {message.file_data?.length ? (
            <View
              className={cn("gap-y-1", isMine ? "items-end" : "items-start")}
            >
              {message.file_data.map((item) => (
                <View
                  key={item.file_id}
                  className={cn([
                    "rounded-2xl mb-1 w-24 h-24",
                    isMine ? "bg-primary-200" : "bg-gray-50",
                  ])}
                >
                  <Image
                    source={{
                      ...generateMediaUrl({
                        url: item.file_url,
                        media_type: "IMAGE",
                        id: item.file_id,
                      }),
                    }}
                    alt={item.file_name}
                  />
                </View>
              ))}
            </View>
          ) : null}
          <Pressable
            className={cn([
              "rounded-lg overflow-hidden gap-2",
              isMine
                ? "bg-primary  active:bg-primary"
                : "bg-background-muted active:bg-bg-background-info",
            ])}
            {...pressProps}
          >
            {message?.content && (
              <View className="p-2">
                <PostTextContent
                  text={message.content || ""}
                  // tokenizedText={message.tokenizedText as any}
                  fullText={true}
                  trimLink={false}
                  isMine={isMine}
                />
              </View>
            )}
          </Pressable>
          {messageInfo}
          {!isMine && <View className="flex-1" />}
        </View>
      </Pressable>
    </>
  );
}
