import { fetchWithAuth } from '@/lib/api';

export async function autocompleteAddress(
	text?: string
): Promise<PlacePrediction[]> {
	try {
		if (!text || text?.length < 3) return [];
		const res = await fetchWithAuth(
			`/api/autocomplete-address?input=${encodeURIComponent(text)}`,
			{}
		);
		const data = (await res.json()) as PlacePredictionResponse;
		console.log(data?.predictions);
		const locations =
			data.predictions?.map(({ description, place_id }) => ({
				description,
				place_id,
			})) ?? [];
		console.log(locations);
		return locations;
	} catch (error) {
		console.log(error);
		return [];
	}
}

export async function getPlaceDescription(): Promise<PlaceResult | null> {
	try {
		const res = await fetchWithAuth('/api/place-details', {});
		const data = (await res.json()) as PlaceResponse;

		return data?.result;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function fetchPlaceFromTextQuery(
	query: string
): Promise<GooglePlace[]> {
	if (!query || query.trim().length === 0) return [];

	const API_KEY = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;
	const endpoint = 'https://places.googleapis.com/v1/places:searchText';

	try {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': API_KEY!,
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
