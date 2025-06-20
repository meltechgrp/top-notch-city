import { Fetch } from '../utills';

const API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;

export async function fetchProperties({ pageParam }: { pageParam: number }) {
	try {
		const res = await Fetch(`/properties`, {});
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
export async function fetchUserProperties({
	userId,
	pageParam,
}: {
	userId?: string;
	pageParam: number;
}) {
	try {
		const res = await Fetch(`/user/${userId}`, {});
		if (!res.ok) {
			throw new Error('Failed to fetch properties');
		}

		const json = await res.json();
		if (json?.detail) {
			return [];
		}
		return json as Property[];
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch properties');
	}
}
export async function fetchAdminProperties({
	pageParam,
}: {
	pageParam: number;
}) {
	try {
		const res = await Fetch(`/admin/properties`, {});
		const json = await res.json();
		if (!res.ok) {
			throw new Error('Failed to fetch properties');
		}

		if (json?.detail) {
			return [];
		}
		const data = json.properties as Property[];
		return data;
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
