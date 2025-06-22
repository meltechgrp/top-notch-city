import { Fetch } from '../utills';

const API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;

export async function fetchProperty({ id }: { id: string }) {
	try {
		const res = await Fetch(`/properties/${id}`, {});

		if (!res.ok) {
			throw new Error('Failed to fetch property');
		}

		return (await res.json()) as Property;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch property');
	}
}
export async function fetchWishlist() {
	try {
		const res = await Fetch(`/mywhishlist`, {});
		if (!res.ok) {
			throw new Error('Failed to fetch wishlist');
		}

		const json = (await res.json()) as Wishlist[];
		return json;
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

		if (!res.ok) {
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
			body: JSON.stringify({ property_id: id }),
		});

		if (!res.ok) {
			throw new Error('Failed to add wishlist item');
		}

		const data = await res.json();
		return data;
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

		if (!res.ok) {
			throw new Error('Failed to remove wishlist item');
		}

		const data = await res.json();
		return data;
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
			body: JSON.stringify({ property_id: id }),
		});

		if (!res.ok) {
			throw new Error('Failed to like');
		}

		const data = await res.json();
		console.log(data);
		return data;
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

		if (!res.ok) {
			throw new Error('Failed to view');
		}

		const data = await res.json();
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to view');
	}
}
