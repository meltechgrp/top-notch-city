import { Fetch } from '../utills';

const API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;

export async function fetchProperty({ id }: { id: string }) {
	try {
		const res = await Fetch(`/properties/${id}`, {});

		if (res?.detail) {
			throw new Error('Failed to fetch property');
		}

		return res as Property;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch property');
	}
}
export async function fetchWishlist() {
	try {
		const res = await Fetch(`/mywhishlist`, {});
		if (res?.detail) {
			throw new Error('Failed to fetch wishlist');
		}

		return res as Wishlist[];
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch wishlist');
	}
}

export async function fetchNearbySection({
	type,
	latitude,
	longitude,
}: {
	type: string;
	latitude: number;
	longitude: number;
}) {
	try {
		const url = 'https://places.googleapis.com/v1/places:searchNearby';
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': API_KEY!,
				'X-Goog-FieldMask': 'places.displayName,places.formattedAddress',
			},
			body: JSON.stringify({
				includedTypes: [type],
				maxResultCount: 5,
				locationRestriction: {
					circle: {
						center: {
							latitude,
							longitude,
						},
						radius: 2000, // meters
					},
				},
			}),
		});

		if (!res?.ok) {
			throw new Error('Failed to fetch');
		}

		return await res.json();
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch');
	}
}

export async function addToWishList({ id }: { id: string }) {
	try {
		const res = await Fetch(`/properties/${id}/wishlist`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({ property_id: id }),
		});

		if (res?.detail) {
			throw new Error('Failed to add wishlist item');
		}

		return res;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to add wishlist item');
	}
}
export async function removeFromWishList({ id }: { id: string }) {
	try {
		const res = await Fetch(`/remove/${id}`, {
			method: 'DELETE',
		});

		if (res?.detail) {
			throw new Error('Failed to remove wishlist item');
		}
		return res;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to remove wishlist item');
	}
}
export async function likeProperty({ id }: { id: string }) {
	try {
		const res = await Fetch(`/properties/${id}/like`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({ property_id: id }),
		});
		return res;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to like');
	}
}

export async function viewProperty({ id }: { id: string }) {
	try {
		const res = await Fetch(`/properties/${id}/view`, {
			method: 'POST',
		});
		return res;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to view');
	}
}
