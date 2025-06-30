import eventBus from '@/lib/eventBus';
import { Fetch } from '../utills';

export async function getMe() {
	const res = await Fetch('/users/me', {});

	if (res?.detail) {
		throw new Error('Failed to update profile');
	}
	return res as Me;
}
export async function getUsers() {
	const res = await Fetch('/users', {});
	if (res?.detail) {
		throw new Error( 'Failed to update profile');
	}
	return res as Me[];
}

export async function setProfileImage(image: string) {
	if (!image) return;
	const formData = new FormData();
	formData.append('profile_image', {
		uri: image,
		name: `user.jpg`,
		type: 'image/jpeg',
	} as any);

	const res = await Fetch('/users/me', {
		method: 'PUT',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
	});
	eventBus.dispatchEvent('REFRESH_PROFILE', null);

	if (res?.detail) {
		throw new Error('Failed to update profile');
	}

	return res;
}

export async function updateProfileField(
	form: { field: keyof Me; value: any }[]
) {
	try {
		const formData = new FormData();
		form.map(({ field, value }) => {
			formData.append(field, value);
		});

		const res = await Fetch('/users/me', {
			method: 'PUT',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data: formData,
		});
		eventBus.dispatchEvent('REFRESH_PROFILE', null);

		if (res?.detail) {
			throw new Error('Failed to update profile');
		}

		return res;
	} catch (error) {
		throw error;
	}
}
