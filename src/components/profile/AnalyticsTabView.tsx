import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
} from 'react';
import { Animated, NativeScrollEvent, ScrollView, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { chunk } from 'lodash-es';
import { Heading, Icon, Pressable, Text } from '../ui';
import { Eye, House, MailQuestion, ShoppingBag } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import {
	AnimatedFlashList,
	AnimatedScrollView,
} from '../shared/AnimatedFlashList';
import AgentTable from '../admin/dashboard/AgentTable';
import ViewsTable from '../admin/dashboard/ViewsTable';

type IProps = {
	profileId: string;
	onScroll?: (e: NativeScrollEvent) => any;
	headerHeight: number;
	scrollElRef: any;
	listRef: any;
	scrollY?: SharedValue<number>;
};
const AnalyticsTabView = forwardRef<any, IProps>(function AnalyticsTabView(
	props: IProps,
	ref
) {
	const { scrollY, headerHeight, scrollElRef } = props;

	const onScrollToTop = useCallback(() => {
		scrollElRef?.current?.scrollToOffset({
			animated: true,
			offset: headerHeight || 0,
		});
	}, [scrollElRef, headerHeight]);

	useImperativeHandle(ref, () => ({
		scrollToTop: onScrollToTop,
	}));

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			'worklet';
			if (scrollY) {
				scrollY.value = event.contentOffset.y;
			}
		},
	});
	const data = [
		{
			title: 'Listing',
			icon: House,
			total: 200,
			rate: 10,
			direction: true,
		},
		{
			title: 'Bookings',
			icon: MailQuestion,
			total: 10,
			rate: 10,
			direction: false,
		},
		{
			title: 'Views',
			icon: Eye,
			total: 500,
			rate: 25,
			direction: true,
		},
		{
			title: 'Sold',
			icon: ShoppingBag,
			total: 10,
			rate: 5,
			direction: false,
		},
	];
	return (
		<View className="flex-1 p-4">
			<AnimatedScrollView
				onScroll={scrollHandler}
				ref={scrollElRef}
				contentContainerStyle={{ paddingTop: headerHeight }}
				scrollEventThrottle={1}>
				<View className="flex-wrap gap-4">
					{chunk(data, 2).map((row, i) => (
						<View className={'flex-row gap-4'} key={i}>
							{row.map((item) => (
								<Pressable
									key={item.title}
									className="flex-1 h-28 py-4 justify-between rounded-xl bg-background-muted">
									<View className=" gap-4 px-4 flex-row justify-between items-center">
										<View className=" p-1.5 self-start rounded-full bg-[#ffe7e3]">
											<Icon size="md" as={item.icon} className="text-primary" />
										</View>
										<Heading size="xl">{item.total}</Heading>
									</View>
									<View className="flex-row justify-between px-4 items-center">
										<Text className=" text-lg font-medium">{item.title}</Text>
										<View
											className={cn(
												'flex-row gap-2 p-1.5 py-px rounded-xl',
												item.direction ? 'bg-green-500' : 'bg-primary'
											)}>
											<FontAwesome
												name={item.direction ? 'caret-up' : 'caret-down'}
												size={14}
												color={'white'}
											/>
											<View className="flex-row items-center">
												<FontAwesome
													name={item.direction ? 'plus' : 'minus'}
													size={6}
													color={'white'}
												/>
												<Text className="text-white">{item.rate}%</Text>
											</View>
										</View>
									</View>
								</Pressable>
							))}
						</View>
					))}
				</View>
				<ViewsTable title="Properties Views" className="px-0" />
				<AgentTable title="Properties Uploads" className="px-0" />
			</AnimatedScrollView>
		</View>
	);
});

export default AnalyticsTabView;
