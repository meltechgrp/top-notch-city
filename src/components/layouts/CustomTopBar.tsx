import useLayout from '@/hooks/useLayout';
import { cn } from '@/lib/utils';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { NavigationState } from '@react-navigation/native';
import { useMemo } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Text } from '../ui';

type Props = {
	containerClassName?: string;
} & MaterialTopTabBarProps;

export default function CustomTopBar(props: Props) {
	const { state, descriptors, navigation, position, containerClassName } =
		props;
	const [{ width }, onLayout] = useLayout();
	const [{ width: w }, onLayout2] = useLayout();

	const activeRoutes = state.routes
		.map((route) => {
			const { options } = descriptors[route.key];
			if ((options as any).hideTabBar) return null;
			return route;
		})
		.filter((v) => v !== null) as unknown as NavigationState['routes'];
	const tabWidth = useMemo(
		() => Math.round(((w < 100 ? 380 : w) - 8) / activeRoutes.length),
		[w, activeRoutes]
	);
	return (
		<View className={cn('py-2 gap-4 w-full bg-background', containerClassName)}>
			<View
				onLayout={onLayout2}
				className="flex-row h-14 bg-background-muted rounded-sm p-1">
				<View className="relative flex-row w-full">
					<Animated.View
						style={[
							{
								shadowOffset: { width: 0, height: 4 },
								shadowColor: '#fff',
								shadowRadius: 4,
								shadowOpacity: 0.09,
								elevation: 4,
								width: tabWidth,
								transform: [
									{
										translateX: position.interpolate({
											inputRange: [0, 1],
											outputRange: [0, width],
										}),
									},
								],
							},
						]}
						className="items-center justify-center absolute bg-primary rounded-sm h-full -z-10"
					/>
					{activeRoutes.map((route, index) => {
						const { options } = descriptors[route.key];

						const isFocused = state.index === index;
						const onPress = () => {
							const event = navigation.emit({
								type: 'tabPress',
								target: route.key,
								canPreventDefault: true,
							});

							if (!isFocused && !event.defaultPrevented) {
								navigation.navigate(route.name, route.params);
							}
						};

						const onLongPress = () => {
							navigation.emit({
								type: 'tabLongPress',
								target: route.key,
							});
						};

						return (
							<Pressable
								onLayout={onLayout}
								accessibilityState={isFocused ? { selected: true } : {}}
								accessibilityLabel={options.tabBarAccessibilityLabel}
								testID={options.tabBarButtonTestID}
								onPress={onPress}
								onLongPress={onLongPress}
								key={route.key}
								style={[{ width: tabWidth }]}
								className={cn(
									'items-center justify-center rounded-xl z-10 flex flex-row gap-1',
									isFocused && 'bg-primary'
								)}>
								{typeof options.tabBarLabel === 'undefined' ||
								typeof options.tabBarLabel === 'string' ? (
									<Text
										className={cn(
											'font-normal text-base',
											isFocused ? 'text-white font-bold' : ''
										)}>
										{(options as any).staticTitle ||
											options.title ||
											route.name}
									</Text>
								) : (
									options.tabBarLabel?.({
										focused: isFocused,
										color: 'black',
										children: options.title || route.name,
									})
								)}

								{options.tabBarBadge?.()}
							</Pressable>
						);
					})}
				</View>
			</View>
		</View>
	);
}
