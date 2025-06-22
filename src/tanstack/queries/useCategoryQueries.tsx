// hooks/useCategoryQueries.ts
import { fetchAllSubcategories } from '@/actions/property/category';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useCategoryQueries() {
	const {
		data: allSubcategories = [],
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ['allSubcategories'],
		queryFn: fetchAllSubcategories,
	});

	// Unique categories extracted from subcategories
	const categories = useMemo(() => {
		const seen = new Map<string, Category>();
		for (const sub of allSubcategories) {
			if (!seen.has(sub.category?.id)) {
				seen.set(sub.category.id, sub.category);
			}
		}
		return Array.from(seen.values());
	}, [allSubcategories]);

	// Grouped subcategories for FlashList format
	const subcategoriesData = useMemo(() => {
		const grouped: { [key: string]: SubCategory[] } = {};

		for (const sub of allSubcategories) {
			const catId = sub.category.id;
			if (!grouped[catId]) grouped[catId] = [];
			grouped[catId].push(sub);
		}

		return Object.entries(grouped).map(([catId, subs]) => ({
			category: subs[0].category,
			data: subs,
		}));
	}, [allSubcategories]);

	return {
		refetch,
		categories,
		subcategories: allSubcategories,
		subcategoriesData, // For FlashList
		loading: isLoading,
	};
}
