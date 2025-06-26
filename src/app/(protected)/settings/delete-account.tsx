import { Alert, View } from 'react-native';
import { Button, ButtonText, Icon, Text } from '@/components/ui';
import { showSnackbar } from '@/lib/utils';
import { SpinningLoader } from '@/components/loaders/SpinningLoader';
import { TriangleAlert } from 'lucide-react-native';
import { useStore } from '@/store';
import { useNavigationContainerRef, useRouter } from 'expo-router';
import useResetAppState from '@/hooks/useResetAppState';
import { CommonActions } from '@react-navigation/native';
import { Fetch } from '@/actions/utills';

export default function DeleteAccount() {
	const { me } = useStore();
	const router = useRouter();
	const resetAppState = useResetAppState();
	const navigation = useNavigationContainerRef();
	async function handleDelete() {
		if (!me?.id) {
			return showSnackbar({
				message: 'Account id not found',
				type: 'info',
			});
		}

		const data = await Fetch(`/users/me/${me.id}`, {
			method: 'DELETE',
		});
		await resetAppState();
		if (data) {
			showSnackbar({
				message: 'Profile name updated successfully',
				type: 'success',
			});

			navigation?.dispatch(
				CommonActions.reset({
					routes: [
						{
							name: '(auth)',
							state: {
								routes: [{ name: 'onboarding' }],
							},
						},
						{
							name: '(auth)',
							state: {
								routes: [{ name: 'signin' }],
							},
						},
					],
				})
			);
		} else {
			showSnackbar({
				message: 'Failed to update.. try again',
				type: 'warning',
			});
		}
	}

	async function onDelete() {
		Alert.alert(
			'Delete Account',
			'Are you sure you want to delete your account?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Logout',
					style: 'destructive',
					onPress: async () => {
						handleDelete();
					},
				},
			],
			{}
		);
	}
	return (
		<View className="flex-1 gap-8 p-4 pb-8 bg-background">
			<View className=" gap-4 flex-row">
				<Icon as={TriangleAlert} className="text-primary w-8 h-8" />
				<View className="gap-2">
					<Text size="xl" className="font-medium">
						Deleting your account will:
					</Text>
					<View className="gap-1">
						<View className="flex-row gap-1 items-center">
							<Text>•</Text>
							<Text>Delete your account info and profile photo</Text>
						</View>
						<View className="flex-row gap-1 items-center">
							<Text>•</Text>
							<Text>Delete your uploaded properties</Text>
						</View>
						<View className="flex-row gap-1 items-center">
							<Text>•</Text>
							<Text>Delete your message history on this phone</Text>
						</View>
					</View>
				</View>
			</View>
			<View className="flex-row gap-4">
				<Button className="h-11 flex-1" onPress={onDelete}>
					{/* {loading && <SpinningLoader />} */}
					<ButtonText className=" text-white">Delete</ButtonText>
				</Button>
			</View>
			<View className="flex-row gap-4">
				<Button
					className="h-11 flex-1 bg-background-muted"
					onPress={() => router.back()}>
					{/* {loading && <SpinningLoader />} */}
					<ButtonText className=" text-white">Cancel</ButtonText>
				</Button>
			</View>
		</View>
	);
}
