import { router } from 'expo-router';
import success from '@/assets/lotties/success.json';
import { Box, Button, ButtonText, Text, View } from '@/components/ui';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';

export default function ListingSucces() {
	const successRef = useRef<LottieView>(null);
	function handleSubmit() {
		router.push('/home');
	}
	return (
		<>
			<Box className="flex-1 px-4">
				<View className="px-2 justify-between items-center">
					<LottieView
						ref={successRef}
						style={{ width: 250, height: 250 }}
						speed={0.9}
						autoPlay
						source={success}
					/>
				</View>
				<View className=" mb-6">
					<Text className=" text-center">
						Congratulations! Your account has been created Proceed to complete
						your profile
					</Text>
				</View>

				<Button
					variant="solid"
					className="w-full mt-4"
					size="xl"
					onPress={handleSubmit}>
					<ButtonText>Continue</ButtonText>
				</Button>
			</Box>
		</>
	);
}
