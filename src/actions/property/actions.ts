import { Fetch } from '../utills';

export async function updatePropertyStatus(
	propertyId: string,
	action: string,
	reason?: string
) {
	const res = await Fetch(`/properties/status/${propertyId}/${action}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		data: JSON.stringify(
			reason ? (reason == 'reject' ? { reason } : { comment: reason }) : {}
		),
	});
	if (res?.detail) {
		throw new Error(`Failed to ${action} property`);
	}
	const data = await res.json();
	return data;
}

export async function deleteProperty(propertyId: string) {
	const res = await Fetch(`/properties/${propertyId}`, { method: 'DELETE' });
	if (res?.detail) {
		throw new Error('Failed to delete property');
	}
	return res;
}

export async function softDeleteProperty(propertyId: string) {
	const res = await Fetch(`/properties/${propertyId}/soft`, {
		method: 'DELETE',
	});
	if (res?.detail) {
		throw new Error('Failed to soft delete property');
	}
	return await res
}
