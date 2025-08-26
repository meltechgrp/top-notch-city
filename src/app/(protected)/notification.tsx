import { getNotifications } from "@/actions/notification";
import PushNotificationsIllustration from "@/components/icons/PushNotificationsIllustration";
import ApplicationNotificationComponent from "@/components/notifications/ApplicationNotificationComponent";
import DefaultNotificationComponent from "@/components/notifications/DefaultNotificationComponent";
import EnquiryNotificationComponent from "@/components/notifications/EnquiryNotificationcomponent";
import PropertyNotificationComponent from "@/components/notifications/PropertyNotificationComponent";
import EmptyStateWrapper from "@/components/shared/EmptyStateWrapper";
import { Box, Heading, Text } from "@/components/ui";
import eventBus from "@/lib/eventBus";
import { useStore } from "@/store";
import { useRefresh } from "@react-native-community/hooks";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useEffect, useMemo } from "react";
import { RefreshControl, SectionList, View } from "react-native";

export default function NotificationScreen() {
  const { me } = useStore();
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ id: me?.id }),
  });
  const sections = useMemo(() => {
    if (!data?.length) return [];

    // Group by submission date
    const groups: { [date: string]: UserNotification[] } = {};

    data?.forEach((item) => {
      const dateKey = format(new Date(item.created_at), "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });

    // Convert to array of { title, data }
    return Object.entries(groups)
      .map(([dateKey, items]) => ({
        title: format(new Date(dateKey), "MMMM d, yyyy"),
        data: items,
      }))
      .sort(
        (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime()
      );
  }, [data]);
  const { onRefresh } = useRefresh(refetch);
  const RenderItem = ({ item }: { item: UserNotification }) => {
    switch (item.entity_type) {
      case "property":
        return <PropertyNotificationComponent data={item} />;
      case "enquiry":
        return <EnquiryNotificationComponent data={item} />;
      case "application":
        return <ApplicationNotificationComponent data={item} />;
      default:
        return <DefaultNotificationComponent data={item} />;
    }
    return null;
  };

  useEffect(() => {
    eventBus.addEventListener("PROPERTY_HORIZONTAL_LIST_REFRESH", onRefresh);

    return () => {
      eventBus.removeEventListener(
        "PROPERTY_HORIZONTAL_LIST_REFRESH",
        onRefresh
      );
    };
  }, []);
  return (
    <Box className="flex-1">
      <View className="py-6 flex-1">
        <EmptyStateWrapper
          isEmpty={!sections.length}
          illustration={<PushNotificationsIllustration />}
          cta={
            <View className=" gap-2 items-center px-12">
              <Heading size="xl" className=" font-heading">
                No notifications yet
              </Heading>
              <Text size="md" className="text-center">
                Your notifications will appear here once you've received them.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isFetching || isLoading}
              onRefresh={onRefresh}
            />
          }
          contentWrapperClassName="relative -top-24"
        >
          <SectionList
            contentContainerClassName="px-4"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onRefresh} />
            }
            renderSectionHeader={({ section: { title } }) => (
              <View className="px-4 mb-1">
                <Text className="font-medium">{title}</Text>
              </View>
            )}
            onScroll={() => eventBus.dispatchEvent("NOTIFICATION_OPEN", null)}
            renderSectionFooter={() => <View className="h-6" />}
            ItemSeparatorComponent={() => <View className="h-3" />}
            SectionSeparatorComponent={() => <View className="h-1" />}
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RenderItem item={item} />}
          />
        </EmptyStateWrapper>
      </View>
    </Box>
  );
}
