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
		body: JSON.stringify(
			reason ? (reason == 'reject' ? { reason } : { comment: reason }) : {}
		),
	});
	if (!res.ok) {
		throw new Error(`Failed to ${action} property`);
	}
	const data = await res.json();
	return data;
}

export async function deleteProperty(propertyId: string) {
	const res = await Fetch(`/properties/${propertyId}`, { method: 'DELETE' });
	if (!res.ok) {
		throw new Error('Failed to delete property');
	}
	return await res.json();
}

export async function softDeleteProperty(propertyId: string) {
	const res = await Fetch(`/properties/${propertyId}/soft`, {
		method: 'DELETE',
	});
	if (!res.ok) {
		throw new Error('Failed to soft delete property');
	}
	return await res.json();
}
