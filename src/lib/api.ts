import config from '@/config';
import { cacheStorage } from '@/lib/asyncStorage';
import { getAuthToken } from '@/lib/secureStore';

export function fetchWithAuth(url: string, options: RequestInit) {
	const authToken = getAuthToken();
	return fetch(`${config.origin}${url}`, {
		...options,
		headers: {
			...(authToken && { Authorization: `Bearer ${authToken}` }),
			...options.headers,
		},
	});
}
export function normalFetch(url: string, options?: RequestInit) {
	return fetch(
		`${config.origin}${url}`,
		options
			? {
					...options,
				}
			: {}
	);
}
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
