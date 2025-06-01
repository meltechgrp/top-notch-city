import { useRouter } from 'expo-router';
import success from '@/assets/lotties/success.json';
import { Box, Button, ButtonText, Text, View } from '@/components/ui';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';

export default function ListingSuccess() {
	const successRef = useRef<LottieView>(null);
	const router = useRouter();
	return (
		<>
			<Box className="flex-1 justify-start py-6 items-center px-4">
				<View className="px-2 justify-between items-center">
					<LottieView
						ref={successRef}
						style={{ width: 300, height: 300 }}
						speed={0.9}
						autoPlay
						source={success}
					/>
				</View>
				<View className=" mb-6">
					<Text className=" text-center px-4">
						Congratulations! Your property has been uploaded succesfully, and
						awaits approval.
					</Text>
				</View>

				<View className="flex-row gap-4">
					<Button
						variant="outline"
						className="flex-1 h-12 mt-4"
						size="md"
						onPress={() => router.dismissTo('/home')}>
						<ButtonText>Home</ButtonText>
					</Button>
					<Button
						variant="solid"
						className="flex-1 h-12 mt-4"
						size="md"
						onPress={() => router.dismissTo('/profile')}>
						<ButtonText>My Properties</ButtonText>
					</Button>
				</View>
			</Box>
		</>
	);
}
