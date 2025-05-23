import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from '../ui';
import { useLayout } from '@react-native-community/hooks';

type Props = {
	routes: {
		key: string;
		title: string;
	}[];
	setCurrent: (key: string) => void;
	current: string;
	children: React.ReactNode;
};

export default function CustomTabBar3(props: Props) {
	const { current, routes, setCurrent, children } = props;
	const { width, onLayout } = useLayout();

	const tabWidth = useMemo(() => {
		return width / routes.length;
	}, [width, routes.length]);
	return (
		<View onLayout={onLayout} className="w-full min-h-[330px] gap-4 py-3 ">
			<View className="px-4">
				<View className="flex-row bg-background-muted rounded-[50px] py-py h-12 overflow-hidden relative">
					{routes.map((route) => {
						const isFocused = route.key === current;

						return (
							<Pressable
								key={route.key}
								className={cn(
									'flex-1 items-center justify-center z-10 rounded-[50px]',
									isFocused && 'bg-primary'
								)}
								style={{ width: tabWidth - 8 }}
								onPress={() => setCurrent(route.key)}>
								<Text
									className={cn(
										'font-normal text-base',
										isFocused
											? 'text-gray-100 font-semibold font-heading'
											: 'text-typography'
									)}>
									{route.title}
								</Text>
							</Pressable>
						);
					})}
				</View>
			</View>
			{children}
		</View>
	);
}
