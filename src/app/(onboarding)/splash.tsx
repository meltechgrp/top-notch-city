import * as React from 'react';
import { router } from 'expo-router';
import { View, Text, Image, ImageBackground } from '@/components/ui';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withTiming,
	Easing,
} from 'react-native-reanimated';

export default function SplashScreen() {
	const rotation = useSharedValue(0);

	React.useEffect(() => {
		// Start the infinite rotation
		rotation.value = withRepeat(
			withTiming(360, {
				duration: 2000,
				easing: Easing.linear,
			}),
			-1, // infinite
			false
		);

		const timer = setTimeout(() => {
			router.replace('/onboarding');
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	const spinStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotate: `${rotation.value}deg`,
				},
			],
		};
	});

	return (
		<ImageBackground
			source={require('@/assets/images/landing/splash-group.png')}
			className="flex-1"
			imageStyle={{ resizeMode: 'cover' }}>
			<View className="flex-1 justify-center items-center px-4">
				<Image
					source={require('@/assets/images/landing/splash-big.png')}
					className="w-80 object-cover mb-6"
					alt="Splash"
				/>
				<Text className="text-center  text-base">
					Find your dream home with ease! Explore listings, connect with
					realtors and make smarter real estate decisions – all in one app.
				</Text>
			</View>
			<View className="items-center mb-12">
				<Animated.Image
					source={require('@/assets/images/landing/splash-spin.png')}
					className="w-10 h-10"
					style={spinStyle}
				/>
			</View>
		</ImageBackground>
	);
}
