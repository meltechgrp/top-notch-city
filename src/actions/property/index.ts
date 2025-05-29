import { fetchWithAuth } from '@/lib/api';
import { cacheStorage } from '@/lib/asyncStorage';
import { PropertyInput } from '@/lib/schema';
import { Listing } from '@/store';

// Property section

export async function getProperties(): Promise<any[]> {
	try {
		const res = await fetchWithAuth('/properties', {});
		const data = await res.json();

		return data;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function uploadProperty(
	listing: Listing
): Promise<ActionResponse<PropertyInput>> {
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

		// Basic fields
		if (title) formData.append('title', title);
		if (description) formData.append('description', description);
		if (price) formData.append('price', price);
		if (category) formData.append('property_category_name', category);
		if (subCategory) formData.append('property_subcategory_name', subCategory);
		if (purpose) formData.append('purpose', purpose);

		// Address
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

		// Photos
		photos?.forEach((item, i) => {
			formData.append(`photo_${i}`, {
				uri: item.uri,
				type: 'image/jpeg',
				name: `photo_${i}.jpg`,
			} as any);
		});

		// Videos
		videos?.forEach((item, i) => {
			formData.append(`video_${i}`, {
				uri: item.uri,
				type: 'video/mp4',
				name: `video_${i}.mp4`,
			} as any);
		});

		// Optional: append facilities as JSON string or array
		if (facilities && Array.isArray(facilities)) {
			formData.append('facilities', JSON.stringify(facilities));
		}

		const res = await fetchWithAuth('/properties', {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			body: formData,
		});

		const result = await res.json();

		if (result?.detail) {
			return {
				formError: 'Please verify your property details',
			};
		}

		return {
			data: result,
		};
	} catch (error) {
		console.log(error);
		return {
			formError: 'Something went wrong, please try again',
		};
	}
}

//  Category section
export async function getCategories(): Promise<Category[]> {
	try {
		const res = await fetchWithAuth('/categories', {});
		const data = await res.json();

		return data;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function newCategory(name: string) {
	try {
		const res = await fetchWithAuth('/categories', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name }),
		});
		const data = await res.json();
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}

export async function editCategory(id: string, name: string) {
	try {
		const res = await fetchWithAuth(`/categories/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: name }),
		});
		const data = await res.json();
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}
export async function deleteCategory(item: Category) {
	try {
		const res = await fetchWithAuth(`/categories/${item.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await res.json();
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}

// Sub Category section

const SIX_HOURS = 2 * 60 * 60 * 1000;
export async function getCategorySections(): Promise<CategorySections> {
	try {
		const cached = await cacheStorage.get(`category-sections`);
		if (cached) {
			return JSON.parse(cached) as CategorySections;
		}
		const res = await fetchWithAuth('/categories', {});
		const data = (await res.json()) as Category[];

		const sections = await Promise.all(
			data.map(async (item) => {
				const subsRes = await fetchWithAuth(
					`/categories/${item.id}/subcategories`,
					{}
				);
				const subsData = (await subsRes.json()) as SubCategory[];

				return {
					cat: item.name,
					subs: subsData.map((sub) => ({ name: sub.name })),
				};
			})
		);

		cacheStorage.set(`category-sections`, JSON.stringify(sections), SIX_HOURS);
		return sections;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function getSubCategories(catId: string): Promise<Category[]> {
	try {
		const res = await fetchWithAuth(`/categories/${catId}/subcategories`, {});
		const data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function newSubCategory(catId: string, name: string) {
	try {
		const res = await fetchWithAuth(`/categories/${catId}/subcategories`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, category_id: catId }),
		});
		const data = await res.json();
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}

export async function editSubCategory(catId: string, name: string, id: string) {
	try {
		const res = await fetchWithAuth(`/categories/subcategories/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: name, category_id: catId }),
		});
		const data = await res.json();
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}

export async function deleteSubCategory(catId: string, item: Category) {
	try {
		const res = await fetchWithAuth(`/categories/subcategories/${item.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				body: JSON.stringify({ category_id: catId }),
			},
		});
		const data = await res.json();
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}
