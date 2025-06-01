import * as Location from 'expo-location';
import { joinWithComma } from '@/lib/utils';

export const getReverseGeocode = async (
	location: Location.LocationObjectCoords | null
) => {
	const { latitude, longitude } = location || {};
	if (!latitude || !longitude) return;
	const geocode = await Location.reverseGeocodeAsync({
		latitude,
		longitude,
	});

	if (geocode.length > 0) {
		const {
			street = '',
			name = '',
			city = '',
			subregion = '',
			region = '',
			country = '',
		} = geocode[0];
		const formattedAddress = joinWithComma(
			street,
			subregion,
			city,
			region,
			country
		);
		const addressComponents = {
			city: city || '',
			lga: subregion || '',
			state: region || '',
			country: country || '',
			street: street || '',
		};
		return {
			address: formattedAddress,
			addressComponents,
		};
	}
	return { address: null, addressComponents: null };
};
