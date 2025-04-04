// import * as React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { View } from '@/components/View';
// import { Text } from '@/components/ui';
// import { useStore } from '@/store';
// import { router, useFocusEffect } from 'expo-router';
// import { cn } from '@/lib/utils';
// import LifesyncIcon from '@/components/icons/LifesyncIcon';
// import TabView from '@/components/TabView';
// import Sos from '@/assets/images/sos.png';
// import Watch from '@/assets/images/watch.png';
// import Heart from '@/assets/images/heart.png';
// import { Image, Pressable } from 'react-native';
// import { ChevronRight } from 'lucide-react-native';

import { View } from '@/components/View';

export default function OnboardingScreen() {
	// 	const [activeIndex, setActiveIndex] = React.useState(0);
	// 	const hasAuth = useStore((v) => v.hasAuth);

	// 	useFocusEffect(
	// 		React.useCallback(() => {
	// 			if (hasAuth) {
	// 				router.replace('/home');
	// 			}
	// 		}, [hasAuth])
	// 	);
	return (
		<View></View>
		// 		<>
		// 			<SafeAreaView edges={['top', 'bottom']} className="flex-1">
		// 				<View className="flex-1 pt-6 px-4">
		// 					<View className="flex-1 items-center justify-center pt-8">
		// 						<TabView activeTab={activeIndex} onTabSelected={setActiveIndex}>
		// 							<PageOne key={1} />
		// 							<PageTwo key={2} />
		// 							<PageThree key={3} />
		// 						</TabView>
		// 						<PageDots activeIndex={activeIndex} length={3} />
		// 					</View>
		// 					<View className="px-4 pt-16 pb-4 flex-row basis-[20%] items-center justify-between">
		// 						<Pressable
		// 							onPress={() => {
		// 								if (activeIndex >= 1) {
		// 									setActiveIndex((current) => current - 1);
		// 								} else {
		// 									router.push('/signin');
		// 								}
		// 							}}>
		// 							<Text className=" text-lg font-bold text-primary ">
		// 								{activeIndex >= 1 ? 'Back' : 'Skip'}
		// 							</Text>
		// 						</Pressable>
		// 						<Pressable
		// 							onPress={() => {
		// 								if (activeIndex < 2) {
		// 									setActiveIndex((current) => current + 1);
		// 								} else {
		// 									router.push('/signin');
		// 								}
		// 							}}
		// 							className={cn(
		// 								'flex-row gap-2 bg-primary h-12 items-center w-fit p-2 pl-4 rounded-3xl',
		// 								activeIndex < 2 && 'px-5'
		// 							)}>
		// 							{activeIndex > 1 && (
		// 								<Text className=" text-base font-medium text-white ">
		// 									Get started
		// 								</Text>
		// 							)}
		// 							<ChevronRight color="white" />
		// 						</Pressable>
		// 					</View>
		// 					<View className="justify-center flex-row pt-6 pb-6 grow-1">
		// 						<View className="flex-row items-center">
		// 							<LifesyncIcon height={28} />
		// 						</View>
		// 					</View>
		// 				</View>
		// 			</SafeAreaView>
		// 		</>
	);
}

// function PageDots({
// 	activeIndex,
// 	length,
// }: {
// 	activeIndex: number;
// 	length: number;
// }) {
// 	return (
// 		<View className="flex-row pt-2 items-center justify-center">
// 			{Array.from({ length }).map((_, i) => (
// 				<View
// 					key={i}
// 					className={cn(
// 						'w-2 h-2 rounded-full mr-2',
// 						activeIndex === i ? 'bg-foreground w-5' : 'bg-gray-500'
// 					)}
// 				/>
// 			))}
// 		</View>
// 	);
// }

// function PageOne() {
// 	return (
// 		<View className=" justify-center items-center gap-12 flex-col">
// 			<View className="bg-transparent">
// 				<Image source={Sos} className="w-80 h-80 object-cover" />
// 			</View>
// 			<View className="flex-col gap-4 items-center px-2 max-w-sm">
// 				<Text className=" font-bold text-2xl">Quickly send SOS alerts</Text>
// 				<Text className=" text-foreground/90 text-sm text-center">
// 					In case of emergecies, quickly send an SOS to your chosen contact with
// 					just a tap, which could make all the difference when seconds matter.
// 				</Text>
// 			</View>
// 		</View>
// 	);
// }
// function PageTwo() {
// 	return (
// 		<View className=" justify-center items-center gap-12 flex-col">
// 			<View className="bg-transparent">
// 				<Image source={Watch} className="w-80 h-80 object-cover" />
// 			</View>
// 			<View className="flex-col gap-4 items-center px-2 max-w-sm">
// 				<Text className=" font-bold text-2xl">Real-time health tracking</Text>
// 				<Text className=" text-foreground/90 text-sm text-center">
// 					Keep an eye on your heart rate, blood pressure, steps, and body
// 					temperature in, all updated in real-time so you're always in the know.
// 				</Text>
// 			</View>
// 		</View>
// 	);
// }
// function PageThree() {
// 	return (
// 		<View className=" justify-center items-center gap-12 flex-col">
// 			<View className="bg-transparent">
// 				<Image source={Heart} className="w-80 h-80 object-cover" />
// 			</View>
// 			<View className="flex-col gap-4 items-center px-2 max-w-sm">
// 				<Text className=" font-bold text-2xl">Personal insights</Text>
// 				<Text className=" text-foreground/90 text-sm text-center">
// 					Review your health data over time to track progress, notice changes,
// 					and get a clearer picture of your well-being.
// 				</Text>
// 			</View>
// 		</View>
// 	);
// }
