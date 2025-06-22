import { useInfiniteQuery } from '@tanstack/react-query';
import {
	fetchProperties,
	fetchUserProperties,
	fetchAdminProperties,
} from '@/actions/property/list';
import { searchProperties } from '@/actions/search';

const perPage = 20; // default per page value, adjust if needed

export function useProductQueries({
	type,
	profileId,
	filter,
	enabled = true,
}: {
	type: 'all' | 'user' | 'admin' | 'search';
	profileId?: string;
	filter?: SearchFilters;
	enabled?: boolean;
}) {
	switch (type) {
		case 'all': {
			return useInfiniteQuery({
				queryKey: ['properties'],
				queryFn: ({ pageParam = 1 }) => fetchProperties({ pageParam }),
				initialPageParam: 1,
				getNextPageParam: (lastPage) => {
					const { page, pages } = lastPage;
					return page < pages ? page + 1 : undefined;
				},
				enabled,
			});
		}
		case 'user': {
			return useInfiniteQuery({
				queryKey: ['properties', profileId],
				queryFn: ({ pageParam = 1 }) =>
					fetchUserProperties({ userId: profileId!, pageParam }),
				initialPageParam: 1,
				getNextPageParam: (lastPage) => {
					const { page, pages } = lastPage;
					return page < pages ? page + 1 : undefined;
				},
				enabled: !!profileId && enabled,
			});
		}
		case 'admin': {
			return useInfiniteQuery({
				queryKey: ['admins-properties'],
				queryFn: ({ pageParam = 1 }) => fetchAdminProperties({ pageParam }),
				initialPageParam: 1,
				getNextPageParam: (lastPage) => {
					const { page, pages } = lastPage;
					return page < pages ? page + 1 : undefined;
				},
				enabled,
			});
		}
		case 'search': {
			return useInfiniteQuery({
				queryKey: ['search', filter],
				queryFn: ({ pageParam = 1 }) =>
					searchProperties(pageParam, perPage, filter),
				getNextPageParam: (lastPage) => {
					const { page, pages } = lastPage;
					return page < pages ? page + 1 : undefined;
				},
				initialPageParam: 1,
				enabled,
			});
		}
		default:
			throw new Error('Invalid product query type');
	}
}
