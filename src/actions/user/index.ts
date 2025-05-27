import { fetchWithAuth } from '@/lib/api';
import eventBus from '@/lib/eventBus';
import { ImagePickerAsset } from 'expo-image-picker';

export async function getMe() {
	try {
		const res = await fetchWithAuth('/users/me', {});
		const data = await res.json();
		return data as Me;
	} catch (error) {
		console.log(error);
	}
}

export async function getUsers() {
	try {
		const res = await fetchWithAuth('/users', {});
		const data = await res.json();
		return data as Me[];
	} catch (error) {
		console.log(error);
		return [];
	}
}
export async function setProfileImage(image: ImagePickerAsset, user: string) {
	try {
		console.log(image, 'kjkkjjkn');
		if (!image) return;
		const formData = new FormData();
		formData.append('profile_image', {
			uri: image.uri,
			name: `${user}.jpg`,
			type: 'image/jpeg',
		} as any);
		const res = await fetchWithAuth('/users/me', {
			method: 'PUT',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			body: formData,
		});
		console.log(res);
		const contentType = res.headers.get('content-type');
		console.log(contentType);
		if (contentType && contentType.includes('application/json')) {
			const data = await res.json();
			console.log(data);
		} else {
			const text = await res.text();
			console.log('Non-JSON response:', text);
		}
		eventBus.dispatchEvent('REFRESH_PROFILE', null);
	} catch (error) {
		console.log(error);
	}
}
