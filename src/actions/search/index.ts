import { Fetch } from '../utills';

export async function searchProperties(
	filters: SearchFilters,
	page = 1
): Promise<SearchResult> {
	const query = new URLSearchParams();
	if (filters.keyword) query.append('keyword', filters.keyword);
	if (filters.city) query.append('city', filters.city);
	if (filters.state) query.append('state', filters.state);
	if (filters.country) query.append('country', filters.country);
	if (filters.purpose) query.append('purpose', filters.purpose);
	if (filters.min_price) query.append('min_price', String(filters.min_price));
	if (filters.max_price) query.append('max_price', String(filters.max_price));
	if (filters.category) query.append('category', filters.category);
	if (filters.sub_category) query.append('sub_category', filters.sub_category);
	if (filters.amenities?.length) {
		filters.amenities.forEach((amenity) =>
			query.append('amenities[]', amenity)
		);
	}

	query.append('page', String(page));
	try {
		const res = await Fetch(`/properties/search?${query.toString()}`, {});
		const data = await res.json();
		if (!data?.results) throw new Error('property not found');
		return data;
	} catch (error) {
		console.error('Search error:', error);
		throw error;
	}
}
