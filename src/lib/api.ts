import config from '@/config';
import { cacheStorage } from '@/lib/asyncStorage';
import { getAuthToken } from '@/lib/secureStore';
import { profileDefault } from '@/store';
import { useState, useRef, useEffect, useCallback } from 'react';
import axios, {
	AxiosRequestConfig,
	AxiosResponse,
	CancelTokenSource,
} from 'axios';

const SIX_HOURS = 2 * 60 * 60 * 1000;

export type UseApiRequestProps<T> = {
	url: string;
	method?: AxiosRequestConfig['method'];
	data?: AxiosRequestConfig['data'];
	isExternal?: boolean;
	headers?: AxiosRequestConfig['headers'];
	withAuth?: boolean;
	tag?: string;
	onUploadProgress?: (progress: number) => void;
};

export function useApiRequest<T = any>() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);

	const cancelSourceRef = useRef<CancelTokenSource | null>(null);

	const request = useCallback(
		async ({
			url,
			method = 'GET',
			data: body,
			headers = {},
			withAuth = true,
			isExternal = false,
			tag,
			onUploadProgress,
		}: UseApiRequestProps<T>) => {
			setLoading(true);
			setError(null);
			setData(null);

			// Check cache
			if (tag) {
				const cachedData = await cacheStorage.get(tag);
				if (cachedData) {
					setData(JSON.parse(cachedData));
					setLoading(false);
					return JSON.parse(cachedData);
				}
			}
			const source = axios.CancelToken.source();
			cancelSourceRef.current = source;

			const authToken = withAuth ? getAuthToken() : null;

			try {
				const response: AxiosResponse<T> = await axios({
					method,
					url: isExternal ? url : `${config.origin}/api${url}`,
					data: body,
					headers: {
						...(authToken && { Authorization: `Bearer ${authToken}` }),
						...headers,
					},
					cancelToken: source.token,
					onUploadProgress:
						method === 'POST' || method === 'PUT'
							? (progressEvent) => {
									const percent = Math.round(
										(progressEvent.loaded * 100) / (progressEvent.total || 1)
									);
									onUploadProgress?.(percent);
								}
							: undefined,
				});
				console.log(response.data);
				setData(response.data);
				// Cache response if tabName is provided
				if (tag) {
					cacheStorage.set(tag, JSON.stringify(response.data), SIX_HOURS);
				}
				return response.data;
			} catch (err: any) {
				console.log(err, 'err');
				if (axios.isCancel(err)) {
					setError('Request cancelled');
				} else {
					setError('An error occurred');
				}
				return null;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const cancel = useCallback(() => {
		cancelSourceRef.current?.cancel('Request cancelled by user.');
	}, []);

	useEffect(() => {
		return () => {
			cancel();
		};
	}, [cancel]);

	return { request, loading, data, error, cancel };
}
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
export const getImageUrl = (url?: string | null) => {
	if (url)
		return {
			uri: `${config.origin}${url}`,
		};
	return profileDefault;
};
export const generateMediaUrl = (url: string) => `${config.origin}${url}`;
export type UseApiQueryOptions = {
	withAuth?: boolean;
	method?: AxiosRequestConfig['method'];
	data?: AxiosRequestConfig['data'];
	headers?: AxiosRequestConfig['headers'];
	isExternal?: boolean;
};

type QueryState<T> = {
	data: T | null;
	error: string | null;
	loading: boolean;
	refetch: () => Promise<T>;
};

export function useGetApiQuery<T = any>(
	url: string,
	options: UseApiQueryOptions = {},
	tag?: string
): QueryState<T | null> {
	const { data, error, loading, request } = useApiRequest<T>();

	const refetch = useCallback(() => {
		return request({
			url,
			method: options?.method || 'GET',
			withAuth: options.withAuth,
			tag,
			...options,
		});
	}, [url, options.withAuth, request, tag]);

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
