import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import ListingAmenities from '@/components/listing/ListingAmenities';
import ListingBottomNavigation from '@/components/listing/ListingBottomNavigation';
import ListingCategory from '@/components/listing/ListingCategory';
import ListingLocation from '@/components/listing/ListingLocation';
import ListingPurpose from '@/components/listing/ListingPurpose';
import { Box, Button, ButtonText } from '@/components/ui';
import { useTempStore } from '@/store';
import { Stack, useRouter } from 'expo-router';
import { useMemo } from 'react';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function SellAddScreen() {
	const router = useRouter();
	const { listing, updateListing } = useTempStore();

	const Steps = useMemo(() => {
		switch (listing.step) {
			case 1:
				return (
					<ListingPurpose
						option={listing.purpose}
						onUpdate={(option) =>
							updateListing({ ...listing, purpose: option })
						}
					/>
				);
			case 2:
				return (
					<ListingCategory
						option={listing.category}
						onUpdate={(option) =>
							updateListing({ ...listing, category: option })
						}
					/>
				);
			case 3:
				return <ListingLocation />;
			case 4:
				return <ListingAmenities />;
			default:
				return null;
		}
	}, [listing.step, listing.purpose, listing.category]);

	return (
		<>
			<Stack.Screen
				options={{
					headerLeft: () => (
						<Button
							onPress={() => router.push('/sell')}
							size="md"
							variant="outline"
							action="primary"
							className="mb-1">
							<ButtonText>Save & exit</ButtonText>
						</Button>
					),
					headerRight: () => (
						<Button
							onPress={() => router.push('/(protected)/support/faq')}
							size="md"
							variant="outline"
							action="secondary"
							className="mb-1">
							<ButtonText>Help?</ButtonText>
						</Button>
					),
				}}
			/>
			<Box className="flex-1 py-3">
				<BodyScrollView className="flex-1">
					<Animated.View
						entering={FadeInRight.duration(1000)}
						exiting={FadeOutLeft.duration(1000)}
						key={listing.step}
						className={'flex-1'}>
						{Steps}
					</Animated.View>
				</BodyScrollView>
			</Box>
			<ListingBottomNavigation
				step={listing.step}
				totalSteps={listing.totalSteps}
				onUpdate={(step) => updateListing({ ...listing, step })}
			/>
		</>
	);
}
