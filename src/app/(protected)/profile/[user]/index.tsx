import React, { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	scrollTo,
	useAnimatedRef,
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import { Stack, useRouter } from 'expo-router';
import { Box, Pressable, Text, View } from '@/components/ui';
import { useStore } from '@/store';
import { ProfileTopSection } from '@/components/profile/ProfileTopSection';
import ProfileTabHeaderSection from '@/components/profile/ProfileTabHeaderSection';
import PropertiesTabView from '@/components/profile/PropertiesTab';
import BeachPersonWaterParasolSingleColorIcon from '@/components/icons/BeachPersonWaterParasolIcon';
import { fullName } from '@/lib/utils';
import WishlistTabView from '@/components/profile/WishlistTabView';
import AnalyticsTabView from '@/components/profile/AnalyticsTabView';

const TABS = ['Properties', 'Wishlist', 'Analytics'];
export default function ProfileScreen() {
	const { me } = useStore();
	const router = useRouter();
	const userId = me?.id;
	const pagerRef = useRef<PagerView>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const scrollYs = useRef(TABS.map(() => useSharedValue(0))).current;
	const scrollRefs = useRef(TABS.map(() => useAnimatedRef())).current;

	const [headerOnlyHeight, setHeaderOnlyHeight] = useState(0);
	const [tabBarHeight, setTabBarHeight] = useState(0);
	const fullHeaderHeight = headerOnlyHeight + tabBarHeight;

	const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
		setHeaderOnlyHeight(Math.round(e.nativeEvent.layout.height));
	}, []);

	const onTabBarLayout = useCallback((e: LayoutChangeEvent) => {
		setTabBarHeight(Math.round(e.nativeEvent.layout.height));
	}, []);

	const headerTranslateY = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: -Math.min(scrollYs[currentPage].value, headerOnlyHeight),
				},
			],
		};
	}, [currentPage, headerOnlyHeight]);

	React.useEffect(() => {
		if (me) {
			router.setParams({ title: fullName(me) });
		}
	}, [me]);

	const scrollToTop = React.useCallback((index: number) => {
		const ref = scrollRefs[index];
		if (ref) {
			scrollTo(ref, 0, 0, true);
		}
	}, []);

	const onTabChange = React.useCallback(
		(index: number) => {
			setCurrentPage(index);
			pagerRef.current?.setPage(index);
			scrollToTop(index);
		},
		[scrollToTop]
	);

	if (!me?.id) return <EmptyProfile />;
	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<View className="flex-row items-center">
							<Pressable
								onPress={() => {
									router.push('/(protected)/profile/[user]/account');
								}}>
								<Text size="xl" className="text-primary">
									Edit
								</Text>
							</Pressable>
						</View>
					),
				}}
			/>
			<Box className="flex-1">
				<Animated.View
					style={[
						headerTranslateY,
						{ zIndex: 10, position: 'absolute', width: '100%' },
					]}
					pointerEvents="box-none">
					<View onLayout={onHeaderLayout} pointerEvents="box-none">
						<ProfileTopSection />
					</View>
					<View onLayout={onTabBarLayout}>
						<ProfileTabHeaderSection
							activeIndex={currentPage}
							onTabChange={onTabChange}
							profile={me}
						/>
					</View>
				</Animated.View>

				<PagerView
					style={{ flex: 1, marginTop: fullHeaderHeight }}
					initialPage={0}
					ref={pagerRef}
					onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
					{TABS.map((tab, index) => {
						switch (tab) {
							case 'Properties':
								return (
									<View style={{ flex: 1 }} key={index}>
										{userId && currentPage === index ? (
											<PropertiesTabView
												key={index}
												listRef={scrollRefs[index]}
												profileId={userId}
												scrollElRef={scrollRefs[index]}
												headerHeight={fullHeaderHeight}
												scrollY={scrollYs[index]}
											/>
										) : null}
									</View>
								);
							case 'Wishlist':
								return (
									<View style={{ flex: 1 }} key={index}>
										{userId && currentPage === index ? (
											<WishlistTabView
												key={index}
												listRef={scrollRefs[index]}
												profileId={userId}
												scrollElRef={scrollRefs[index]}
												headerHeight={fullHeaderHeight}
												scrollY={scrollYs[index]}
											/>
										) : null}
									</View>
								);
							case 'Analytics':
								return (
									<View style={{ flex: 1 }} key={index}>
										{userId && currentPage === index ? (
											<AnalyticsTabView
												key={index}
												listRef={scrollRefs[index]}
												profileId={userId}
												scrollElRef={scrollRefs[index]}
												headerHeight={fullHeaderHeight}
												scrollY={scrollYs[index]}
											/>
										) : null}
									</View>
								);
							default:
								return null;
						}
					})}
				</PagerView>
			</Box>
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
