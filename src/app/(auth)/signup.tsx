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
	Pressable,
	Checkbox,
	CheckboxLabel,
	CheckboxIcon,
	CheckboxIndicator,
	Box,
	InputIcon,
} from '@/components/ui';
import * as z from 'zod';
import React from 'react';
import {
	AlertCircleIcon,
	CheckIcon,
	Lock,
	Mail,
	User,
} from 'lucide-react-native';

const formSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters long',
	}),
});

export default function SignUp() {
	const [isInvalid, setIsInvalid] = React.useState({
		email: false,
		password: false,
		username: false,
	});
	const [form, setForm] = React.useState({
		email: '',
		password: '',
		username: '',
		isChecked: false,
	});
	const handleSubmit = () => {
		if (form.password.length < 8) {
			setIsInvalid({ ...isInvalid, password: true });
		} else if (form.email.length < 5 || form.username.length < 5) {
			setIsInvalid({ ...isInvalid, email: true });
		} else {
			setIsInvalid({ email: false, password: false, username: false });
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
			<Box className="w-[98%] bg-background/80 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
				<View>
					<Text className=" text-2xl text-[#FF1500] font-semibold font-heading text-center">
						Create an Account
					</Text>
					<Text className=" text-center">
						Create an account to explore our app
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
					<FormControl
						isInvalid={isInvalid.username}
						size="lg"
						isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Username
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-xl px-4 h-14" size={'xl'}>
							<InputIcon as={User} />
							<InputField
								type="text"
								placeholder="Username"
								value={form.username}
								onChangeText={(text) => setForm({ ...form, username: text })}
							/>
						</Input>
						<FormControlError>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText>
								enter a unique username.
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
						<Input className="my-1 rounded-xl px-4 h-16" size={'xl'}>
							<InputIcon as={Lock} />
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
					<Checkbox
						value="terms"
						size="md"
						className="mt-2 px-1"
						isChecked={form.isChecked}
						onChange={(state) => setForm({ ...form, isChecked: state })}
						isInvalid={false}
						isDisabled={false}>
						<CheckboxIndicator>
							<CheckboxIcon as={CheckIcon} />
						</CheckboxIndicator>
						<CheckboxLabel className=" text-wrap">
							I have read and accept the terms and condition.
						</CheckboxLabel>
					</Checkbox>
				</View>

				<Button
					variant="solid"
					className="w-full mt-4"
					size="xl"
					onPress={handleSubmit}>
					<ButtonText>Sign Up</ButtonText>
				</Button>
				<View className=" flex-row justify-center gap-2 mt-4">
					<Text>Already have an account?</Text>
					<Pressable onPress={() => router.push('/(auth)/signin')}>
						<Text className=" text-primary font-medium">Sign In</Text>
					</Pressable>
				</View>
			</Box>
		</OnboardingScreenContainer>
	);
}
