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
	Pressable,
	Checkbox,
	CheckboxLabel,
	CheckboxIcon,
	CheckboxIndicator,
	Box,
	InputIcon,
	Icon,
} from '@/components/ui';
import React, { useState } from 'react';
import {
	AlertCircleIcon,
	CheckIcon,
	Loader,
	Lock,
	Mail,
	User,
} from 'lucide-react-native';
import { removeAuthToken, saveAuthToken } from '@/lib/secureStore';
import { useStore, useTempStore } from '@/store';
import { AuthSignupInput } from '@/lib/schema';
import { authSignup } from '@/actions/auth';
import { hapticFeed } from '@/components/HapticTab';
import { showSnackbar } from '@/lib/utils';
import eventBus from '@/lib/eventBus';

export default function SignUp() {
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<AuthSignupInput> | null>();
	const [form, setForm] = React.useState<
		AuthSignupInput & { isChecked: boolean }
	>({
		email: '',
		first_name: '',
		last_name: '',
		password: '',
		comfirmPassword: '',
		isChecked: false,
	});
	const handleSubmit = async () => {
		if (!form.isChecked) return;
		hapticFeed();
		setLoading(true);
		try {
			const state = await authSignup(form);
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
				showSnackbar({
					message: message,
					type: 'success',
				});
				if (access_token) {
					saveAuthToken(access_token);
				}

				useTempStore.setState((v) => ({
					...v,
					kyc: {
						email: form.email,
					},
				}));

				useStore.setState((s) => ({
					...s,
					hasAuth: true,
				}));
				eventBus.dispatchEvent('REFRESH_PROFILE', null);
				router.push({
					pathname: '/verify-otp',
					params: {
						type: 'signup',
						activeOtpTimeLeft: '300',
					},
				});
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
			removeAuthToken();
			useStore.getState().resetStore();
			useTempStore.getState().resetStore();
			router.replace('/onboarding');
		}
	}
	return (
		<OnboardingScreenContainer onBack={onBack}>
			<Box className="w-[98%] bg-background-muted/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
				<View>
					<Text
						size="3xl"
						className=" text-primary font-semibold font-heading text-center">
						Create an Account
					</Text>
					<Text className=" text-center">
						Create an account to explore our app
					</Text>
				</View>
				<View>
					<FormControl size="lg" isInvalid={!!errors?.email}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Email
							</FormControlLabelText>
						</FormControlLabel>
						<Input size="md" className="my-1  rounded-xl px-4 h-12">
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
					<FormControl
						isInvalid={!!errors?.first_name}
						size="lg"
						isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								First Name
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-xl px-4 h-12" size={'md'}>
							<InputIcon as={User} />
							<InputField
								type="text"
								placeholder="First Name"
								value={form.first_name}
								onChangeText={(text) => setForm({ ...form, first_name: text })}
							/>
						</Input>
						<FormControlError>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText>{errors?.first_name}</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<FormControl
						isInvalid={!!errors?.last_name}
						size="lg"
						isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Last Name
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-xl px-4 h-12" size={'md'}>
							<InputIcon as={User} />
							<InputField
								type="text"
								placeholder="Last Name"
								value={form.last_name}
								onChangeText={(text) => setForm({ ...form, last_name: text })}
							/>
						</Input>
						<FormControlError>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText>{errors?.last_name}</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<FormControl isInvalid={!!errors?.password} size="md">
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Password
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-xl px-4 h-12" size={'md'}>
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
							<FormControlErrorText>{errors?.password}</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<FormControl isInvalid={!!errors?.comfirmPassword} size="md">
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Comfirm Password
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-xl px-4 h-12" size={'md'}>
							<InputIcon as={Lock} />
							<InputField
								type="password"
								placeholder="Comfirm Password"
								value={form.comfirmPassword}
								onChangeText={(text) =>
									setForm({ ...form, comfirmPassword: text })
								}
							/>
						</Input>
						<FormControlError>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText>
								{errors?.comfirmPassword}
							</FormControlErrorText>
						</FormControlError>
					</FormControl>
					<Checkbox
						value="terms"
						size="md"
						className="mt-2 px-1"
						isChecked={form.isChecked}
						onChange={(state) => setForm({ ...form, isChecked: state })}>
						<CheckboxIndicator>
							<CheckboxIcon as={CheckIcon} />
						</CheckboxIndicator>
						<CheckboxLabel className=" text-wrap text-typography">
							I have read and accept the terms and condition.
						</CheckboxLabel>
					</Checkbox>
				</View>

				<Button
					variant="solid"
					className="w-full mt-4 gap-2"
					size="xl"
					disabled={!form.isChecked}
					onPress={handleSubmit}>
					{loading && (
						<Icon as={Loader} color="white" className=" animate-spin" />
					)}
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
