import * as React from 'react';
// import { useStore } from '@/store';
import { router, useFocusEffect } from 'expo-router';
import { cn } from '@/lib/utils';
import TabView from '@/components/shared/TabView';
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import {
	ImageBackground,
	Text,
	View,
	Pressable,
	Button,
	ButtonText,
} from '@/components/ui';
import { ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
	const [activeIndex, setActiveIndex] = React.useState(0);
	// 	const hasAuth = useStore((v) => v.hasAuth);

	// 	useFocusEffect(
	// 		React.useCallback(() => {
	// 			if (hasAuth) {
	// 				router.replace('/home');
	// 			}
	// 		}, [hasAuth])
	// 	);
	return (
		<View className="flex-1">
			<TabView activeTab={activeIndex} onTabSelected={setActiveIndex}>
				<PageOne
					key={1}
					setActiveIndex={setActiveIndex}
					activeIndex={activeIndex}
				/>
				<PageTwo
					key={2}
					setActiveIndex={setActiveIndex}
					activeIndex={activeIndex}
				/>
				<PageThree key={3} />
			</TabView>
			<StatusBar style="light" />
		</View>
	);
}

function PageDots({
	activeIndex,
	length,
}: {
	activeIndex: number;
	length: number;
}) {
	return (
		<View className="flex-row items-center justify-center">
			{Array.from({ length }).map((_, i) => (
				<View
					key={i}
					className={cn(
						'w-2 h-2 rounded-full mr-2',
						activeIndex === i ? 'bg-white' : 'bg-gray-500'
					)}
				/>
			))}
		</View>
	);
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function CircleCurve({ step }: { step: number }) {
	const progress = useSharedValue(0); // 0 to 1

	// Arc math
	const size = 56;
	const strokeWidth = 4;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	const animatedProps = useAnimatedProps(() => ({
		strokeDashoffset: circumference * (1 - progress.value),
	}));

	React.useEffect(() => {
		let nextProgress = 0;
		if (step === 0) nextProgress = 0.33;
		else if (step === 1) nextProgress = 0.66;
		else nextProgress = 0.99;

		progress.value = withTiming(nextProgress, { duration: 1000 });
	}, [step]);
	return (
		<Svg width={size} height={size} style={{ position: 'absolute' }}>
			{/* Background Border */}
			<Circle
				stroke="black"
				fill="none"
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeWidth={strokeWidth}
			/>

			{/* Animated Foreground Arc */}
			<AnimatedCircle
				stroke="white"
				fill="none"
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeWidth={strokeWidth}
				strokeDasharray={`${circumference}, ${circumference}`}
				animatedProps={animatedProps}
				strokeLinecap="round"
				rotation="-90"
				originX={size / 2}
				originY={size / 2}
			/>
		</Svg>
	);
}

function PageOne({
	setActiveIndex,
	activeIndex,
}: {
	setActiveIndex: (index: number) => void;
	activeIndex: number;
}) {
	return (
		<ImageBackground
			source={require('@/assets/images/landing/home.png')}
			className="flex-1"
			imageStyle={{ resizeMode: 'cover' }}>
			<SafeAreaView edges={['bottom', 'top']} className="flex-1 px-4 mb-16">
				<View className="flex-1 items-end ">
					<Pressable onPress={() => router.push('/signin')}>
						<Text size="lg" className="text-white">
							Skip
						</Text>
					</Pressable>
				</View>
				<View className=" gap-4">
					<View className="flex-row justify-between items-center">
						<Text
							size="4xl"
							className="font-bold font-heading w-[60%] text-white">
							Find Your Dream Home
						</Text>
						<View className="relative justify-center items-center">
							{/* Animated Half Circle */}
							<CircleCurve step={activeIndex} />

							{/* Pressable Button */}
							<Pressable
								onPress={() => {
									setActiveIndex(1);
								}}
								className="bg-white w-12 h-12 rounded-full justify-center items-center m-1">
								<ChevronRight />
							</Pressable>
						</View>
					</View>
					<View className="flex-row justify-between items-center gap-16">
						<Text className=" text-white text-sm text-center">
							Explore thousands of properties for sale and rent
						</Text>
						<PageDots length={3} activeIndex={activeIndex} />
					</View>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
}
function PageTwo({
	setActiveIndex,
	activeIndex,
}: {
	setActiveIndex: (index: number) => void;
	activeIndex: number;
}) {
	return (
		<ImageBackground
			source={require('@/assets/images/landing/direction.png')}
			className="flex-1"
			imageStyle={{ resizeMode: 'cover' }}>
			<SafeAreaView edges={['bottom', 'top']} className="flex-1 px-4 mb-16">
				<View className="flex-1 items-end ">
					<Pressable onPress={() => router.push('/signin')}>
						<Text size="lg" className="text-white">
							Skip
						</Text>
					</Pressable>
				</View>
				<View className=" gap-4">
					<View className="flex-row justify-between items-center">
						<Text
							size="4xl"
							className="font-bold font-heading w-[60%] text-white">
							Where are you looking?
						</Text>
						<View className="relative justify-center items-center">
							{/* Animated Half Circle */}
							<CircleCurve step={activeIndex} />

							{/* Pressable Button */}
							<Pressable
								onPress={() => {
									setActiveIndex(2);
								}}
								className="bg-white w-12 h-12 rounded-full justify-center items-center m-1">
								<ChevronRight />
							</Pressable>
						</View>
					</View>
					<View className="flex-row justify-between items-center gap-16">
						<Text className=" text-white text-sm text-center">
							Filter by location, price, or property type to find exactly what
							you’re looking for.1
						</Text>
						<View className="w-[20%] items-end">
							<PageDots length={3} activeIndex={activeIndex} />
						</View>
					</View>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
}
function PageThree() {
	return (
		<ImageBackground
			source={require('@/assets/images/landing/agent.png')}
			className="flex-1"
			imageStyle={{ resizeMode: 'cover' }}>
			<SafeAreaView edges={['bottom', 'top']} className="flex-1 px-4 mb-16">
				<View className="flex-1 items-end "></View>
				<View className=" gap-4 mb-6">
					<View className="flex-row justify-between items-center">
						<Text
							size="4xl"
							className="font-bold font-heading w-[70%] text-white">
							Connect with Trusted Agents
						</Text>
					</View>
					<View className="flex-row justify-between">
						<Text className=" text-white text-base">
							Get personalized assistance from verified and experienced real
							estate professionals.
						</Text>
					</View>
				</View>
				<Button variant="outline" className="rounded-xl border-white h-12">
					<ButtonText
						onPress={() => router.push('/signin')}
						className=" text-white text-sm font-semibold">
						Sign In
					</ButtonText>
				</Button>
			</SafeAreaView>
		</ImageBackground>
	);
}
