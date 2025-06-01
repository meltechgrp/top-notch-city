import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Icon, Pressable, Text } from '../ui';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon } from 'lucide-react-native';
import { Divider } from '../ui/divider';
import { showSnackbar } from '@/lib/utils';
import { useMediaCompressor } from '@/hooks/useMediaCompressor';
import { useApiRequest } from '@/lib/api';
import eventBus from '@/lib/eventBus';
import { SpinningLoader } from '../loaders/SpinningLoader';

type Props = {
	visible: boolean;
	onDismiss: () => void;
};

function ProfileImageBottomSheet(props: Props) {
	const { visible, onDismiss } = props;
	const { compress, compressing, error: comError } = useMediaCompressor();
	const { request, data, loading, error } = useApiRequest();
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: 'images',
			allowsEditing: true,
			aspect: [4, 3],
		});
		if (!result.canceled && result.assets.length > 0) {
			await handleUpload(result.assets[0].uri);
		}
	};

	const takeImage = async () => {
		const permitted = await ImagePicker.getCameraPermissionsAsync();
		if (
			permitted.status == ImagePicker.PermissionStatus.DENIED ||
			permitted.status == ImagePicker.PermissionStatus.UNDETERMINED
		) {
			return await ImagePicker.requestCameraPermissionsAsync();
		}
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: 'images',
			cameraType: ImagePicker.CameraType.back,
			allowsEditing: true,
			aspect: [4, 3],
		});

		if (!result.canceled) {
			await handleUpload(result.assets[0].uri);
		}
	};
	async function handleUpload(uri: string) {
		const formData = new FormData();
		const result = await compress({
			type: 'image',
			uri: uri,
			compressionRate: 0.4,
		});
		if (!result || comError) {
			showSnackbar({
				message: 'Failed to upload.. try again',
				type: 'warning',
			});
		}
		formData.append('profile_image', {
			uri: result,
			name: `user.jpg`,
			type: 'image/jpeg',
		} as any);
		console.log(formData);
		await request({
			url: '/users/me',
			method: 'PUT',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		if (data) {
			eventBus.dispatchEvent('REFRESH_PROFILE', null);
			showSnackbar({
				message: 'Profile uploaded successfully',
				type: 'success',
			});
			onDismiss();
		} else {
			showSnackbar({
				message: 'Failed to upload.. try again',
				type: 'warning',
			});
		}
	}
	return (
		<BottomSheet
			title="Upload profile picture"
			withHeader={true}
			snapPoint={'25%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View className=" flex-1 gap-4 px-4 py-2  bg-background">
				<View className=" bg-background-muted rounded-xl">
					<Pressable
						disabled={loading}
						className=" h-14 flex-row justify-between items-center p-4"
						onPress={takeImage}>
						<Text size="xl" className=" font-normal">
							Take photo
						</Text>
						{loading || compressing ? (
							<SpinningLoader />
						) : (
							<Icon as={Camera} size="xl" className="text-typography" />
						)}
					</Pressable>
					<Divider />
					<Pressable
						disabled={loading}
						className=" h-14 flex-row justify-between items-center p-4"
						onPress={pickImage}>
						<Text size="xl" className=" font-normal">
							Choose photo
						</Text>
						{loading || compressing ? (
							<SpinningLoader />
						) : (
							<Icon as={ImageIcon} size="xl" className="text-typography" />
						)}
					</Pressable>
				</View>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(ProfileImageBottomSheet);
