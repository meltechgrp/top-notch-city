import * as React from 'react';
import { useStore } from '@/store';
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
import { Check, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

export default function OnboardingScreen() {
	const [activeIndex, setActiveIndex] = React.useState(0);
	const hasAuth = useStore((v) => v.hasAuth);

	React.useEffect(() => {
		if (Platform.OS == 'android') {
			SystemNavigationBar.setNavigationColor('translucent');
		}
	}, []);
	useFocusEffect(
		React.useCallback(() => {
			if (hasAuth) {
				router.replace('/home');
			}
		}, [hasAuth])
	);
	return (
		<View className="flex-1">
			<TabView
				activeTab={activeIndex}
				scrollEnabled={true}
				onTabSelected={setActiveIndex}>
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
				<PageThree
					key={3}
					setActiveIndex={setActiveIndex}
					activeIndex={activeIndex}
				/>
			</TabView>
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
			<SafeAreaView
				edges={['top', 'bottom']}
				className="flex-1 px-4 bg-black/20">
				<View className=" flex-1 mb-16">
					<View className="flex-1 items-end mt-4 ">
						<Pressable onPress={() => router.push('/home')}>
							<Text size="lg" className="text-white font-medium">
								Skip
							</Text>
						</Pressable>
					</View>
					<View className=" gap-4">
						<View className="flex-row justify-between items-center">
							<Text
								size="4xl"
								className="font-bold font-heading w-[60%] text-white">
								Find Your Dream{' '}
								<Text
									size="4xl"
									className="text-[#FF4C00] font-bold font-heading">
									Home
								</Text>
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
									<ChevronRight color={'#FF4C00'} />
								</Pressable>
							</View>
						</View>
						<View className="flex-row justify-between items-center gap-16">
							<View className=" w-[60%]">
								<Text className=" text-white text-sm">
									Explore thousands of properties for sale and rent
								</Text>
							</View>
							<PageDots length={3} activeIndex={activeIndex} />
						</View>
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
			<SafeAreaView edges={['top']} className="flex-1 px-4 bg-black/20">
				<View className=" flex-1 mb-16">
					<View className="flex-1 items-end mt-4 ">
						<Pressable onPress={() => router.push('/signin')}>
							<Text size="lg" className="text-white font-medium">
								Skip
							</Text>
						</Pressable>
					</View>
					<View className=" gap-4">
						<View className="flex-row justify-between items-center">
							<View className="w-[65%]">
								<View className=" flex-row gap-1">
									<Text size="4xl" className="font-bold text-white">
										Which{' '}
									</Text>

									<Text size="4xl" className="font-bold text-white">
										are
									</Text>
								</View>
								<Text size="4xl" className="font-bold text-white">
									you interested in
								</Text>
							</View>
							<View className="relative justify-center items-center">
								{/* Animated Half Circle */}
								<CircleCurve step={activeIndex} />

								{/* Pressable Button */}
								<Pressable
									onPress={() => {
										setActiveIndex(2);
									}}
									className="bg-white w-12 h-12 rounded-full justify-center items-center m-1">
									<ChevronRight color={'#FF4C00'} />
								</Pressable>
							</View>
						</View>
						<View className="flex-row justify-between items-center gap-16">
							<View className=" w-[70%]">
								<Text className=" text-white text-sm">
									Filter by location, price, or property type to find exactly
									what you’re looking for.
								</Text>
							</View>
							<PageDots length={3} activeIndex={activeIndex} />
						</View>
					</View>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
}
function PageThree({
	setActiveIndex,
	activeIndex,
}: {
	setActiveIndex: (index: number) => void;
	activeIndex: number;
}) {
	return (
		<ImageBackground
			source={require('@/assets/images/landing/agent.png')}
			className="flex-1"
			imageStyle={{ resizeMode: 'cover' }}>
			<SafeAreaView edges={['top']} className="flex-1 px-4 bg-black/40">
				<View className="flex-1 mb-16">
					<View className="flex-1 items-end "></View>
					<View className=" gap-4 flex-row mb-2">
						<View className="flex-1">
							<Text size="4xl" className="font-bold w-[80%] text-white">
								Connect with Trusted{' '}
								<Text size="4xl" className="text-[#FF4C00] font-bold">
									Agents
								</Text>
							</Text>
						</View>
						<View className="relative justify-center items-center">
							{/* Animated Half Circle */}
							<CircleCurve step={activeIndex} />

							{/* Pressable Button */}
							<Pressable
								onPress={() => {
									setActiveIndex(1);
								}}
								className="bg-white w-12 h-12 rounded-full justify-center items-center m-1">
								<Check color={'#FF4C00'} />
							</Pressable>
						</View>
					</View>
					<View className="mb-6">
						<Text className=" text-white text-base">
							Get personalized assistance from verified and experienced real
							estate professionals.
						</Text>
					</View>
					<Button
						onPress={() => router.push('/signin')}
						variant="outline"
						size="xl"
						className="rounded-xl border-white">
						<ButtonText size="lg" className=" text-white font-semibold">
							Get Started
						</ButtonText>
					</Button>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
}
