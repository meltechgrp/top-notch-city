import OnboardingScreenContainer from '@/components/onboarding/OnboardingScreenContainer';
import { router } from 'expo-router';
import success from '@/assets/lotties/success.json';
import { Box, Button, ButtonText, Text, View } from '@/components/ui';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';

export default function VerifySuccess() {
	const successRef = useRef<LottieView>(null);
	function handleSubmit() {
		router.dismissAll();
	}

	useEffect(() => {
		successRef.current?.play();
	}, []);
	return (
		<OnboardingScreenContainer allowBack={false}>
			<Box className="w-[98%] bg-background-muted/90 max-w-[26rem] mt-4 mx-auto rounded-xl p-6">
				<View className="px-2 justify-between items-center">
					<LottieView
						ref={successRef}
						style={{ width: 250, height: 250 }}
						speed={0.9}
						source={success}
					/>
				</View>
				<View className=" mb-6">
					<Text className=" text-center">
						Congratulations! Your password has been changed. Click continue to
						Sign In
					</Text>
				</View>

				<Button
					variant="solid"
					className="w-full mt-4"
					size="xl"
					onPress={handleSubmit}>
					<ButtonText>Sign In</ButtonText>
				</Button>
			</Box>
		</OnboardingScreenContainer>
	);
}
