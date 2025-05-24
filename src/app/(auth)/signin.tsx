import OnboardingScreenContainer from '@/components/onboarding/OnboardingScreenContainer';
import { useRouter } from 'expo-router';
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
	Pressable,
	Box,
	InputIcon,
	Icon,
} from '@/components/ui';
import React, { useState } from 'react';
import { AlertCircleIcon, Loader, Lock, Mail } from 'lucide-react-native';
import { hapticFeed } from '@/components/HapticTab';
import { authLogin } from '@/actions/auth';
import { AuthLoginInput } from '@/lib/schema';
import { showSnackbar } from '@/lib/utils';
import { saveAuthToken } from '@/lib/secureStore';
import { getMe } from '@/actions/user';
import { useStore } from '@/store';

export default function SignIn() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<AuthLoginInput> | null>();
	const [form, setForm] = React.useState({
		email: '',
		password: '',
	});
	const handleSubmit = async () => {
		hapticFeed();
		setLoading(true);
		try {
			const state = await authLogin(form);
			setErrors(null);

			if (state?.fieldError) {
				setErrors(state.fieldError);
			} else if (state?.formError) {
				showSnackbar({
					message: state.formError,
					type: 'error',
				});
			} else if (state?.data) {
				const { email, message, access_token } = state.data as {
					access_token: string;
					message: string;
					email: string;
				};
				if (access_token) {
					saveAuthToken(access_token);
				}
				const me = await getMe();
				if (me) {
					useStore.setState((s) => ({
						...s,
						me,
						hasAuth: true,
					}));
				}
				router.push('/home');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	function onBack() {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace('/onboarding');
		}
	}
	return (
		<OnboardingScreenContainer onBack={onBack}>
			<Box className="w-[98%] bg-background-muted/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
				<View className=" gap-2">
					<Text className=" text-3xl text-primary font-semibold font-heading text-center">
						Welcome Back
					</Text>
					<Text className=" text-center px-6">
						Create an account or log in to explore our app
					</Text>
				</View>
				<View>
					<FormControl size="lg" isInvalid={!!errors?.email}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Email
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1  rounded-xl px-4 h-12">
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
							<FormControlErrorText>{errors?.email}</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<FormControl size="md" isInvalid={!!errors?.password}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Password
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-xl px-4 h-12">
							<InputIcon size="sm" as={Lock} />
							<InputField
								type="password"
								placeholder="Password"
								value={form.password}
								onChangeText={(text) => setForm({ ...form, password: text })}
							/>
						</Input>
						<FormControlError>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText>{errors?.password}</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<View className="items-end mt-2">
						<Pressable onPress={() => router.push('/(auth)/reset-password')}>
							<Text className=" text-primary font-medium">
								Forgot Password ?
							</Text>
						</Pressable>
					</View>
				</View>

				<Button
					variant="solid"
					className="w-full mt-4 gap-2"
					size="xl"
					onPress={handleSubmit}>
					{loading && (
						<Icon as={Loader} color="white" className=" animate-spin" />
					)}
					<ButtonText>Submit</ButtonText>
				</Button>
				<View className=" flex-row justify-center gap-2 mt-4">
					<Text>Don’t have an account?</Text>
					<Pressable onPress={() => router.push('/signup')}>
						<Text className=" text-primary font-medium">Sign Up</Text>
					</Pressable>
				</View>
			</Box>
		</OnboardingScreenContainer>
	);
}
