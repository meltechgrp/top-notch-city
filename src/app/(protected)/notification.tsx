import PushNotificationsIllustration from '@/components/icons/PushNotificationsIllustration';
import PropertyAcceptedNotificationComponent from '@/components/notifications/PropertyAcceptedNotificationComponent';
import PropertyListedNotificationComponent from '@/components/notifications/PropertyListedNotificationcomponent';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, Heading, Text } from '@/components/ui';
import { notificationData } from '@/constants/DeleteLater';
import eventBus from '@/lib/eventBus';
import React, { useEffect, useMemo } from 'react';
import { RefreshControl, SectionList, View } from 'react-native';

export default function NotificationScreen() {
	const [refreshing, setRefreshing] = React.useState(false);
	const [scrollEnabled, setScrollEnabled] = React.useState(true);
	async function refetch() {}
	async function onRefresh() {
		try {
			setRefreshing(true);
			await refetch();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
	}

	const renderItem = (item: any) => {
		switch (item.__typename) {
			case 'PropertytAcceptedNotification':
				return (
					<PropertyAcceptedNotificationComponent
						setScrollEnabled={() => setScrollEnabled(!scrollEnabled)}
						data={item as any}
					/>
				);
			case 'PropertyListedNotification':
				return (
					<PropertyListedNotificationComponent
						setScrollEnabled={() => setScrollEnabled(!scrollEnabled)}
						data={item as any}
					/>
				);
			default:
				break;
		}
		return null;
	};
	const groupedData = useMemo(
		() => notificationData.filter((section) => section.data.length > 0),
		[]
	);
	return (
		<Box className="flex-1">
			<View className="py-6 flex-1">
				<EmptyStateWrapper
					isEmpty={!groupedData.length}
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
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					contentWrapperClassName="relative -top-24">
					<SectionList
						scrollEnabled={scrollEnabled}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						contentContainerClassName="px-4"
						showsVerticalScrollIndicator={false}
						renderSectionHeader={({ section: { title } }) => (
							<View className="px-4 mb-1">
								<Text className="font-medium">{title}</Text>
							</View>
						)}
						onScroll={() => eventBus.dispatchEvent('NOTIFICATION_OPEN', null)}
						renderSectionFooter={() => <View className="h-6" />}
						ItemSeparatorComponent={() => <View className="h-3" />}
						SectionSeparatorComponent={() => <View className="h-1" />}
						sections={groupedData || []}
						keyExtractor={(item, index) => (item as any)?.id || (index as any)}
						renderItem={({ item }) => renderItem(item)}
					/>
				</EmptyStateWrapper>
			</View>
		</Box>
	);
}
