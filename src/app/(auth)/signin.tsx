import OnboardingScreenContainer from '@/components/onboarding/OnboardingScreenContainer';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
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
	AlertCircleIcon,
	Pressable,
} from '@/components/ui';
import React from 'react';
import { User } from 'lucide-react-native';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';

export default function SignIn() {
	// const { signIn, setActive, isLoaded } = useSignIn();
	// const [isSigningIn, setIsSigningIn] = React.useState(false);
	// const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);
	const router = useRouter();
	const [form, setForm] = React.useState({
		email: '',
		password: '',
	});
	const handleSubmit = async () => {
		if (process.env.EXPO_OS === 'ios') {
			await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		}
		router.push('/verify-otp');
		// if (form.password.length < 8) {
		// 	setIsInvalid({ ...isInvalid, password: true });
		// } else if (form.email.length < 5) {
		// 	setIsInvalid({ ...isInvalid, email: true });
		// } else {
		// 	setIsInvalid({ email: false, password: false });
		// }
	};
	// Handle the submission of the sign-in form

	function onBack() {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace('/onboarding');
		}
	}
	return (
		<OnboardingScreenContainer onBack={onBack}>
			<VStack className="w-[98%] max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl bg-background-200/90 p-6">
				<View className=" gap-2">
					<Text className=" text-3xl text-tertiary-500 font-semibold font-heading text-center">
						Welcome Back
					</Text>
					<Text className=" text-center">
						Create an account or log in to explore our app
					</Text>
				</View>
				<View>
					<FormControl size="lg" isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Email
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 bg-white rounded-xl px-4" size={'xl'}>
							<User size={20} color={'#6b7280'} />
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
					<FormControl size="md" isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Password
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 bg-white rounded-xl px-4" size={'xl'}>
							<User size={20} color={'#6b7280'} />
							<InputField
								type="password"
								placeholder="Password"
								value={form.password}
								onChangeText={(text) => setForm({ ...form, password: text })}
							/>
						</Input>
						<FormControlError>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText>
								Atleast 8 characters are required.
							</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<View className="items-end mt-2">
						<Pressable onPress={() => router.push('/(auth)/reset-password')}>
							<Text className=" text-tertiary-500 font-medium">
								Forgot Password ?
							</Text>
						</Pressable>
					</View>
				</View>

				<Button
					variant="solid"
					className="w-full mt-4"
					size="xl"
					onPress={handleSubmit}>
					<ButtonText>Submit</ButtonText>
				</Button>
				<View className=" flex-row justify-center gap-2 mt-4">
					<Text>Don’t have an account?</Text>
					<Pressable onPress={() => router.push('/(auth)/signup')}>
						<Text className=" text-tertiary-500 font-medium">Sign Up</Text>
					</Pressable>
				</View>
			</VStack>
		</OnboardingScreenContainer>
	);
}
