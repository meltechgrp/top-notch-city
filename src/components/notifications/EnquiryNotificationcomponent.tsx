import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Avatar, AvatarBadge, AvatarImage, Icon, Text } from "../ui";
import { format } from "date-fns";
import logo from "@/assets/images/notification.png";
import NotificationItemWrapper from "./NotificationItemWrapper";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification, markAsRead } from "@/actions/notification";
import { useMe } from "@/hooks/useMe";

export default function EnquiryNotificationComponent({
  data,
}: {
  data: UserNotification;
}) {
  const { is_read, id } = data;
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
                pathname: "/admin/reports",
                params: { enquiryId: data.entity_id },
              })
            : undefined;
        }}
        className={cn(
          "p-4 min-h-[6rem] border-l border-primary rounded-2xl bg-background-muted "
        )}
      >
        <View className="flex-1 gap-1">
          <View className="flex-1 gap-1">
            <View className="flex-row gap-4 items-start">
              <Avatar size="xs" className="ios:mt-[2px]">
                <AvatarImage source={logo} />
                {!is_read && (
                  <AvatarBadge
                    className="bg-primary -top-2.5 -right-1.5"
                    size="md"
                  />
                )}
              </Avatar>
              <View className="flex-row flex-1 justify-between">
                <Text size="md" numberOfLines={1} className="">
                  {data.title}
                </Text>
                <Text size="sm">
                  {format(new Date(data.created_at), "hh:mm")}
                </Text>
              </View>
            </View>
            <Text numberOfLines={2} className="text-sm font-light">
              {data.message}
            </Text>
          </View>
        </View>
      </Pressable>
    </NotificationItemWrapper>
  );
}
