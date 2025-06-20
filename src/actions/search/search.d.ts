type SearchFilters = {
	keyword?: string;
	city?: string;
	state?: string;
	country?: string;
	purpose?: string;
	min_price?: number;
	max_price?: number;
	category?: string;
	sub_category?: string;
	amenities?: string[];
};

type SearchResult = {
	total: number;
	page: number;
	per_page: number;
	pages: number;
	results: Property[];
};
