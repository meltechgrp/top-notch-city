import { fetchWithAuth, normalFetch } from '@/lib/api';

export async function getCategories(): Promise<Category[]> {
	try {
		const res = await normalFetch('/categories');
		const data = await res.json();
		console.log(data);
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
		console.log(data);
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}

export async function editCategory(item: Category) {
	try {
		const res = await fetchWithAuth(`/categories/${item.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: item.name }),
		});
		const data = await res.json();
		console.log(data);
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
		console.log(data);
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}

export async function getSubCategories(catId: string): Promise<Category[]> {
	try {
		const res = await normalFetch(`/categories/${catId}/subcategories`);
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
			body: JSON.stringify({ name }),
		});
		const data = await res.json();
		console.log(data);
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}

export async function editSubCategory(item: Category) {
	try {
		const res = await fetchWithAuth(`/categories/subcategories/${item.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: item.name }),
		});
		const data = await res.json();
		console.log(data);
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}

export async function deleteSubCategory(item: Category) {
	try {
		const res = await fetchWithAuth(`/categories/subcategories/${item.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await res.json();
		console.log(data);
		return true;
	} catch (error) {
		console.log(error);
		return true;
	}
}
