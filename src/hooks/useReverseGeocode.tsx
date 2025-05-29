import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import { joinWithComma } from '@/lib/utils';
import useGetLocation from './useGetLocation';

const useReverseGeocode = () => {
	const { location, retryGetLocation } = useGetLocation();
	const [address, setAddress] = useState<string | null>(null);
	const [addressComponents, setAddressComponents] = useState<ParsedAddress>();
	const getAddress = useCallback(async () => {
		const { latitude, longitude } = location || {};
		await retryGetLocation();
		if (!latitude || !longitude) return;
		try {
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
				setAddressComponents({
					city: city || '',
					lga: subregion || '',
					state: region || '',
					country: country || '',
					street: street || name || '',
				});
				setAddress(formattedAddress);
			} else {
				setAddress(null);
			}
		} catch (error) {
			console.error('Error reverse geocoding location:', error);
			setAddress(null);
		}
	}, [location]);
	return {
		location: location
			? { latitude: location.latitude, longitude: location.longitude }
			: null,
		address,
		getAddress,
		addressComponents,
	};
};

export default useReverseGeocode;
