import NotificationBadge from "@/components/notifications/NotificationBadge";
import { router, useFocusEffect, usePathname } from "expo-router";
import { Bell } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Button, Icon } from "../ui";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { useStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/actions/notification";

type Props = {
  className?: string;
};

export default function NotificationBarButton({ className }: Props) {
  const { me } = useStore();
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ id: me?.id }),
  });
  const unseenNotificationsCount = useMemo(() => data?.length, [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );
  const pathname = usePathname();
  return (
    <Button
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({
          pathname: "/notification",
          params: {
            ref: pathname,
          },
        });
      }}
      action="secondary"
      className={cn(
        "rounded-full h-14 px-4 justify-center items-center flex",
        className
      )}
    >
      <Icon size={"xl"} as={Bell} />
      <View className="absolute top-1 right-0">
        <NotificationBadge count={unseenNotificationsCount} />
      </View>
    </Button>
  );
}
