import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import ListingAmenities from '@/components/listing/ListingAmenities';
import ListingBasis from '@/components/listing/ListingBasis';
import ListingBottomNavigation from '@/components/listing/ListingBottomNavigation';
import ListingCategory from '@/components/listing/ListingCategory';
import ListingLocation from '@/components/listing/ListingLocation';
import ListingMediaFiles from '@/components/listing/ListingMediaFiles';
import ListingPurpose from '@/components/listing/ListingPurpose';
import ListingSucces from '@/components/listing/ListingSuccess';
import { Box, Button, ButtonText } from '@/components/ui';
import { useTempStore } from '@/store';
import { useLayout } from '@react-native-community/hooks';
import { Stack, useRouter } from 'expo-router';
import { useMemo } from 'react';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function SellAddScreen() {
	const router = useRouter();
	const { onLayout, height } = useLayout();
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
			case 5:
				return <ListingMediaFiles />;
			case 6:
				return <ListingBasis />;
			case 7:
				return <ListingSucces />;
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
			<Box onLayout={onLayout} className="flex-1 py-3">
				<BodyScrollView className="flex-1">
					<Animated.View
						entering={FadeInRight.duration(800)}
						exiting={FadeOutLeft.duration(800)}
						key={listing.step}
						style={{ height }}
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
