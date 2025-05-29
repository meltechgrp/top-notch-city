import Animated, {
	useAnimatedProps,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import {
	Button,
	ButtonText,
	Icon,
	Pressable,
	Text,
	useResolvedTheme,
	View,
} from '../ui';
import React, { useState } from 'react';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Loader, Upload } from 'lucide-react-native';
import { cn, showSnackbar } from '@/lib/utils';
import { Platform } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { Colors } from '@/constants/Colors';
import { Listing } from '@/store';
import { uploadProperty } from '@/actions/property';
import FullHeightLoaderWrapper from '../loaders/FullHeightLoaderWrapper';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
	step: number;
	listing: Listing;
	totalSteps: number;
	onUpdate: (step: number, back?: boolean) => void;
	setLoading: (back: boolean) => void;
};

export default function ListingBottomNavigation({
	step,
	totalSteps,
	listing,
	onUpdate,
	setLoading,
}: Props) {
	const colorSchemeName = useResolvedTheme();
	async function handleUpload() {
		if (listing.step == 6 && !listing?.title)
			return showSnackbar({
				message: 'Please enter property title!',
				type: 'warning',
			});
		if (listing.step == 6 && !listing?.price)
			return showSnackbar({
				message: 'Please enter property price!',
				type: 'warning',
			});

		try {
			setLoading(true);
			const res = await uploadProperty(listing);
			if (res?.formError) {
				showSnackbar({
					message: res.formError,
					type: 'warning',
				});
			}
			// else {
			// 	onUpdate(step + 1);
			// }
		} catch (error) {
			console.log(error);
			showSnackbar({
				message: 'Something went wrong!',
				type: 'error',
			});
		} finally {
			setLoading(false);
		}
	}
	React.useEffect(() => {
		if (Platform.OS == 'android') {
			SystemNavigationBar.setNavigationColor(
				colorSchemeName == 'dark'
					? Colors.light.background
					: Colors.dark.background
			);
		}
	}, [colorSchemeName]);
	return (
		<View
			className={cn(
				' fixed bottom-0 z-50 left-0 right-0',
				step == 7 && 'hidden'
			)}>
			<SafeAreaView edges={['bottom']}>
				<View className=" flex-row backdrop-blur-sm bg-background border-t h-20 border-outline px-4  justify-center items-center">
					<Button
						onPress={() => onUpdate(step - 1, true)}
						size="lg"
						variant="link"
						disabled={step == 1}
						className={cn('mr-auto gap-1', step == 1 && 'opacity-0')}>
						<Icon as={ChevronLeft} />
						<Text>Back</Text>
					</Button>
					{step == 6 ? (
						<Button
							size="xl"
							className="px-6"
							onPress={async () => await handleUpload()}>
							<ButtonText>Upload</ButtonText>
							<Icon size="sm" as={Upload} color="white" />
						</Button>
					) : (
						<View className="relative justify-center items-center">
							{/* Animated Half Circle */}
							<CircleCurve step={step} total={totalSteps} />

							<Pressable
								onPress={() => onUpdate(step + 1)}
								className="bg-[#FF4C00] absolute top-1 w-10 h-10 rounded-full justify-center items-center m-1">
								<ChevronRight color={'white'} />
							</Pressable>
						</View>
					)}
				</View>
			</SafeAreaView>
		</View>
	);
}

function CircleCurve({ step, total }: { step: number; total: number }) {
	const progress = useSharedValue(0); // 0 to 1

	// Arc math
	const size = 50;
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
