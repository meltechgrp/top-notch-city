import { getAuthToken } from '@/lib/secureStore';
import { Listing } from '@/store';
import config from '@/config';
import axios from 'axios';
import { Fetch } from '../utills';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;

export function useUploadProperty() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (listing: Listing) => {
			const token = getAuthToken();
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
				throw new Error('Please verify your property details');
			}

			if (result?.property_id) {
				return result as Property;
			}

			throw new Error('Something went wrong, please try again');
		},
		onSuccess: () => {
			// Invalidate `properties` query so it's refetched
			queryClient.invalidateQueries({ queryKey: ['properties'] });
		},
	});

	return {
		uploading: mutation.isPending,
		error: mutation.error?.message ?? null,
		success: mutation.isSuccess,
		uploadProperty: mutation.mutateAsync,
	};
}

export async function fetchProperties({
	pageParam,
}: {
	pageParam: number;
	userId?: string;
}) {
	try {
		const res = await Fetch(`/properties?user`, {});

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

export const fetchCategories = async () => {
	try {
		const res = await Fetch(`/categories`, {});

		if (!res.ok) {
			throw new Error('Failed to categories');
		}

		const data = (await res.json()) as Category[];
		return data;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to categories');
	}
};

export const fetchSubcategoriesByCategory = async (categoryId: string) => {
	try {
		const res = await Fetch(`/categories/${categoryId}/subcategories`, {});

		if (!res.ok) {
			throw new Error('Failed to subcategories');
		}

		const data = (await res.json()) as SubCategory[];
		return data;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to subcategories');
	}
};

export const addCategory = async ({ name }: { name: string }) => {
	try {
		const res = await Fetch(`/categories`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name }),
		});

		if (!res.ok) throw new Error('Failed to add category');
		return await res.json();
	} catch (error) {
		console.error(error);
		throw error;
	}
};
export const editCategory = async ({
	id,
	data,
}: {
	id: string;
	data: {
		name: string;
	};
}) => {
	try {
		const res = await Fetch(`/categories/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) throw new Error('Failed to edit category');
		return await res.json();
	} catch (error) {
		console.error(error);
		throw error;
	}
};
export const deleteCategory = async ({ id }: { id: string }) => {
	try {
		const res = await Fetch(`/categories/${id}`, {
			method: 'DELETE',
		});

		if (!res.ok) throw new Error('Failed to delete category');
		return true;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
export const addSubcategory = async ({
	categoryId,
	data,
}: {
	categoryId: string;
	data: {
		category_id: string;
		name: string;
	};
}) => {
	try {
		const res = await Fetch(`/categories/${categoryId}/subcategories`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) throw new Error('Failed to add subcategory');
		return await res.json();
	} catch (error) {
		console.error(error);
		throw error;
	}
};
export const editSubcategory = async ({
	id,
	data,
}: {
	id: string;
	data: {
		category_id: string;
		name: string;
	};
}) => {
	try {
		const res = await Fetch(`/categories/subcategories/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) throw new Error('Failed to edit subcategory');
		return await res.json();
	} catch (error) {
		console.error(error);
		throw error;
	}
};
export const deleteSubcategory = async ({
	categoryId,
	subcategoryId,
}: {
	categoryId: string;
	subcategoryId: string;
}) => {
	try {
		const res = await Fetch(`/categories/subcategories/${subcategoryId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ category_id: categoryId }),
		});

		if (!res.ok) throw new Error('Failed to delete subcategory');
		return true;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
