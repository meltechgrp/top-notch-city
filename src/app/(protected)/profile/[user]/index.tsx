import * as React from 'react';

import { Animated, View } from 'react-native';

import { useStore } from '@/store';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import headerLeft from '@/components/shared/headerLeft';
import PagerWithHeader, {
	PagerWithHeaderTabBarProps,
} from '@/components/shared/PagerWithHeader';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import BeachPersonWaterParasolSingleColorIcon from '@/components/icons/BeachPersonWaterParasolIcon';
import { ProfileContextProvider } from '@/components/profile/context/ProfileContext';
import ProfileTabHeaderSection from '@/components/profile/ProfileTabHeaderSection';
import ProfileBootstrap from '@/components/profile/ProfileBootstrap';
import { Box, Icon, Pressable, Text } from '@/components/ui';
import ProfileTopSection from '@/components/profile/ProfileTopSection';
import { MoreHorizontal } from 'lucide-react-native';
import ProfileListingTab from '@/components/profile/ProfileListingTab';

export default function ProfileScreen() {
	const { user: idOrUsername, ref } = useLocalSearchParams<{
		user: string;
		ref?: string;
	}>();
	// const { me } = useStore((v) => ({ me: v.me }));

	// const { data, refetch } = useProfileQuery({
	//   fetchPolicy: 'cache-and-network',
	//   variables: {
	//     idOrUsername: idOrUsername || '',
	//   },
	// })
	// useRefreshOnFocus(refetch)

	const userId = 'jkkfdkjkjfde'; // data?.profile?.user.id
	const profile = {
		id: userId,
		username: 'john_doe',
		name: 'John Doe',
	};
	// const isGuest = React.useMemo(() => {
	// 	return userId !== me?.id;
	// }, [userId, me]);
	const isBlocked = false;
	const isGuest = false;
	const renderHeader = React.useCallback(
		() => (
			<Animated.View className="" pointerEvents="box-none">
				<ProfileTopSection />
			</Animated.View>
		),
		[]
	);
	const isSecurityUser = false;
	const renderTabBar = React.useCallback(
		(props: PagerWithHeaderTabBarProps) => {
			return (
				<ProfileTabHeaderSection
					activeIndex={props.currentPage}
					onTabChange={props.onTabChange}
					profile={profile as any}
				/>
			);
		},
		[]
	);

	const listingTabRef = React.useRef<any | null>(null);
	const wishlistTabRef = React.useRef<any | null>(null);
	const bookingsTabRef = React.useRef<any | null>(null);

	const listingTabIndex = 0;
	const wishlistTabIndex = 1;
	const bookingsTabIndex = 2;

	const scrollSectionToTop = React.useCallback((index: number) => {
		if (index === listingTabIndex) {
			listingTabRef.current?.scrollToTop();
		} else if (index === wishlistTabIndex) {
			wishlistTabRef.current?.scrollToTop();
		} else if (index === bookingsTabIndex) {
			bookingsTabRef.current?.scrollToTop();
		}
	}, []);
	async function refetch() {}
	const onCurrentPageSelected = React.useCallback(
		(index: number) => {
			scrollSectionToTop(index);
		},
		[scrollSectionToTop]
	);

	return (
		<>
			<Stack.Screen
				options={{
					title: 'Profile',
					headerShadowVisible: false,
					headerBackVisible: false,
					headerShown: true,
					headerTitleAlign: 'center',
					headerLeft: headerLeft(),
					headerRight: () => (
						<View className="flex-row items-center">
							{isGuest ? (
								<Pressable
									// onPress={() => addMenu(ProfileIMenuType.settings)}
									className="px-2 h-full">
									<Icon as={MoreHorizontal} className="" />
								</Pressable>
							) : (
								<Pressable
								// onPress={() => {
								// 	router.push({
								// 		pathname: '/profile/[user]/edit',
								// 		params: {
								// 			user: profileUser.id,
								// 		},
								// 	});
								//   }}
								>
									<Text size="xl" className="text-primary">
										Edit
									</Text>
								</Pressable>
							)}
						</View>
					),
				}}
			/>
			{/* <ProfileContextProvider
				profile={profile}
				isGuest={isGuest}
				onRefresh={refetch}> */}
			<Box className="flex-1">
				<PagerWithHeader
					isHeaderReady={true}
					renderHeader={renderHeader}
					renderTabBar={renderTabBar}
					onCurrentPageSelected={onCurrentPageSelected}
					initialPage={0}>
					{isSecurityUser ? () => <EmptyProfile /> : null}
					{!isBlocked
						? ({ headerHeight, scrollElRef, onScroll }) => (
								<>
									<ProfileListingTab
										listRef={listingTabRef}
										profileId={userId}
										key="1"
										scrollElRef={scrollElRef}
										headerHeight={headerHeight}
										onScroll={onScroll}
									/>
								</>
							)
						: null}
					{!isBlocked
						? ({ headerHeight, scrollElRef, onScroll }) => (
								<>
									<ProfileListingTab
										listRef={wishlistTabRef}
										profileId={userId}
										key="2"
										scrollElRef={scrollElRef}
										headerHeight={headerHeight}
										onScroll={onScroll}
									/>
								</>
							)
						: null}
					{!isBlocked
						? ({ headerHeight, scrollElRef, onScroll }) => (
								<>
									<ProfileListingTab
										listRef={bookingsTabRef}
										profileId={userId}
										key="3"
										scrollElRef={scrollElRef}
										headerHeight={headerHeight}
										onScroll={onScroll}
									/>
								</>
							)
						: null}
				</PagerWithHeader>
			</Box>
			{/* <ProfileBootstrap /> */}
			{/* </ProfileContextProvider> */}
		</>
	);
}

function EmptyProfile() {
	return (
		<View className="flex-1 justify-center items-center px-4">
			<BeachPersonWaterParasolSingleColorIcon
				width={64}
				height={64}
				className="text-gray-500"
			/>
			<Text className="text-gray-500 mt-2">Nothing to see here</Text>
		</View>
	);
}
