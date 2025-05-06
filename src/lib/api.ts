import config from '@/config';
import { cacheStorage } from '@/lib/asyncStorage';
import { getAuthToken } from '@/lib/secureStore';
import { Alert } from 'react-native';
import { getUniqueIdSync } from 'react-native-device-info';

function fetchWithAuth(url: string, options: RequestInit) {
	const authToken = getAuthToken();
	const deviceId = getUniqueIdSync();
	return fetch(url, {
		...options,
		headers: {
			...(authToken && { Authorization: `Bearer ${authToken}` }),
			'X-DID': deviceId,
			...options.headers,
		},
	});
}
export async function updatePushNotificationToken(token: string) {
	try {
		await fetchWithAuth(`${config.origin}/v1/push-notifications`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token }),
		});
	} catch (error) {}
}

type UploadFetchOptions = {
	name: string;
	width: number;
	height: number;
	type: string;
	size: number;
};
export async function requestPreSignedUrl(args: UploadFetchOptions) {
	const authToken = getAuthToken();
	if (!authToken) {
		Alert.alert('You need to login to upload files');
		return null;
	}
	try {
		const res = await fetchWithAuth(
			`${config.origin}/v1/presigned-upload-url`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(args),
			}
		);
		const data: { uploadUrl: string; path: string } = await res.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

type ImageProcessingOptions = {
	path: string;
	width: number;
	height: number;
	quality: number;
	resizeMode?: 'fill' | 'contain';
};
export async function generateProcessingUrl(args: ImageProcessingOptions) {
	const res = await fetchWithAuth(`${config.origin}/v1/image-processing`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(args),
	});
	const data: string = await res.text();
	return data;
}

export async function searchTypeAhead(
	query: string,
	filter?: { state?: string; towns?: string[]; service?: any }
) {
	const res = await fetchWithAuth(`${config.origin}/v1/search/typeahead`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			...filter,
		}),
	});
	const data = await res.json();
	return data as {
		id: string;
		name: string;
		uniqueName: string;
		type: string;
		splitType?: string;
		communityId?: string;
		highlight: { value: string; isHighlighted: boolean }[];
	}[];
}
const SIX_HOURS = 6 * 60 * 60 * 1000;
export async function fetchStatesByCountry(countryCode: string) {
	const cached = cacheStorage.get(`states-${countryCode}`);
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
	const cached = cacheStorage.get(`towns-${countryCode}-${state}`);
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

export async function fetchLinkPreview(url: string) {
	type ResponseType = {
		image:
			| {
					url: string;
					width: any;
					height: any;
					type: any;
			  }
			| undefined;
		favicon?: string | undefined;
		title: any;
		origin: string;
		description: any;
		siteName: any;
	} | null;
	const cached = cacheStorage.get(`link-preview-${url}`);
	if (cached) {
		return cached as ResponseType;
	}
	const res = await fetchWithAuth(`${config.origin}/v1/link-preview`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ url }),
	});
	if (!res.ok) {
		throw new Error(await res.text());
	}
	const data = await res.json();
	if (data) {
		cacheStorage.set(`link-preview-${url}`, data, SIX_HOURS);
	}
	return data as ResponseType;
}
export type TypeAheadResponse = Awaited<ReturnType<typeof searchTypeAhead>>;

export async function fetchCommunitiesMapCoords(args: {
	lat: number;
	long: number;
	radiusInKm: number;
}) {
	const res = await fetchWithAuth(`${config.origin}/v1/communities-geosearch`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(args),
	});
	if (!res.ok) {
		throw new Error(await res.text());
	}

	type Response = {
		id: string;
		name: string;
		description: string;
		address: {
			latitude: number;
			longitude: number;
		};
	};
	const data: Response[] = await res.json();

	return data;
}
