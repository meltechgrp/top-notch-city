import OnboardingScreenContainer from '@/components/onboarding/OnboardingScreenContainer';
import { router } from 'expo-router';
import {
	Button,
	ButtonText,
	Text,
	View,
	VStack,
	Pressable,
	Box,
} from '@/components/ui';
import React from 'react';
import OTPInput from '@/components/shared/OTPInput';

export default function VerifyOtp() {
	const [otp, setOtp] = React.useState('');
	const handleSubmit = () => {
		router.dismissTo('/(auth)/verify-success');
	};
	return (
		<OnboardingScreenContainer allowBack={false}>
			<Box className="w-[98%] bg-background/80 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
				<View className="gap-2 mb-4">
					<Text className=" text-3xl text-primary font-semibold font-heading text-center">
						Verify your gmail
					</Text>
					<Text className=" text-sm text-center">
						Enter the One-Time Password sent to your email to ensure a safe and
						secure login experience.
					</Text>
				</View>
				<OTPInput onTextChange={setOtp} />
				<View className="flex-row items-center mt-4">
					<Text className="text-typography text-lg">Resend code in </Text>
					<Text className="text-primary text-lg">
						{5}:{25 < 10 ? `0${0}` : 28}
					</Text>
				</View>
				<View className=" flex-row gap-2 mt-4">
					<Text>Haven’t got the email yet?</Text>
					<Pressable>
						<Text className=" text-primary font-medium">Resend email</Text>
					</Pressable>
				</View>
				<Button
					variant="solid"
					className="w-full mt-4"
					size="xl"
					onPress={handleSubmit}>
					<ButtonText>Verify</ButtonText>
				</Button>
			</Box>
		</OnboardingScreenContainer>
	);
}
