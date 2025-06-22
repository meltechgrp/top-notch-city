import { Fetch } from '../utills';

export const fetchAllSubcategories = async (): Promise<SubCategory[]> => {
	try {
		const res = await Fetch(`/categories/subcategories/`, {});
		if (!res.ok) throw new Error('Failed to fetch subcategories');

		const data = (await res.json()) as SubCategory[];
		return data;
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch subcategories');
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
