import eventBus from '@/lib/eventBus';
import { ImagePickerAsset } from 'expo-image-picker';
import { compressImage } from '@/lib/utils';
import { useApiRequest } from '@/lib/api';

export async function setProfileImage(image: ImagePickerAsset, user: string) {
	try {
		if (!image) return;
		const { request, data, error } = useApiRequest<Me>();
		const formData = new FormData();
		const newImage = await compressImage(image.uri);
		formData.append('profile_image', {
			uri: newImage.uri,
			name: `${user}.webp`,
			type: 'image/jpeg',
		} as any);
		await request({
			url: '/users/me',
			method: 'PUT',
			data: formData,
		});
		console.log(data);
		eventBus.dispatchEvent('REFRESH_PROFILE', null);
		return data;
	} catch (error) {
		console.log(error);
	}
}
