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
import { SpinningLoader } from '../loaders/SpinningLoader';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	update: (data: Me) => void;
};

function ProfileImageBottomSheet(props: Props) {
	const { visible, onDismiss } = props;
	const { compress, compressing, error: comError } = useMediaCompressor();
	const { request, loading } = useApiRequest<Me>();
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
		const data = await request({
			url: '/users/me',
			method: 'PUT',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		if (data) {
			props.update(data);
			showSnackbar({
				message: 'Profile photo updated successfully',
				type: 'success',
			});
			onDismiss();
		} else {
			showSnackbar({
				message: 'Failed to update photo.. try again',
				type: 'warning',
			});
		}
	}
	return (
		<BottomSheet
			title="Update profile picture"
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
