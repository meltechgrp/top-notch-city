import OnboardingScreenContainer from '@/components/onboarding/OnboardingScreenContainer';
import { router, useLocalSearchParams } from 'expo-router';
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
	Box,
	InputIcon,
} from '@/components/ui';
import React from 'react';
import { Lock } from 'lucide-react-native';
import { AlertCircleIcon } from '@/components/ui/icon';
import { useAuthMutations } from '@/tanstack/mutations/useAuthMutations';
import { showSnackbar } from '@/lib/utils';

export default function NewPassword() {
	const { email, code } = useLocalSearchParams() as {
		email: string;
		code: string;
	};
	const { mutateAsync, isPending } = useAuthMutations().resetPasswordMutation;
	const [isInvalid, setIsInvalid] = React.useState({
		password2: false,
		password: false,
	});
	const [form, setForm] = React.useState({
		password2: '',
		password: '',
	});
	const handleSubmit = async () => {
		if (form.password.length < 8) {
			setIsInvalid({ ...isInvalid, password: true });
		} else if (form.password2.length < 5) {
			setIsInvalid({ ...isInvalid, password2: true });
		} else {
			setIsInvalid({ password2: false, password: false });
		}
		try {
			await mutateAsync(
				{
					email,
					code,
					confirm_password: form.password2,
					new_password: form.password,
				},
				{
					onSuccess: () => {
						showSnackbar({
							message: 'Password reset code sent to your email.',
							type: 'success',
						});
						router.dismissTo('/password-success');
					},
					onError: () => {
						showSnackbar({
							message: 'Please try again!',
							type: 'warning',
						});
					},
				}
			);
		} catch (error) {}
	};
	console.log(email, code);
	return (
		<OnboardingScreenContainer allowBack={false}>
			<Box className="w-[98%] bg-background-muted/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
				<View>
					<Text className=" text-2xl text-primary font-semibold font-heading text-center">
						Set a new password
					</Text>
					<Text className=" text-center">
						Create a new password. Ensure it differs from previous ones for
						security
					</Text>
				</View>
				<View>
					<FormControl
						isInvalid={isInvalid.password}
						size="md"
						isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								New Password
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-xl px-4 h-16" size={'xl'}>
							<InputIcon as={Lock} />
							<InputField
								type="password"
								placeholder="********"
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
					<FormControl
						isInvalid={isInvalid.password2}
						size="md"
						isRequired={false}>
						<FormControlLabel>
							<FormControlLabelText className="font-light">
								Comfirm Password
							</FormControlLabelText>
						</FormControlLabel>
						<Input className="my-1 rounded-xl px-4 h-16" size={'xl'}>
							<InputIcon as={Lock} />
							<InputField
								type="password"
								placeholder="********"
								value={form.password2}
								onChangeText={(text) => setForm({ ...form, password2: text })}
							/>
						</Input>
						<FormControlError>
							<FormControlErrorIcon as={AlertCircleIcon} />
							<FormControlErrorText>
								Passwords do not match.
							</FormControlErrorText>
						</FormControlError>
					</FormControl>
				</View>

				<Button
					variant="solid"
					className="w-full mt-4"
					size="xl"
					onPress={handleSubmit}>
					<ButtonText>Update Password</ButtonText>
				</Button>
			</Box>
		</OnboardingScreenContainer>
	);
}
