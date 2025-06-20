import eventBus from '@/lib/eventBus';
import { Fetch } from '../utills';

export async function getMe() {
	const res = await Fetch('/users/me', {});
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data?.detail || 'Failed to update profile');
	}
	return data as Me;
}
export async function getUsers() {
	const res = await Fetch('/users', {});
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data?.detail || 'Failed to update profile');
	}
	return data as Me[];
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
		body: formData,
	});
	const data = await res.json();
	eventBus.dispatchEvent('REFRESH_PROFILE', null);

	if (data?.detail) {
		throw new Error('Failed to update profile');
	}

	return data;
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
			body: formData,
		});
		const data = await res.json();
		eventBus.dispatchEvent('REFRESH_PROFILE', null);

		if (data?.detail) {
			throw new Error('Failed to update profile');
		}

		return data;
	} catch (error) {
		throw error;
	}
}
