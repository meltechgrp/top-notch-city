import { Fetch } from '../utills';

// 🏠 Fetch all properties (paginated)
export async function fetchProperties({ pageParam }: { pageParam: number }) {
	try {
		const res = await Fetch(`/properties?page=${pageParam}`, {});
		if (!res.ok) throw new Error('Failed to fetch properties');

		const json = (await res.json()) as Result;
		return json;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch properties');
	}
}

// 👤 Fetch user properties (paginated)
export async function fetchUserProperties({
	userId,
	pageParam,
}: {
	userId?: string;
	pageParam: number;
}) {
	try {
		const res = await Fetch(`/user/${userId}?page=${pageParam}`, {});
		if (!res.ok) throw new Error('Failed to fetch user properties');

		const json = (await res.json()) as Result;
		return json;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch user properties');
	}
}

// 👨‍💼 Fetch admin properties (paginated)
export async function fetchAdminProperties({
	pageParam,
}: {
	pageParam: number;
}) {
	try {
		const res = await Fetch(`/admin/properties?page=${pageParam}`, {});
		if (!res.ok) throw new Error('Failed to fetch admin properties');

		const json = (await res.json()) as Result;
		return json;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch admin properties');
	}
}
