import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Avatar, AvatarBadge, AvatarImage, Text } from "../ui";
import logo from "@/assets/images/icon.png";
import NotificationItemWrapper from "./NotificationItemWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification, markAsRead } from "@/actions/notification";

export default function PropertyAcceptedNotificationComponent({
  data,
}: {
  data: UserNotification;
}) {
  const { title, message, is_read, id } = data;
  const query = useQueryClient();
  function invalidate() {
    query.invalidateQueries({
      queryKey: ["notifications"],
    });
  }
  const { mutateAsync } = useMutation({
    mutationFn: markAsRead,
    onSuccess: invalidate,
  });
  const { mutateAsync: mutateAsync2 } = useMutation({
    mutationFn: deleteNotification,
    onSuccess: invalidate,
  });
  return (
    <NotificationItemWrapper
      isRead={is_read}
      onRead={async () =>
        await mutateAsync({
          id,
        })
      }
      onDelete={async () => await mutateAsync2({ id })}
    >
      <Pressable
        // onPress={() =>
        // 	router.push({
        // 		pathname: '/(protected)/property/[propertyId]',
        // 		params: { propertyId: data.propertyId },
        // 	})
        // }
        className="p-4 rounded-2xl min-h-[6rem] mb-1 bg-background-info "
      >
        <View className="flex-1 gap-1 justify-center">
          <View className="flex-row gap-2 items-start">
            <Avatar size="xs" className="ios:mt-[2px]">
              <AvatarImage source={logo} />
              {!is_read && (
                <AvatarBadge className="bg-primary -top-2 -right-1" size="md" />
              )}
            </Avatar>
            <View className="gap-1 pr-1 flex-1">
              <Text size="md" numberOfLines={1} className="">
                {title}
              </Text>
              <Text numberOfLines={2} className="text-sm font-light">
                {message}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </NotificationItemWrapper>
  );
}
