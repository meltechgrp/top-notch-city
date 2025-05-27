import withRenderVisible from '@/components/shared/withRenderOpen';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import BottomSheet from '../shared/BottomSheet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Text } from '../ui';
import { debounce } from 'lodash-es';
import { MapPin } from 'lucide-react-native';
import { useApiQueryWithParams } from '@/lib/api';
import { autocompleteAddress } from '@/actions/utills';

type Props = {
	show: boolean;
	onDismiss: () => void;
	onUpdate: (data: PlacePrediction) => void;
	address?: PlacePrediction;
};

function ListingAddressBottomSheet(props: Props) {
	const { show, onDismiss, onUpdate } = props;

	const [text, setText] = useState('');
	const [locations, setLocations] = useState<PlacePrediction[]>([]);
	const [typing, setTyping] = useState(false);

	const { refetch, loading } = useApiQueryWithParams(autocompleteAddress);

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
		setTyping(val.length > 0);
		debouncedAutocompleteSearch(val);
	};

	const handleSelect = (item: PlacePrediction) => {
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
					<View className="h-14">
						<TextInput
							className="h-12 text-typography flex-1 px-2 bg-background-info rounded-2xl border border-outline-200"
							placeholder="Search property location..."
							value={text}
							onChangeText={onChangeText}
							returnKeyLabel="Search"
							returnKeyType="search"
						/>
					</View>

					<View className="flex-1">
						<FlatList
							data={locations}
							keyExtractor={(item) => item.place_id}
							contentContainerClassName="bg-background-muted p-4 rounded-xl"
							keyboardShouldPersistTaps="handled"
							ListHeaderComponent={() => (
								<View className="px-4 pb-2">
									<Text size="md" className="font-light">
										Locations
									</Text>
								</View>
							)}
							renderItem={({ item }) => (
								<Pressable onPress={() => handleSelect(item)}>
									<View className="flex-row gap-3 p-2">
										<View className="mt-2">
											<Icon as={MapPin} className="text-primary" />
										</View>
										<View className="flex-1">
											<Text className="flex-shrink text-wrap text-typography">
												{item.description}
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
