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
