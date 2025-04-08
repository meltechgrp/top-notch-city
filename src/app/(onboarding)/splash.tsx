import * as React from 'react';
import { router } from 'expo-router';
import { View, Text, Image, ImageBackground } from '@/components/ui';

export default function SplashScreen() {
	React.useEffect(() => {
		const timer = setTimeout(() => {
			router.replace('/onboarding');
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

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
				<Image
					source={require('@/assets/images/landing/splash-spin.png')}
					alt="Spinner"
					className="w-10 h-10"
				/>
			</View>
		</ImageBackground>
	);
}
