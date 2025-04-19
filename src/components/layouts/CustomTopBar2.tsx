import React, { useMemo } from 'react';
import { Animated, Pressable, View, useWindowDimensions } from 'react-native';
import { TabBarProps, Route } from 'react-native-tab-view';
import { cn } from '@/lib/utils'; // optional: for combining classNames
import { Text } from '../ui';

type RouteType = Route & {
	title: string;
};

export default function CustomTabBar2(props: TabBarProps<RouteType>) {
	const { navigationState, position, jumpTo } = props;
	const { width } = useWindowDimensions();

	const tabWidth = useMemo(() => {
		return width / navigationState.routes.length;
	}, [width, navigationState.routes.length]);

	return (
		<View className="w-full py-3 ">
			<View className="flex-row border-b border-gray-300 h-12 overflow-hidden relative">
				{/* Animated tab indicator */}
				<Animated.View
					className="absolute h-full border-b border-orange-500 rounded z-0 top-0"
					style={{
						width: tabWidth - 8,
						transform: [
							{
								translateX: position.interpolate({
									inputRange: navigationState.routes.map((_, i) => i),
									outputRange: navigationState.routes.map(
										(_, i) => i * tabWidth + 4
									),
								}),
							},
						],
						elevation: 4,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.1,
						shadowRadius: 4,
					}}
				/>

				{/* Tab buttons */}
				{navigationState.routes.map((route, index) => {
					const isFocused = navigationState.index === index;

					return (
						<Pressable
							key={route.key}
							className={cn(
								'flex-1 items-center justify-center z-10 rounded-xl',
								isFocused ? 'bg-primary' : 'bg-secondary'
							)}
							style={{ width: tabWidth - 8 }}
							onPress={() => jumpTo(route.key)}>
							<Text
								size="lg"
								className={cn(
									'font-semibold',
									isFocused ? 'text-orange-500 font-bold' : 'text-gray-500'
								)}>
								{route.title}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}
