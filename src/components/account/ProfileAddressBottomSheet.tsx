import withRenderVisible from '@/components/shared/withRenderOpen';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import BottomSheet from '../shared/BottomSheet';
import { useEffect, useMemo, useState } from 'react';
import { Button, ButtonIcon, ButtonText, Icon, Text } from '../ui';
import { debounce } from 'lodash-es';
import { MapPin, Send } from 'lucide-react-native';
import { fetchPlaceFromTextQuery } from '@/actions/utills';
import { composeFullAddress, showSnackbar } from '@/lib/utils';
import { MiniEmptyState } from '../shared/MiniEmptyState';
import { useApiQueryWithParams, useApiRequest } from '@/lib/api';
import { SpinningLoader } from '../loaders/SpinningLoader';
import useGetLocation from '@/hooks/useGetLocation';
import { getReverseGeocode } from '@/hooks/useReverseGeocode';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	update: (data: Me) => void;
};

function ProfileAddressBottomSheet(props: Props) {
	const { visible, onDismiss, update } = props;
	const { retryGetLocation } = useGetLocation();
	const [text, setText] = useState('');
	const [locating, setLocating] = useState(false);
	const { request, loading } = useApiRequest<Me>();
	const [locations, setLocations] = useState<GooglePlace[]>([]);

	const { refetch, loading: fetching } = useApiQueryWithParams(
		fetchPlaceFromTextQuery
	);

	const debouncedAutocompleteSearch = useMemo(
		() =>
			debounce(
				async (query: string) => {
					if (!query || query.length < 3) {
						setLocations([]);
						return;
					}
					try {
						const result = await refetch(query);
						setLocations(result);
					} catch (error) {
						console.error('Autocomplete error:', error);
					}
				},
				500,
				{ leading: false, trailing: true }
			),
		[refetch]
	);

	useEffect(() => {
		return () => {
			// Clean up debounce on unmount
			debouncedAutocompleteSearch.cancel();
		};
	}, [debouncedAutocompleteSearch]);

	const onChangeText = (val: string) => {
		setText(val);
		debouncedAutocompleteSearch(val);
	};

	async function handleAddress(item: GooglePlace) {
		const formData = new FormData();
		formData.append('street', item?.addressComponents?.street ?? '');
		formData.append('city', item?.addressComponents?.city ?? '');
		formData.append('country', item?.addressComponents?.country ?? '');
		formData.append('state', item?.addressComponents?.state ?? '');
		formData.append('latitude', item?.location?.latitude.toString() ?? '');
		formData.append('longitude', item?.location?.longitude.toString() ?? '');
		const data = await request({
			url: '/users/me',
			method: 'PUT',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		if (data) {
			onDismiss();
			update(data);
			showSnackbar({
				message: 'Profile address updated successfully',
				type: 'success',
			});
			setText('');
			setLocations([]);
		} else {
			showSnackbar({
				message: 'Failed to update.. try again',
				type: 'warning',
			});
		}
	}
	return (
		<BottomSheet
			title="Enter property location"
			withHeader={true}
			withBackButton={false}
			snapPoint={'80%'}
			visible={visible}
			onDismiss={onDismiss}>
			<KeyboardDismissPressable>
				<View className="flex-1 px-4 gap-8 py-5 pb-8 bg-background">
					<View className="px-4 flex-row gap-4 items-center bg-background-info rounded-xl border border-outline-200">
						<TextInput
							className="h-12 text-typography flex-1 "
							placeholder="Enter your address..."
							value={text}
							onChangeText={onChangeText}
							returnKeyLabel="Search"
							returnKeyType="search"
						/>
						<View className="w-4 h-4 items-center justify-center">
							{loading || fetching || locating ? (
								<SpinningLoader />
							) : (
								<Icon as={Send} />
							)}
						</View>
					</View>

					<View className="flex-1">
						<FlatList
							data={locations}
							refreshing={loading}
							keyExtractor={(item) => item.placeId!}
							contentContainerClassName="bg-background-muted py-4 flex flex-col gap-4 rounded-xl"
							keyboardShouldPersistTaps="never"
							keyboardDismissMode="on-drag"
							ListHeaderComponent={() => (
								<View className="px-4 pb-2">
									<Text size="md" className="font-light">
										Addresses
									</Text>
								</View>
							)}
							ListEmptyComponent={() => (
								<MiniEmptyState
									className="mb-8"
									title={
										text?.length > 2
											? 'No available address'
											: 'Start typing...'
									}
								/>
							)}
							ListFooterComponent={() => (
								<Button
									className=" h-12 self-center rounded-xl"
									onPress={async () => {
										setLocating(true);
										const location = await retryGetLocation();
										if (!location)
											return showSnackbar({
												message: 'Unable to get location, try again!',
												type: 'warning',
											});
										const result = await getReverseGeocode(location);
										if (result) {
											const { address, addressComponents } = result;
											setLocating(false);
											if (!address) {
												showSnackbar({
													message: 'Unable to get location, try again!',
													type: 'warning',
												});
											} else {
												await handleAddress({
													location,
													addressComponents,
													displayName: '',
												});
											}
										}
									}}>
									<ButtonText>Use my location</ButtonText>
									<ButtonIcon as={MapPin} color="white" />
								</Button>
							)}
							renderItem={({ item }) => (
								<Pressable
									onPress={() =>
										handleAddress({
											...item,
											displayName: '',
										})
									}>
									<View className="flex-row gap-3 p-2 px-4 bg-background-info border-b border-outline">
										<View className="mt-2">
											<Icon as={MapPin} className="text-primary" />
										</View>
										<View className="flex-1">
											<Text className="text-lg text-typography">
												{item.displayName}
											</Text>
											<Text className="flex-shrink text-wrap text-typography">
												{composeFullAddress(item.addressComponents)}
											</Text>
										</View>
									</View>
								</Pressable>
							)}
						/>
					</View>
				</View>
			</KeyboardDismissPressable>
		</BottomSheet>
	);
}

export default withRenderVisible(ProfileAddressBottomSheet);
