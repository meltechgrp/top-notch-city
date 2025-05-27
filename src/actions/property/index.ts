import { fetchWithAuth } from '@/lib/api';

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

export async function getCategorySections(): Promise<
	{ cat: string; subs: { name: string }[] }[]
> {
	try {
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
