import {
	fetchCategories,
	fetchSubcategoriesByCategory,
} from '@/actions/property';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useCategoryQueries() {
	const {
		data: categories = [],
		refetch: refetchCategories,
		isLoading: loading,
	} = useQuery({
		queryKey: ['categories'],
		queryFn: fetchCategories,
	});

	const {
		data: subcategoriesData = [],
		refetch: refetchSubcategories,
		isLoading: loading2,
	} = useQuery({
		queryKey: ['subcategoriesForAllCategories'],
		enabled: Boolean(categories?.length),
		queryFn: async () => {
			const all = await Promise.all(
				categories.map(async (cat) => {
					try {
						const data = await fetchSubcategoriesByCategory(cat.id);
						return { category: cat, data: data ?? [] };
					} catch {
						return { category: cat, data: [] }; // Fallback to empty array
					}
				})
			);
			return all;
		},
	});
	const refetch = useCallback(() => {
		refetchCategories();
		refetchSubcategories();
	}, [refetchCategories, refetchSubcategories]);
	return {
		refetch,
		subcategoriesData,
		categories,
		loading: loading || loading2,
	};
}
