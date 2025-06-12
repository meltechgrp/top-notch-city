import { useUploadProperty } from '@/actions/property';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import ListingAmenities from '@/components/listing/ListingAmenities';
import ListingBasis from '@/components/listing/ListingBasis';
import ListingBottomNavigation from '@/components/listing/ListingBottomNavigation';
import ListingCategory from '@/components/listing/ListingCategory';
import ListingLocation from '@/components/listing/ListingLocation';
import ListingMediaFiles from '@/components/listing/ListingMediaFiles';
import ListingPurpose from '@/components/listing/ListingPurpose';
import FullHeightLoaderWrapper from '@/components/loaders/FullHeightLoaderWrapper';
import headerLeft from '@/components/shared/headerLeft';
import { Box, Button, ButtonText } from '@/components/ui';
import { showSnackbar } from '@/lib/utils';
import { useTempStore } from '@/store';
import { useLayout } from '@react-native-community/hooks';
import { Stack, useRouter } from 'expo-router';
import { useMemo } from 'react';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function SellAddScreen() {
	const router = useRouter();
	const { onLayout, height } = useLayout();
	const {
		uploadProperty,
		uploading: loading,
		error,
		success,
	} = useUploadProperty();
	const { listing, updateListing, updateListingStep } = useTempStore();

	const Steps = useMemo(() => {
		switch (listing.step) {
			case 1:
				return <ListingPurpose />;
			case 2:
				return <ListingCategory />;
			case 3:
				return <ListingLocation />;
			case 4:
				return <ListingAmenities />;
			case 5:
				return <ListingMediaFiles />;
			case 6:
				return <ListingBasis />;
			default:
				return null;
		}
	}, [listing.step]);
	function handleNext(step: number, back?: boolean) {
		if (back) {
			return updateListing({ ...listing, step });
		}
		if (listing.step == 1 && !listing?.purpose)
			return showSnackbar({
				message: 'Please pick your purpose',
				type: 'warning',
			});
		if (listing.step == 2 && !listing?.subCategory)
			return showSnackbar({
				message: 'Please select a category',
				type: 'warning',
			});
		if (listing.step == 3 && !listing?.address?.displayName)
			return showSnackbar({
				message: 'Please enter property location!',
				type: 'warning',
			});
		if (listing.step == 5 && !listing?.photos?.length)
			if (listing?.photos && listing?.photos?.length < 3)
				return showSnackbar({
					message: 'Select at least 3 images',
					type: 'info',
				});
			else
				return showSnackbar({
					message: 'Add some images to proceed!',
					type: 'warning',
				});
		updateListingStep();
	}
	async function uploaHandler() {
		const data = await uploadProperty(listing);
		if (data?.id) {
			router.dismissTo('/listing/success');
		} else {
			showSnackbar({
				message: error ?? 'Something went wrong',
				type: 'error',
			});
		}
	}
	return (
		<>
			<Stack.Screen
				options={{
					headerLeft: headerLeft(),
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
				<FullHeightLoaderWrapper className="flex-1" loading={loading}>
					<BodyScrollView className="flex-1" contentContainerClassName="pb-60">
						<Animated.View
							entering={FadeInRight.duration(800)}
							exiting={FadeOutLeft.duration(800)}
							key={listing.step}
							style={{ height }}
							className={'flex-1'}>
							{Steps}
						</Animated.View>
					</BodyScrollView>
				</FullHeightLoaderWrapper>
			</Box>
			<ListingBottomNavigation
				step={listing.step}
				listing={listing}
				uploaHandler={uploaHandler}
				onUpdate={handleNext}
			/>
		</>
	);
}
