import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import Platforms from '@/constants/Plaforms';

type Options = {
	onSuccessRoute?: string;
	showScreenOnFailure?: boolean;
	canGoBack?: boolean;
	highAccuracy?: boolean;
};

const useGetLocation = (options?: Options) => {
	const {
		onSuccessRoute,
		showScreenOnFailure = false,
		canGoBack = true,
		highAccuracy = false,
	} = options || {};

	const [address, setAddress] = useState<string | null>(null);
	const [granted, setGranted] = useState(false);

	const tryGetLocation = useCallback(async () => {
		// Request location permission
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			setGranted(false);

			// Handle permission denial
			if (showScreenOnFailure && onSuccessRoute) {
				router.push({
					pathname: '/home',
					params: {
						onSuccessRoute,
						canGoBack: canGoBack.toString(),
					},
				});
			}
			return;
		}

		setGranted(true);

		// Get user location
		let location = await Location.getCurrentPositionAsync({
			accuracy: Location.Accuracy.BestForNavigation,
		});

		if (location) {
			const { latitude, longitude } = location.coords;

			try {
				// Reverse geocode coordinates to an address
				const geocode = await Location.reverseGeocodeAsync({
					latitude,
					longitude,
				});

				if (geocode.length > 0) {
					const {
						street = '',
						name = '',
						city = '',
						region = '',
						postalCode = '',
						country = '',
						formattedAddress: android,
					} = geocode[0];

					// Manually construct address
					const formattedAddress = Platforms.isIOS()
						? `${street || ''}, ${city}, ${region} ${country}`.trim()
						: android ||
							`${street || name}, ${city}, ${region} ${country}`.trim();
					setAddress(formattedAddress);
				} else {
					setAddress('Address not found');
				}
			} catch (error) {
				console.error('Error reverse geocoding location:', error);
				setAddress('Failed to fetch address');
			}
		} else {
			setAddress('Unable to retrieve location');
		}
	}, [highAccuracy, setAddress]);

	useEffect(() => {
		tryGetLocation();
	}, []);

	return {
		address, // The resolved address string
		isLocationPermissionGranted: granted,
		retryGetLocation: tryGetLocation,
	};
};

export default useGetLocation;
