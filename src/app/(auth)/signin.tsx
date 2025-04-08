import OnboardingScreenContainer from '@/components/onboarding/OnboardingScreenContainer';
import { router } from 'expo-router';
import {
	FormControl,
	FormControlError,
	FormControlErrorText,
	FormControlErrorIcon,
	FormControlLabel,
	FormControlLabelText,
	FormControlHelper,
	FormControlHelperText,
	Input,
	InputField,
	Button,
	ButtonText,
	Text,
	View,
	VStack,
	AlertCircleIcon,
} from '@/components/ui';
import * as z from 'zod';
import React from 'react';

const formSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters long',
	}),
});

export default function SignIn() {
	const [isInvalid, setIsInvalid] = React.useState(false);
	const [inputValue, setInputValue] = React.useState('12345');
	const handleSubmit = () => {
		if (inputValue.length < 6) {
			setIsInvalid(true);
		} else {
			setIsInvalid(false);
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
			<VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
				<FormControl
					isInvalid={isInvalid}
					size="md"
					isDisabled={false}
					isReadOnly={false}
					isRequired={false}>
					<FormControlLabel>
						<FormControlLabelText>Password</FormControlLabelText>
					</FormControlLabel>
					<Input className="my-1" size={'md'}>
						<InputField
							type="password"
							placeholder="password"
							value={inputValue}
							onChangeText={(text) => setInputValue(text)}
						/>
					</Input>
					<FormControlHelper>
						<FormControlHelperText>
							Must be atleast 6 characters.
						</FormControlHelperText>
					</FormControlHelper>
					<FormControlError>
						<FormControlErrorIcon as={AlertCircleIcon} />
						<FormControlErrorText>
							Atleast 6 characters are required.
						</FormControlErrorText>
					</FormControlError>
				</FormControl>
				<Button
					className="w-fit self-end mt-4"
					size="sm"
					onPress={handleSubmit}>
					<ButtonText>Submit</ButtonText>
				</Button>
			</VStack>
		</OnboardingScreenContainer>
	);
}
