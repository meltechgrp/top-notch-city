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
	AlertCircleIcon,
	Pressable,
} from '@/components/ui';
import * as z from 'zod';
import React from 'react';
import { User } from 'lucide-react-native';

const formSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters long',
	}),
});

export default function VerifySuccess() {
	const [isInvalid, setIsInvalid] = React.useState({
		email: false,
		password: false,
	});
	const [form, setForm] = React.useState({
		email: '',
		password: '',
	});
	const handleSubmit = () => {
		if (form.password.length < 8) {
			setIsInvalid({ ...isInvalid, password: true });
		} else if (form.email.length < 5) {
			setIsInvalid({ ...isInvalid, email: true });
		} else {
			setIsInvalid({ email: false, password: false });
		}
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
			router.replace('/onboarding');
		}
	}
	return (
		<OnboardingScreenContainer onBack={onBack}>
			<VStack className="w-[98%] max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl bg-background-200/90 p-6">
				<View>
					<Text className=" text-2xl text-[#FF1500] font-semibold font-heading text-center">
						Welcome Back
					</Text>
					<Text className=" text-center">
						Create an account or log in to explore our app
					</Text>
				</View>
				<View>
					<FormControl isInvalid={isInvalid.email} size="lg" isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Email
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 bg-white rounded-xl px-4 h-14" size={'xl'}>
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
					<FormControl
						isInvalid={isInvalid.password}
						size="md"
						isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Password
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 bg-white rounded-xl px-4 h-16" size={'xl'}>
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
						<Pressable>
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
					<Pressable>
						<Text className=" text-tertiary-500 font-medium">Sign Up</Text>
					</Pressable>
				</View>
			</VStack>
		</OnboardingScreenContainer>
	);
}
