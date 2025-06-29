import withRenderVisible from '@/components/shared/withRenderOpen';
import { FlatList, Pressable, View } from 'react-native';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import BottomSheet from '../shared/BottomSheet';
import { useEffect, useMemo, useState } from 'react';
import { Icon, Text } from '../ui';
import { debounce } from 'lodash-es';
import { MapPin } from 'lucide-react-native';
import { fetchPlaceFromTextQuery } from '@/actions/utills';
import { composeFullAddress } from '@/lib/utils';
import { MiniEmptyState } from '../shared/MiniEmptyState';
import { CustomInput } from '../custom/CustomInput';

type Props = {
	show: boolean;
	onDismiss: () => void;
	onUpdate: (data: GooglePlace) => void;
	address?: GooglePlace;
};

function ListingAddressBottomSheet(props: Props) {
	const { show, onDismiss, onUpdate } = props;

	const [text, setText] = useState('');
	const [locations, setLocations] = useState<GooglePlace[]>([]);
	const [typing, setTyping] = useState(false);

	const debouncedAutocompleteSearch = useMemo(
		() =>
			debounce(
				async (query: string) => {
					if (!query || query.length < 3) {
						setLocations([]);
						return;
					}
					try {
						const result = await fetchPlaceFromTextQuery(query);
						setLocations(result);
					} catch (error) {
						console.error('Autocomplete error:', error);
					}
				},
				500,
				{ leading: false, trailing: true }
			),
		[]
	);

	useEffect(() => {
		return () => {
			// Clean up debounce on unmount
			debouncedAutocompleteSearch.cancel();
		};
	}, [debouncedAutocompleteSearch]);

	const onChangeText = (val: string) => {
		setText(val);
		setTyping(val.length > 0);
		debouncedAutocompleteSearch(val);
	};

	const handleSelect = (item: GooglePlace) => {
		onUpdate(item);
		onDismiss();
		setText('');
		setLocations([]);
	};

	return (
		<BottomSheet
			title="Enter property location"
			withHeader={true}
			withBackButton={false}
			snapPoint={'80%'}
			visible={show}
			onDismiss={onDismiss}>
			<KeyboardDismissPressable>
				<View className="flex-1 px-4 gap-8 py-5 pb-8 bg-background">
					<View>
						<CustomInput
							placeholder="Search property location..."
							value={text}
							onUpdate={onChangeText}
							returnKeyLabel="Search"
							returnKeyType="search"
						/>
					</View>

					<View className="flex-1">
						<FlatList
							data={locations}
							refreshing={typing}
							keyExtractor={(item) => item.placeId!}
							contentContainerClassName="bg-background-muted p-4 rounded-xl"
							keyboardShouldPersistTaps="never"
							keyboardDismissMode="on-drag"
							ListHeaderComponent={() => (
								<View className="px-4 pb-2">
									<Text size="md" className="font-light">
										Locations
									</Text>
								</View>
							)}
							ListEmptyComponent={() => (
								<MiniEmptyState
									className="mb-8"
									title={
										text?.length > 2
											? 'No available locations'
											: 'Start typing...'
									}
								/>
							)}
							renderItem={({ item }) => (
								<Pressable
									onPress={() =>
										handleSelect({
											...item,
											displayName: composeFullAddress(item.addressComponents)!,
										})
									}>
									<View className="flex-row gap-3 p-2 border-b border-outline">
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

export default withRenderVisible(ListingAddressBottomSheet);
