import Animated, {
	useAnimatedProps,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { Button, Icon, Pressable, Text, View } from '../ui';
import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
	step: number;
	totalSteps: number;
	onUpdate: (step: number) => void;
};

export default function ListingBottomNavigation({
	step,
	totalSteps,
	onUpdate,
}: Props) {
	return (
		<View className=" fixed bottom-0 z-50 left-0 right-0">
			<SafeAreaView edges={['bottom']}>
				<View className=" flex-row backdrop-blur-sm bg-background/50 border-t h-24 border-outline-300 px-4 py-6 justify-center items-center">
					<Button
						onPress={() => onUpdate(step - 1)}
						size="lg"
						variant="link"
						disabled={step == 1}
						className={cn('mr-auto gap-1', step == 1 && 'opacity-0')}>
						<Icon as={ChevronLeft} />
						<Text>Back</Text>
					</Button>
					<View className="relative justify-center items-center">
						{/* Animated Half Circle */}
						<CircleCurve step={step} total={totalSteps} />

						<Pressable
							onPress={() => onUpdate(step + 1)}
							className="bg-[#FF4C00] absolute -top-1 w-12 h-12 rounded-full justify-center items-center m-1">
							<ChevronRight color={'white'} />
						</Pressable>
					</View>
				</View>
			</SafeAreaView>
		</View>
	);
}

function CircleCurve({ step, total }: { step: number; total: number }) {
	const progress = useSharedValue(0); // 0 to 1

	// Arc math
	const size = 56;
	const strokeWidth = 5;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	const animatedProps = useAnimatedProps(() => ({
		strokeDashoffset: circumference * (1 - progress.value),
	}));

	React.useEffect(() => {
		let nextProgress = step / total;

		progress.value = withTiming(nextProgress, { duration: 1000 });
	}, [step]);
	return (
		<Svg width={size} height={size}>
			{/* Background Border */}
			<Circle
				stroke="gray"
				fill="none"
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeWidth={strokeWidth}
			/>

			{/* Animated Foreground Arc */}
			<AnimatedCircle
				stroke="#FF4C00"
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
