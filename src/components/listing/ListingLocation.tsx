import { Box, Heading, Icon, Text, View } from '@/components/ui';
import Map from '../location/map';
import Layout from '@/constants/Layout';
import { useState } from 'react';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import ListingAddressBottomSheet from './ListingAddressBottomSheet';
import { Pressable } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTempStore } from '@/store';

export default function ListingLocation() {
	const { listing, updateListing } = useTempStore();
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const height = Layout.window.height / 1.5;
	return (
		<>
			<Box className="flex-1 ">
				<KeyboardDismissPressable>
					<View className=" py-6 gap-4 px-4">
						<Heading size="xl">Where is your property Located</Heading>
					</View>
					<View className=" flex-1 relative">
						<View className="absolute top-6 w-full z-10 px-4">
							<Pressable
								onPress={() => setShowBottomSheet(true)}
								className="flex-1 h-14 p-2 pl-4 flex-row bg-background-muted rounded-full items-center gap-1">
								<Text
									size="md"
									numberOfLines={1}
									className="flex-1 text-typography/70">
									{listing?.address?.description
										? listing.address.description
										: 'Search property address...'}
								</Text>

								<View className=" p-2 bg-primary rounded-full">
									<Icon as={Search} color="white" />
								</View>
							</Pressable>
						</View>
						<Map showUserLocation={true} height={height} />
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
