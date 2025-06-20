import { getAuthToken } from '@/lib/secureStore';
import config from '@/config';
import { getUniqueIdSync, getIpAddress } from 'react-native-device-info';
const MAPS_API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;

export function Fetch(url: string, options: RequestInit) {
	const authToken = getAuthToken();
	const deviceId = getUniqueIdSync();
	return fetch(`${config.origin}/api${url}`, {
		...options,
		headers: {
			...(authToken && { Authorization: `Bearer ${authToken}` }),
			...options.headers,
			// device id
			'X-DID': deviceId,
		},
	});
}

export async function fetchPlaceFromTextQuery(
	query: string
): Promise<GooglePlace[]> {
	if (!query || query.trim().length === 0) return [];

	const endpoint = 'https://places.googleapis.com/v1/places:searchText';

	try {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': MAPS_API_KEY!,
				'X-Goog-FieldMask':
					'places.displayName,places.formattedAddress,places.location,places.id,places.addressComponents',
			},
			body: JSON.stringify({
				textQuery: query,
			}),
		});

		if (!res.ok) {
			console.error('Google Places API error:', await res.text());
			return [];
		}

		const data = (await res.json()) as { places: GooglePlaceResult[] };
		return (
			data.places?.map((item) => {
				const getComponent = (type: string) =>
					item.addressComponents.find((comp) => comp.types.includes(type))
						?.longText;
				return {
					displayName: item.displayName.text,
					placeId: item.id,
					location: item.location,
					addressComponents: {
						city: getComponent('locality'), // e.g., Port Harcourt
						state: getComponent('administrative_area_level_1'), // e.g., Rivers
						lga: getComponent('administrative_area_level_2'), // e.g., lga
						street: getComponent('administrative_area_level_3'), // e.g., lga
						country: getComponent('country'), // e.g., Nigeria
					},
				};
			}) || []
		);
	} catch (err) {
		console.error('Failed to fetch place:', err);
		return [];
	}
}

export async function getLocationFromIP() {
	try {
		const ipRes = await fetch('https://api64.ipify.org?format=json');
		const ipData = await ipRes.json();
		const ip = ipData?.ip;
		console.log(ip);
		if (!ip) throw new Error('IP not found');

		const locationRes = await fetch(`https://ipwho.is/${ip}`);
		const result = await locationRes.json();
		console.log(result);
		if (!result.success) throw new Error('Failed to get location');
		const { longitude, latitude } = result as {
			latitude: number;
			longitude: number;
			city?: string;
			country?: string;
		};
		const res = await Fetch(
			`/properties/nearby?latitude=${latitude}&longitude=${longitude}`,
			{}
		);
		const data = await res.json();
		console.log(data);
		return data;
	} catch (err) {
		console.error('Location lookup error:', err);
		return null;
	}
}
