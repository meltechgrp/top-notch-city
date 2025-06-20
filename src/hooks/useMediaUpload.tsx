import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uniqueId } from 'lodash-es';
import { showSnackbar } from '@/lib/utils';
import { useMediaCompressor } from './useMediaCompressor';

type MediaType = 'image' | 'video';

type UploadResult = { uri: string; id: string }[];

type UseMediaUploadOptions = {
	onSuccess: (media: UploadResult) => void;
	type: MediaType;
	maxSelection?: number;
};

export function useMediaUpload({
	onSuccess,
	type,
	maxSelection,
}: UseMediaUploadOptions) {
	const [loading, setLoading] = useState(false);
	const { compress } = useMediaCompressor();

	const compressor = async (data: { uri: string }[]) => {
		const result = await Promise.all(
			data.map((file) =>
				compress({
					type,
					uri: file.uri,
					compressionRate: type === 'image' ? 0.4 : undefined,
					maxWidth: type === 'image' ? 720 : undefined,
				})
			)
		);

		const compressed = result
			.filter((item) => item !== null)
			.map((item) => ({
				uri: item!,
				id: uniqueId(),
			}));

		setLoading(false);

		if (compressed.length === 0) {
			showSnackbar({
				message: 'Failed to upload.. try again',
				type: 'warning',
			});
		} else {
			onSuccess(compressed);
		}
	};

	const pickMedia = async () => {
		setLoading(true);
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: type === 'image' ? ['images'] : ['videos'],
			selectionLimit: maxSelection,
			orderedSelection: true,
			allowsMultipleSelection: type === 'image',
			quality: type === 'video' ? 1 : undefined,
			aspect: [4, 3],
			videoMaxDuration: 1200,
			videoQuality:
				type === 'video'
					? ImagePicker.UIImagePickerControllerQualityType.Low
					: undefined,
		});
		if (!result.canceled) {
			await compressor(result.assets.map((asset) => ({ uri: asset.uri })));
		} else {
			setLoading(false);
		}
	};

	const takeMedia = async () => {
		const permitted = await ImagePicker.getCameraPermissionsAsync();
		if (
			permitted.status === ImagePicker.PermissionStatus.DENIED ||
			permitted.status === ImagePicker.PermissionStatus.UNDETERMINED
		) {
			await ImagePicker.requestCameraPermissionsAsync();
		}
		setLoading(true);
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: type === 'image' ? ['images'] : ['videos'],
			cameraType: ImagePicker.CameraType.back,
			quality: type === 'video' ? 0.6 : undefined,
			aspect: [4, 3],
			allowsEditing: true,
			videoMaxDuration: 1200,
		});
		if (!result.canceled) {
			await compressor(result.assets.map((asset) => ({ uri: asset.uri })));
		} else {
			setLoading(false);
		}
	};

	return {
		loading,
		pickMedia,
		takeMedia,
	};
}
