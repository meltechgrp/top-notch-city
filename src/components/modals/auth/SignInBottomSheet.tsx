import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
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
import React, { useEffect, useState } from 'react';
import { AlertCircleIcon, Lock, Mail } from 'lucide-react-native';
import { hapticFeed } from '@/components/HapticTab';
import { authLogin, loginWithSocial } from '@/actions/auth';
import { AuthLoginInput } from '@/lib/schema';
import { showSnackbar } from '@/lib/utils';
import { saveAuthToken } from '@/lib/secureStore';
import { useStore } from '@/store';
import { SpinningLoader } from '@/components/loaders/SpinningLoader';
import eventBus from '@/lib/eventBus';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { Divider } from '@/components/ui/divider';
import FacebookIcon from '@/components/icons/FacebookIcon';
import BottomSheet from '../../shared/BottomSheet';

WebBrowser.maybeCompleteAuthSession();

export default function SignInBottomSheet({ visible, onDismiss }: AuthModalProps) {
  const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<AuthLoginInput> | null>();
	const [request, response, promptAsync] = Google.useAuthRequest({
		androidClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_KEY,
		iosClientId: process.env.EXPO_PUBLIC_APPLE_AUTH_KEY,
	});

	const [request2, facebookRes, facebookAsync] = Facebook.useAuthRequest({
		clientId: '990600566300859',
	});
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
				useStore.setState((s) => ({
					...s,
					hasAuth: true,
				}));
				eventBus.dispatchEvent('REFRESH_PROFILE', null);
				router.push('/home');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	const handlePressAsync = async () => {
		const result = await facebookAsync();
		if (result.type !== 'success') {
			alert('Uh oh, something went wrong');
			return;
		}
	};
	useEffect(() => {
		if (
			facebookRes &&
			facebookRes.type === 'success' &&
			facebookRes.authentication
		) {
			(async () => {
				const userInfoResponse = await fetch(
					`https://graph.facebook.com/me?access_token=${facebookRes.authentication?.accessToken}&fields=id,name,picture.type(large)`
				);
				const userInfo = await userInfoResponse.json();
				console.log(userInfo);
			})();
		}
	}, [facebookRes]);
	useEffect(() => {
		handleEffect();
	}, [response]);

	async function handleEffect() {
		if (response?.type === 'success') {
			getUserInfo(response.authentication?.accessToken);
		}
	}

	const getUserInfo = async (token?: string) => {
		if (!token) return;
		try {
			const response = await fetch(
				'https://www.googleapis.com/userinfo/v2/me',
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const user = await response.json();
			const res = await loginWithSocial({
				email: user?.email,
				first_name: user?.family_name,
				last_name: user?.given_name,
			});
			if (res) {
				if (res?.access_token) {
					saveAuthToken(res.access_token);
				}
				useStore.setState((s) => ({
					...s,
					hasAuth: true,
				}));
				eventBus.dispatchEvent('REFRESH_PROFILE', null);
				router.push('/home');
			}
		} catch (error) {
			console.log(error);
		}
	};

  return (
    <BottomSheet visible={visible} onDismiss={onDismiss} snapPoint={['55%', '64%']} plain>
      <Box className="w-[98%] bg-background-muted/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6">
				<View className=" gap-2">
					<Text className=" text-3xl text-primary font-semibold font-heading text-center">
						Welcome Back
					</Text>
					<Text className=" text-center px-6">
						Create an account or log in to explore our app
					</Text>
				</View>
				<View className="flex-row gap-4">
					<Button
						variant="outline"
						className="flex-1 bg-background mt-4 gap-2"
						size="xl"
						onPress={() => {
							promptAsync();
						}}>
						<Icon as={GoogleIcon} />
						<ButtonText>Google</ButtonText>
					</Button>
					<Button
						variant="outline"
						className="flex-1 bg-background mt-4 gap-2"
						size="xl"
						onPress={() => {
							handlePressAsync();
						}}>
						<Icon as={FacebookIcon} />
						<ButtonText>Facebook</ButtonText>
					</Button>
				</View>
				<View className=" flex-row gap-3 items-center">
					<Divider className="flex-1" />
					<Text size="sm">OR</Text>
					<Divider className="flex-1" />
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
					{loading && <SpinningLoader />}
					<ButtonText>Submit</ButtonText>
				</Button>
				<View className=" flex-row justify-center gap-2 mt-4">
					<Text>Don’t have an account?</Text>
					<Pressable onPress={() => router.push('/signup')}>
						<Text className=" text-primary font-medium">Sign Up</Text>
					</Pressable>
				</View>
			</Box>
    </BottomSheet>
  );
}
