import { Box, Icon } from '@/components/ui';
import { View } from 'react-native';
import { Heading, Pressable, Text } from '@/components/ui';
import { composeFullAddress, formatMoney, fullName } from '@/lib/utils';
import { capitalize, chunk } from 'lodash-es';
import { PropertyStatus } from '@/components/property/PropertyStatus';
import { useState } from 'react';
import { PropertyModalMediaViewer } from '@/components/modals/property/PropertyModalMediaViewer';
import { useLayout } from '@react-native-community/hooks';
import { PropertyMedia } from '@/components/property/PropertyMedia';
import { format } from 'date-fns';
import { usePropertyStore } from '@/store/propertyStore';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { Edit, Plus } from 'lucide-react-native';
import PropertyBasicEditBottomSheet from '@/components/modals/property/PropertyBasicEditBottomSheet';
import PropertyDescriptionEditBottomSheet from '@/components/modals/property/PropertyDescriptionEditBottomSheet';
import PropertyLocationEditBottomSheet from '@/components/modals/property/PropertyLocationEditBottomSheet';
import PropertyMediaBottomSheet from '@/components/modals/property/PropertyMediaBottomSheet';
import PropertyAmenitiesBottomSheet from '@/components/modals/property/PropertyAmenitiesBottomSheet';

