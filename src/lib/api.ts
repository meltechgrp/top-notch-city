import config from '@/config';
import { cacheStorage } from '@/lib/asyncStorage';
import { getAuthToken } from '@/lib/secureStore';
import { profileDefault } from '@/store';
import { useCallback, useEffect, useState } from 'react';

export function fetchWithAuth(url: string, options: RequestInit) {
	const authToken = getAuthToken();
	return fetch(`${config.origin}/api${url}`, {
		...options,
		headers: {
			...(authToken && { Authorization: `Bearer ${authToken}` }),
			...options.headers,
		},
	});
}
export function normalFetch(url: string, options?: RequestInit) {
	return fetch(
		`${config.origin}/api${url}`,
		options
			? {
					...options,
				}
			: {}
	);
}
export const getImageUrl = (url?: string | null) => {
	if (url)
		return {
			uri: `${config.origin}${url}`,
		};
	return profileDefault;
};
// export async function updatePushNotificationToken(token: string) {
// 	try {
// 		await fetchWithAuth(`${config.origin}/v1/push-notifications`, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({ token }),
// 		});
// 	} catch (error) {}
// }

const SIX_HOURS = 6 * 60 * 60 * 1000;
export async function fetchStatesByCountry(countryCode: string) {
	const cached = await cacheStorage.get(`states-${countryCode}`);
	if (cached) {
		return cached as string[];
	}
	const res = await fetchWithAuth(
		`${config.origin}/v1/address/states/${countryCode}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
	if (!res.ok) {
		throw new Error(await res.text());
	}
	const data = await res.json();
	if (!config.isDev)
		cacheStorage.set(`states-${countryCode}`, JSON.stringify(data), SIX_HOURS);
	return data as string[];
}

export async function fetchTownsByState(countryCode: string, state: string) {
	const cached = await cacheStorage.get(`towns-${countryCode}-${state}`);
	if (cached) {
		return cached as string[];
	}
	const res = await fetchWithAuth(
		`${config.origin}/v1/address/towns/${countryCode}/${state}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
	if (!res.ok) {
		throw new Error(await res.text());
	}
	const data = await res.json();
	if (!config.isDev)
		cacheStorage.set(
			`towns-${countryCode}-${state}`,
			JSON.stringify(data),
			SIX_HOURS
		);
	return data as string[];
}

export function useLazyApiQuery<F extends (...args: any) => Promise<any>>(
	fn: F
) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState<Awaited<ReturnType<F>> | null>(null);
	function query(...arg: Parameters<F>) {
		setLoading(true);
		return fn(...arg)
			.finally(() => {
				setLoading(false);
			})
			.then(setData)
			.catch(setError);
	}

	return [query, { loading, error, data }] as const;
}
type QueryState<T> = {
	data: T | null;
	error: Error | null;
	loading: boolean;
	refetch: () => Promise<T>;
};

export function useApiQuery<F extends (...args: any[]) => Promise<any>>(
	fn: F,
	...arg: Parameters<F>
): QueryState<Awaited<ReturnType<F>>> {
	const [data, setData] = useState<Awaited<ReturnType<F>> | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(true);

	const refetch = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await fn(...arg);
			setData(result);
			return result;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			setError(error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [fn, ...arg]);

	useEffect(() => {
		refetch();
	}, [refetch]);

	return { data, error, loading, refetch };
}

type QueryState2<T> = {
	data: T | null;
	error: Error | null;
	loading: boolean;
	refetch: (...args: any[]) => Promise<T>;
};

export function useApiQueryWithParams<
	F extends (...args: any[]) => Promise<any>,
>(fn: F): QueryState2<Awaited<ReturnType<F>>> {
	const [data, setData] = useState<Awaited<ReturnType<F>> | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const refetch = useCallback(
		async (...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> => {
			setLoading(true);
			setError(null);
			try {
				const result = await fn(...args);
				setData(result);
				return result;
			} catch (err) {
				const error = err instanceof Error ? err : new Error(String(err));
				setError(error);
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[fn]
	);

	return { data, error, loading, refetch };
}
