import OnboardingScreenContainer from '@/components/onboarding/OnboardingScreenContainer';
import { router } from 'expo-router';
import success from '@/assets/lotties/success.json';
import { Button, ButtonText, Text, View, VStack } from '@/components/ui';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';

export default function VerifySuccess() {
	const successRef = useRef<LottieView>(null);
	function handleSubmit() {
		router.push('/home');
	}

	useEffect(() => {
		successRef.current?.play();
	}, []);
	return (
		<OnboardingScreenContainer>
			<VStack className="w-[98%] max-w-[26rem] mt-4 mx-auto rounded-xl bg-background-200/90 p-6">
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
			</VStack>
		</OnboardingScreenContainer>
	);
}
