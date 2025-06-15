import { View } from 'react-native';
import { Button, ButtonText, Heading, Pressable, Text } from '@/components/ui';
import withRenderVisible from '@/components/shared/withRenderOpen';
import { composeFullAddress, formatMoney, fullName } from '@/lib/utils';
import { capitalize, chunk } from 'lodash-es';
import BottomSheet from '@/components/shared/BottomSheet';
import { PropertyStatus } from '@/components/property/PropertyStatus';
import { useMemo, useState } from 'react';
import { PropertyModalMediaViewer } from '@/components/property/PropertyModalMediaViewer';
import { useLayout } from '@react-native-community/hooks';
import { PropertyMedia } from '@/components/property/PropertyMedia';

type PropertyBottomSheetProps = {
	visible: boolean;
	property: Property;
	onDismiss: () => void;
	onApprove?: () => void;
	onReject?: () => void;
};

function PropertyBottomSheet(props: PropertyBottomSheetProps) {
	const { visible, property, onDismiss, onApprove, onReject } = props;
	const [isViewer, setIsViewer] = useState(false);
	const [imageIndex, setImagesIndex] = useState(0);
	const { width, onLayout } = useLayout();
	return (
		<BottomSheet
			title="Review Property"
			onDismiss={onDismiss}
			visible={visible}
			withHeader
			withScroll={true}
			snapPoint={[450, 720]}>
			<View onLayout={onLayout} className="gap-y-4 flex-1 mt-4 px-4 pb-32">
				<View className=" rounded-2xl bg-background-muted p-4">
					<Heading size="md" className="mb-3">
						Property Info
					</Heading>

					<View className="gap-y-3">
						<InfoRow label="Title" value={property.title} />
						<InfoRow
							label="Price"
							value={formatMoney(property.price, property.currency, 0)}
						/>
						<InfoRow label="Purpose" value={capitalize(property.purpose)} />
						<View className="flex-row justify-between py-1">
							<Text className="text-sm">Status:</Text>
							<PropertyStatus status={property.status} />
						</View>
						<InfoRow label="Category" value={capitalize(property.category)} />
						<InfoRow
							label="Subcategory"
							value={capitalize(property.subcategory)}
						/>
						<InfoRow
							label="Address"
							value={composeFullAddress(property.address, true)}
						/>
					</View>
				</View>
				<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
					<Heading size="md" className="mb-3">
						Description
					</Heading>
					<View className=" min-h-20">
						<Text numberOfLines={5}>{property?.description || 'N/A'}</Text>
					</View>
				</View>
				<View className="bg-background-muted min-h-32 rounded-2xl p-4 shadow-sm">
					<Heading size="md" className="mb-3">
						Media
					</Heading>
					<View className="flex-wrap gap-4">
						{chunk(property?.media_urls, 4).map((row, i) => (
							<View className={'flex-row gap-4'} key={i}>
								{row.map((media, i) => (
									<Pressable key={media}>
										<PropertyMedia
											style={{
												width: width > 100 ? (width - 100) / 4 : 72,
												height: width > 100 ? (width - 100) / 4 : 72,
											}}
											rounded
											className={' bg-background-muted'}
											source={media}
											canPlayVideo={false}
											onPress={() => {
												setImagesIndex(i);
												setIsViewer(true);
											}}
										/>
									</Pressable>
								))}
							</View>
						))}
					</View>
				</View>
				<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
					<Heading size="md" className="mb-3">
						Owner
					</Heading>
					<View className="gap-y-3">
						<InfoRow label="Name" value={fullName(property.owner)} />
						<InfoRow label="Email" value={property.owner?.email ?? 'N/A'} />
						{/* <InfoRow
								label="Joined"
								value={format(
									new Date(property.owner?.created_at ?? new Date()),
									'dd MMM yyyy'
								)}
							/> */}
					</View>
				</View>
				{property.amenities.length > 0 && (
					<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
						<Heading size="md" className="mb-3">
							Amenities
						</Heading>
						<Text className="text-sm">
							{property.amenities.map((a) => a.name).join(', ')}
						</Text>
					</View>
				)}
				{property.status == 'pending' && (
					<View className="mt-6 flex-row gap-4">
						<Button className="flex-1 h-12" variant="solid" onPress={onReject}>
							<ButtonText>Reject</ButtonText>
						</Button>
						<Button
							className="flex-1 h-12 bg-gray-500"
							variant="solid"
							onPress={onApprove}>
							<ButtonText>Approve</ButtonText>
						</Button>
					</View>
				)}
			</View>

			<PropertyModalMediaViewer
				width={width}
				selectedIndex={imageIndex}
				visible={isViewer}
				setVisible={setIsViewer}
				canPlayVideo
				media={property?.media_urls}
			/>
		</BottomSheet>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<View className="flex-row justify-between py-2">
			<Text className="text-sm">{label}:</Text>
			<Text className="text-sm text-right max-w-[60%]">{value}</Text>
		</View>
	);
}

export default withRenderVisible(PropertyBottomSheet);
