import {
	Box,
	Button,
	ButtonIcon,
	ButtonText,
	Heading,
	Icon,
	Text,
	View,
} from '@/components/ui';
import Map from '../location/map';
import { useMemo, useState } from 'react';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import ListingAddressBottomSheet from './ListingAddressBottomSheet';
import { Pressable } from 'react-native';
import { Loader, MapPin, Search } from 'lucide-react-native';
import { useTempStore } from '@/store';
import { useLayout } from '@react-native-community/hooks';
import { showSnackbar } from '@/lib/utils';
import useGetLocation from '@/hooks/useGetLocation';
import { getReverseGeocode } from '@/hooks/useReverseGeocode';

export default function ListingLocation() {
	const { location, retryGetLocation } = useGetLocation();
	const { listing, updateListing } = useTempStore();
	const [loading, setLoading] = useState(false);
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const { height, onLayout } = useLayout();

	const coords = useMemo(() => {
		if (listing?.address?.location) {
			return listing?.address?.location;
		}
		if (location) {
			return {
				latitude: location.latitude,
				longitude: location.longitude,
			};
		}
		return undefined;
	}, [location, listing?.address?.location]);
	return (
		<>
			<Box onLayout={onLayout} className="flex-1 ">
				<KeyboardDismissPressable>
					<View className=" py-6 gap-4 px-4">
						<Heading size="xl">Where is your property Located</Heading>
					</View>
					<View
						style={{ maxHeight: height / 1.3 }}
						className=" flex-1 relative">
						<View className="absolute top-6 w-full z-10 px-4">
							<Pressable
								onPress={() => setShowBottomSheet(true)}
								className="flex-1 h-14 p-2 pl-4 flex-row bg-background-muted rounded-full items-center gap-1">
								<Text
									size="md"
									numberOfLines={1}
									className="flex-1 text-typography/70">
									{listing?.address?.displayName
										? listing?.address?.displayName
										: 'Search property address...'}
								</Text>

								<View className=" p-2 bg-primary rounded-full">
									<Icon as={Search} color="white" />
								</View>
							</Pressable>
						</View>
						<Map
							showUserLocation={false}
							{...listing.address?.location}
							height={height / 1.3}
							marker={coords}
						/>
						<View className=" px-4 py-2 absolute bottom-4 w-full">
							<Button
								className=" h-12 self-center rounded-full"
								onPress={async () => {
									setLoading(true);

									const result = await getReverseGeocode(location);
									console.log(result);
									if (result) {
										const { address, addressComponents } = result;
										if (!address || !location) {
											showSnackbar({
												message: 'Unable to get location, try again!',
												type: 'warning',
											});
											return setLoading(false);
										}
										updateListing({
											...listing,
											address: {
												displayName: address,
												addressComponents: addressComponents!,
												location: location,
											},
										});
									} else {
										showSnackbar({
											message: 'Unable to get location, try again!',
											type: 'warning',
										});
									}
									setLoading(false);
								}}>
								<ButtonText>Use my location</ButtonText>
								{loading ? (
									<ButtonIcon as={Loader} color="white" />
								) : (
									<ButtonIcon as={MapPin} color="white" />
								)}
							</Button>
						</View>
					</View>
				</KeyboardDismissPressable>
				<ListingAddressBottomSheet
					show={showBottomSheet}
					onDismiss={() => setShowBottomSheet(false)}
					address={listing.address}
					onUpdate={(val) => updateListing({ ...listing, address: val })}
				/>
			</Box>
		</>
	);
}
