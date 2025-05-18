import withRenderVisible from '@/components/shared/withRenderOpen';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import BottomSheet from '../shared/BottomSheet';
import { Cities } from '@/constants/Cities';
import { useRef, useState } from 'react';
import { Icon, Text } from '../ui';
import { debounce } from 'lodash-es';
import { MapPin } from 'lucide-react-native';

type Props = {
	show: boolean;
	onDismiss: () => void;
	onUpdate: (data: string) => void;
	address?: string;
};

function ListingAddressBottomSheet(props: Props) {
	const { show, onDismiss, onUpdate, address } = props;
	const [text, setText] = useState('');
	const [typing, setTyping] = useState(false);
	const [locations, setLocations] = useState<
		{ label: string; value: string }[]
	>([]);

	const autocompleteSearch = (text: string) => {
		// if (!typing) return setLocations([]);
		setLocations(
			Cities.filter((item) =>
				item.label.toLowerCase().includes(text.toLowerCase())
			)
		);
	};

	const debouncedAutocompleteSearch = useRef(
		debounce(autocompleteSearch, 500)
	).current;

	function onChangeText(text: string) {
		setText(text);
		setTyping(text.length > 0);
		debouncedAutocompleteSearch(text);
	}
	const suggested = [
		{ label: 'Port Harcourt', value: 'port-harcourt' },
		{ label: 'Lagos', value: 'lagos' },
		{ label: 'Abuja', value: 'abuja' },
	];
	return (
		<BottomSheet
			title="Enter property address"
			withHeader={true}
			withBackButton={false}
			snapPoint={'80%'}
			visible={show}
			onDismiss={onDismiss}>
			<KeyboardDismissPressable>
				<View className="flex-1 px-4 gap-8 py-5 pb-8 bg-background">
					<View className=" h-14">
						<TextInput
							className="h-12 flex-1 px-2 bg-background-info rounded-2xl border border-outline-200"
							placeholder="Search property address..."
							value={text}
							onChangeText={onChangeText}
							returnKeyLabel="Search"
							returnKeyType="search"
						/>
					</View>
					<View className="flex-1">
						<FlatList
							data={typing ? locations : suggested}
							contentContainerClassName=" bg-background-muted p-4 rounded-xl"
							keyExtractor={(item) => item.value}
							ListHeaderComponent={() => (
								<View className="px-4">
									<Text size="md" className="font-light">
										{typing ? 'Addresses' : 'Suggested'}
									</Text>
								</View>
							)}
							renderItem={({ item }) => (
								<Pressable
									onPress={() => {
										onUpdate(item.label);
										onDismiss();
										setText('');
										setLocations([]);
									}}>
									<View className="flex-row gap-3 items-start p-3">
										<View className="mt-2">
											<Icon as={MapPin} className="text-primary" />
										</View>
										<View>
											<Text size="lg">{item.label} City</Text>
											<Text>{item.value}</Text>
										</View>
									</View>
								</Pressable>
							)}
							keyboardShouldPersistTaps="handled"
						/>
					</View>
				</View>
			</KeyboardDismissPressable>
		</BottomSheet>
	);
}

export default withRenderVisible(ListingAddressBottomSheet);
