import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Avatar, AvatarBadge, AvatarImage, Text } from "../ui";
import logo from "@/assets/images/notification.png";
import NotificationItemWrapper from "./NotificationItemWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification, markAsRead } from "@/actions/notification";
import { format } from "date-fns";
import { useMe } from "@/hooks/useMe";

export default function PropertyAcceptedNotificationComponent({
  data,
}: {
  data: UserNotification;
}) {
  const { title, message, is_read, id, entity_id } = data;
  const { me } = useMe();
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
  const isAdmin = useMemo(() => me?.role == "admin", [me]);
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
        onPress={async () => {
          await mutateAsync({
            id,
          });
          isAdmin
            ? router.push({
                pathname: "/admin/pending",
                params: { propertyId: data.entity_id },
              })
            : router.push({
                pathname: "/(protected)/property/[propertyId]",
                params: { propertyId: data.entity_id },
              });
        }}
        className="p-4 rounded-2xl border-l border-gray-500 min-h-[6rem] bg-background-muted "
      >
        <View className="flex-1 gap-1 justify-center">
          <View className="flex-row gap-2 items-start">
            <Avatar size="xs" className="ios:mt-[2px]">
              <AvatarImage source={logo} />
              {!is_read && (
                <AvatarBadge className="bg-primary -top-2 -right-1" size="md" />
              )}
            </Avatar>
            <View className="gap-1 pr-1 flex-row justify-between flex-1">
              <Text size="md" numberOfLines={1} className="">
                {title}
              </Text>
              <Text size="sm">
                {format(new Date(data.created_at), "hh:mm")}
              </Text>
            </View>
          </View>
          <Text numberOfLines={2} className="text-sm font-light">
            {message}
          </Text>
        </View>
      </Pressable>
    </NotificationItemWrapper>
  );
}
