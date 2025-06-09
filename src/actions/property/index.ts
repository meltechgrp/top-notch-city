import { fetchWithAuth } from '@/lib/api';
import { cacheStorage } from '@/lib/asyncStorage';
import { getAuthToken } from '@/lib/secureStore';
import { Listing } from '@/store';
import config from '@/config';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Fetch } from '../utills';

const API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;
export function useUploadProperty() {
	const token = getAuthToken();
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const uploadProperty = async (listing: Listing) => {
		setUploading(true);
		setError(null);
		setSuccess(false);

		try {
			const formData = new FormData();

			const {
				photos,
				title,
				description,
				price,
				videos,
				category,
				subCategory,
				facilities,
				purpose,
				address,
			} = listing;

			if (title) formData.append('title', title);
			if (description) formData.append('description', description);
			if (price) formData.append('price', price);
			if (category) formData.append('property_category_name', category);
			if (subCategory)
				formData.append('property_subcategory_name', subCategory);
			if (purpose) formData.append('purpose', purpose);

			if (address) {
				formData.append('latitude', address.location.latitude.toString());
				formData.append('longitude', address.location.longitude.toString());

				const comps = address.addressComponents;
				if (comps.city) formData.append('city', comps.city);
				if (comps.state) formData.append('state', comps.state);
				if (comps.country) formData.append('country', comps.country);
				if (comps.street) formData.append('street', comps.street);
				if (address.placeId) formData.append('place_id', address.placeId);
			}

			photos?.forEach((item) => {
				formData.append('media', {
					uri: item.uri,
					name: `image.jpg`,
					type: 'image/jpeg',
				} as any);
			});

			videos?.forEach((item) => {
				formData.append('media', {
					uri: item.uri,
					name: `video.mp4`,
					type: 'video/mp4',
				} as any);
			});
			facilities?.forEach((fac) => {
				formData.append('amenity_names', fac.label);
				formData.append('amenity_values', fac.value.toString());
				formData.append('amenity_icons', fac.icon);
			});

			const res = await axios.post(
				`${config.origin}/api/properties/`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
						Accept: 'application/json',
					},
				}
			);

			const result = res.data;

			if (result?.detail) {
				setUploading(false);
				return setError('Please verify your property details');
			} else if (result?.property_id) {
				setSuccess(true);
				setUploading(false);
				return { data: true };
			} else {
				setUploading(false);
				return setError('Something went wrong, please try again');
			}
		} catch (err) {
			console.log('Upload error:', err);
			setUploading(false);
			return setError('Something went wrong, please try again');
		}
	};

	return {
		uploading,
		error,
		success,
		uploadProperty,
	};
}

const SIX_HOURS = 2 * 60 * 60 * 1000;

export function useCategorySections(withCache?: boolean) {
	const [sections, setSections] = useState<CategorySections>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const getSections = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			if (withCache) {
				const cached = await cacheStorage.get('category-sections');
				if (cached) {
					setSections(JSON.parse(cached));
					setLoading(false);
					return;
				}
			}

			const res = await fetchWithAuth('/categories', {});
			const data = (await res.json()) as Category[];
			const sections = data.map(async (item) => {
				const subsRes = await fetchWithAuth(
					`/categories/${item.id}/subcategories`,
					{}
				);
				const subsData = (await subsRes.json()) as SubCategory[];

				return {
					name: item.name,
					id: item.id,
					data:
						subsData?.map((sub) => ({
							name: sub.name,
							id: sub.id,
							catId: sub?.cat?.id || item.id,
						})) || [],
				};
			});

			const result = await Promise.all(sections);
			if (withCache) {
				cacheStorage.set(
					'category-sections',
					JSON.stringify(result),
					SIX_HOURS
				);
			}
			setSections(result);
			return result;
		} catch (err: any) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}, [withCache]);

	useEffect(() => {
		getSections();
	}, [getSections]);

	return { sections, loading, error, refetch: getSections };
}

export async function fetchProperties({ pageParam }: { pageParam: number }) {
	try {
		const res = await Fetch('/properties', {});

		if (!res.ok) {
			throw new Error('Failed to fetch properties');
		}

		const json = (await res.json()) as PropertyResponse;
		return json.properties;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch properties');
	}
}

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
			throw new Error('Failed to fetch property');
		}

		const data = await res.json();
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch property');
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
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ property_id: id }),
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