export default function PropertyEdit() {
	const { details: property, getImages, getVideos } = usePropertyStore();
	const [isViewer, setIsViewer] = useState(false);
	const [imageIndex, setImagesIndex] = useState(0);

	const [basicEditBottomSheet, setBasicEditBottomSheet] = useState(false);
	const [locationEditBottomSheet, setLocationEditBottomSheet] = useState(false);
	const [photosBottomSheet, setPhotosBottomSheet] = useState(false);
	const [videoBottomSheet, setVideoBottomSheet] = useState(false);
	const [amenitiesBottomSheet, setAmenitiesBottomSheet] = useState(false);
	const [descriptionEditBottomSheet, setDescriptionEditBottomSheet] =
		useState(false);

	const { width, onLayout } = useLayout();
	if (!property) return null;
	return (
		<Box className="flex-1">
			<BodyScrollView>
				<View onLayout={onLayout} className="gap-y-4 flex-1 mt-4 px-4 pb-32">
					<View className=" rounded-2xl bg-background-muted p-4">
						<View className="flex-row justify-between mb-4">
							<Heading size="md">Property Info</Heading>
							<Pressable
								both
								onPress={() => setBasicEditBottomSheet(true)}
								className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center">
								<Text className="white">Edit</Text>
								<Icon size="sm" as={Edit} color="white" />
							</Pressable>
						</View>

						<View className="gap-y-3">
							<InfoRow label="Title" value={property.title} />
							<InfoRow
								label="Price"
								value={formatMoney(property.price, property.currency, 0)}
							/>
							<InfoRow label="Currency" value={property.currency} />
							<InfoRow label="Purpose" value={capitalize(property.purpose)} />
							<View className="flex-row justify-between py-1">
								<Text className="text-sm">Status:</Text>
								<PropertyStatus status={property.status} />
							</View>
							<InfoRow label="Category" value={capitalize(property.category)} />
							<InfoRow
								label="Sub-Category"
								value={capitalize(property.subcategory)}
							/>

							<InfoRow
								label="Created"
								value={format(
									new Date(property?.created_at ?? new Date()),
									'dd MMM yyyy'
								)}
							/>
						</View>
					</View>
					<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
						<View className="flex-row justify-between mb-4">
							<Heading size="md">Description</Heading>
							<Pressable
								onPress={() => setDescriptionEditBottomSheet(true)}
								both
								className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center">
								<Text className="white">Edit</Text>
								<Icon size="sm" as={Edit} color="white" />
							</Pressable>
						</View>
						<View className=" min-h-20">
							<Text numberOfLines={5}>{property?.description || 'N/A'}</Text>
						</View>
					</View>
					<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
						<View className="flex-row justify-between mb-4">
							<Heading size="md">Location</Heading>
							<Pressable
								onPress={() => setLocationEditBottomSheet(true)}
								both
								className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center">
								<Text className="white">Edit</Text>
								<Icon size="sm" as={Edit} color="white" />
							</Pressable>
						</View>
						<View className="">
							<Text>{composeFullAddress(property.address)}</Text>
						</View>
					</View>
					<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
						<View className="flex-row justify-between mb-4">
							<View>
								<Heading size="md">Photos</Heading>
								<Text size="sm">Click on photos to delete</Text>
							</View>
							<Pressable
								onPress={() => setPhotosBottomSheet(true)}
								both
								className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center">
								<Text className="white">Add</Text>
								<Icon size="sm" as={Plus} color="white" />
							</Pressable>
						</View>
						<View className="flex-wrap gap-4">
							{chunk(getImages(), 3).map((row, i) => (
								<View className={'flex-row gap-4'} key={i}>
									{row.map((media, i) => (
										<Pressable both key={media.id}>
											<PropertyMedia
												style={{
													width: width > 100 ? (width - 95) / 3 : 72,
													height: width > 100 ? (width - 95) / 3 : 72,
												}}
												rounded
												className={' bg-background-muted'}
												source={media}
												canPlayVideo={false}
												onPress={() => {
													setImagesIndex(
														property.media.findIndex(
															(img) => img.id == media.id
														) || i
													);
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
						<View className="flex-row justify-between mb-4">
							<View>
								<Heading size="md">Videos</Heading>
								<Text size="sm">Click on videos to delete</Text>
							</View>
							<Pressable
								onPress={() => setVideoBottomSheet(true)}
								both
								className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center">
								<Text className="white">Add</Text>
								<Icon size="sm" as={Plus} color="white" />
							</Pressable>
						</View>
						<View className="flex-wrap gap-4">
							{chunk(getVideos(), 3).map((row, i) => (
								<View className={'flex-row gap-4'} key={i}>
									{row.map((media, i) => (
										<Pressable both key={media.id}>
											<PropertyMedia
												style={{
													width: width > 100 ? (width - 95) / 3 : 72,
													height: width > 100 ? (width - 95) / 3 : 72,
												}}
												rounded
												className={' bg-background-muted'}
												source={media}
												canPlayVideo={false}
												onPress={() => {
													setImagesIndex(
														property.media.findIndex(
															(img) => img.id == media.id
														) || i
													);
													setIsViewer(true);
												}}
											/>
										</Pressable>
									))}
								</View>
							))}
						</View>
					</View>
					{property.amenities.length > 0 && (
						<View className="bg-background-muted rounded-2xl p-4 shadow-sm">
							<View className="flex-row justify-between mb-4">
								<Heading size="md">Amenities</Heading>
								<Pressable
									onPress={() => setAmenitiesBottomSheet(true)}
									both
									className=" bg-primary rounded-lg py-2 px-4 flex-row gap-2 items-center">
									<Text className="white">Edit</Text>
									<Icon size="sm" as={Edit} color="white" />
								</Pressable>
							</View>
							<View className=" flex-row gap-4 justify-around flex-wrap">
								{property.amenities.map((a) => (
									<View
										key={a.name}
										className="flex-row gap-2 bg-background p-2 px-4 rounded-xl">
										<Text>{a.name}</Text>
										<Text className=" font-bold text-lg text-primary">
											{a.value}
										</Text>
									</View>
								))}
							</View>
						</View>
					)}
				</View>
			</BodyScrollView>

			<PropertyModalMediaViewer
				width={width}
				selectedIndex={imageIndex}
				visible={isViewer}
				setVisible={setIsViewer}
				canPlayVideo
				isOwner
				media={property?.media}
			/>
			<PropertyBasicEditBottomSheet
				property={property}
				visible={basicEditBottomSheet}
				onDismiss={() => setBasicEditBottomSheet(false)}
			/>
			<PropertyDescriptionEditBottomSheet
				property={property}
				visible={descriptionEditBottomSheet}
				onDismiss={() => setDescriptionEditBottomSheet(false)}
			/>
			<PropertyLocationEditBottomSheet
				property={property}
				visible={locationEditBottomSheet}
				onDismiss={() => setLocationEditBottomSheet(false)}
			/>
			<PropertyMediaBottomSheet
				property={property}
				visible={photosBottomSheet}
				type="image"
				previousLenght={getImages()?.length}
				onDismiss={() => setPhotosBottomSheet(false)}
			/>
			<PropertyMediaBottomSheet
				property={property}
				visible={videoBottomSheet}
				type="video"
				previousLenght={getVideos()?.length}
				onDismiss={() => setVideoBottomSheet(false)}
			/>
			<PropertyAmenitiesBottomSheet
				property={property}
				visible={amenitiesBottomSheet}
				onDismiss={() => setAmenitiesBottomSheet(false)}
			/>
		</Box>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<View className="flex-row justify-between py-2">
			<Text className="text-sm">{label}:</Text>
			<Text className="text-base text-right max-w-[60%]">{value}</Text>
		</View>
	);
}
