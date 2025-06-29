import OnboardingScreenContainer from '@/components/onboarding/OnboardingScreenContainer';
import { router } from 'expo-router';
import {
	Button,
	ButtonText,
	Text,
	View,
	Pressable,
	Box,
	Icon,
} from '@/components/ui';
import React from 'react';
import OTPInput from '@/components/custom/OTPInput';
import { useLocalSearchParams } from 'expo-router';
import { hapticFeed } from '@/components/HapticTab';
import { authOptVerify } from '@/actions/auth';
import { useTempStore } from '@/store';
import { showSnackbar } from '@/lib/utils';
import { Loader } from 'lucide-react-native';

export default function VerifyOtp() {
	const params = useLocalSearchParams<{
		activeOtpTimeLeft?: string;
		type?: 'login';
	}>();
	const [otp, setOtp] = React.useState('');
	const email = useTempStore((s) => s.kyc?.email);
	const [loading, setLoading] = React.useState(false);

	// ! todo: code smell, to cleanup
	const initialActiveOtpTimeLeft = params.activeOtpTimeLeft
		? parseInt(params.activeOtpTimeLeft) > 0
			? parseInt(params.activeOtpTimeLeft)
			: undefined
		: undefined;

	const isValid = React.useMemo(() => /\d{6,6}$/.test(otp), [otp]);
	const handleSubmit = async () => {
		if (!isValid) return;
		if (!email) return;
		hapticFeed();
		setLoading(true);
		try {
			const state = await authOptVerify({
				otp,
				email: email,
			});
			if (state?.formError) {
				showSnackbar({
					message: state.formError,
					type: 'error',
				});
			} else if (state?.data) {
				router.dismissTo('/(auth)/verify-success');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const [countdown, setCountdown] = React.useState(
		initialActiveOtpTimeLeft || 300
	); // 5 minutes in seconds

	React.useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prevCountdown) => {
				if (prevCountdown === 0) {
					clearInterval(timer);
					return 0;
				}
				return prevCountdown - 1;
			});
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const minutes = Math.floor(countdown / 60);
	const seconds = countdown % 60;
	return (
		<OnboardingScreenContainer allowBack={false}>
			<Box className="w-[98%] bg-background-muted/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
				<View className="gap-2 mb-4">
					<Text className=" text-3xl text-primary font-semibold font-heading text-center">
						Verify your Email
					</Text>
					<Text className=" text-sm text-center">
						Enter the One-Time Password sent to your email to ensure a safe and
						secure login experience.
					</Text>
				</View>
				<OTPInput onTextChange={setOtp} />
				{countdown > 0 && (
					<View className="flex-row items-center mt-4">
						<Text className="text-typography text-lg">Resend code in </Text>

						<Text className="text-primary text-lg">
							{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
						</Text>
					</View>
				)}
				{countdown <= 0 && (
					<View className=" flex-row gap-2 mt-4">
						<Text>Haven’t got the email yet?</Text>
						<Pressable>
							<Text className=" text-primary font-medium">Resend email</Text>
						</Pressable>
					</View>
				)}
				<Button
					variant="solid"
					className="w-full mt-4"
					size="xl"
					disabled={loading || !isValid}
					onPress={handleSubmit}>
					{loading && (
						<Icon as={Loader} color="white" className=" animate-spin" />
					)}
					<ButtonText>Verify</ButtonText>
				</Button>
			</Box>
		</OnboardingScreenContainer>
	);
}
