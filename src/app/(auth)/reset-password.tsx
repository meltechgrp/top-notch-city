import OnboardingScreenContainer from '@/components/onboarding/OnboardingScreenContainer';
import { router } from 'expo-router';
import {
	FormControl,
	FormControlError,
	FormControlErrorText,
	FormControlErrorIcon,
	FormControlLabel,
	FormControlLabelText,
	Input,
	InputField,
	Button,
	ButtonText,
	Text,
	View,
	VStack,
	Box,
	InputIcon,
} from '@/components/ui';
import * as z from 'zod';
import React from 'react';
import { AlertCircleIcon, Mail, User } from 'lucide-react-native';

const formSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters long',
	}),
});

export default function ResetPassword() {
	const [isInvalid, setIsInvalid] = React.useState({
		email: false,
	});
	const [form, setForm] = React.useState({
		email: '',
	});
	const handleSubmit = () => {
		router.dismissTo('/(auth)/new-password');
		// if (form.email.length < 5) {
		// 	setIsInvalid({ ...isInvalid, email: true });
		// } else {
		// 	setIsInvalid({ email: false });
		// }
	};
	function onBack() {
		if (router.canGoBack()) {
			router.back();
		} else {
			/*
			 * Make it so we can go back to onboarding screen if app starts from here.
			 */
			// removeAuthToken();
			// useStore.getState().resetStore();
			// useTempStore.getState().resetStore();
			router.replace('/signin');
		}
	}
	return (
		<OnboardingScreenContainer onBack={onBack}>
			<Box className="w-[98%] max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6 pb-16">
				<View className=" gap-2">
					<Text className=" text-2xl text-primary font-semibold font-heading text-center">
						Forgot password
					</Text>
					<Text className=" text-center">
						Please enter your email to reset the password
					</Text>
				</View>
				<View>
					<FormControl isInvalid={isInvalid.email} size="lg" isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Email
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-xl px-4 h-14" size={'xl'}>
							<InputIcon as={Mail} />
							<InputField
								type="text"
								placeholder="Email"
								value={form.email}
								onChangeText={(text) => setForm({ ...form, email: text })}
							/>
						</Input>
						<FormControlError>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText>
								enter a valid email address.
							</FormControlErrorText>
						</FormControlError>
					</FormControl>
				</View>

				<Button
					variant="solid"
					className="w-full mt-8"
					size="xl"
					onPress={handleSubmit}>
					<ButtonText>Reset Password</ButtonText>
				</Button>
			</Box>
		</OnboardingScreenContainer>
	);
}
