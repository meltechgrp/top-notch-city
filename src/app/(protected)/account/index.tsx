import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	Box,
	ImageBackground,
	Pressable,
	View,
	Text,
	Icon,
} from '@/components/ui';
import { ScrollView } from 'react-native';
import React, { useState } from 'react';
import { cn, fullName } from '@/lib/utils';
import { profileDefault, useStore, useTempStore } from '@/store';
import { ChevronRight, Edit2 } from 'lucide-react-native';
import { format } from 'date-fns';
import ProfileImageBottomSheet from '@/components/account/ProfileImageBottomSheet';
import { setProfileImage } from '@/actions/user';
import { ImagePickerAsset } from 'expo-image-picker';
import config from '@/config';
import { getImageUrl } from '@/lib/api';

export default function Account() {
	const { me } = useStore();
	const { updateFullScreenLoading } = useTempStore();
	const [imageBottomSheet, setImageBottomSheet] = useState(false);
	async function handleImageUpload(image: ImagePickerAsset) {
		updateFullScreenLoading(true);
		await setProfileImage(image, me?.first_name ?? 'profile');
		updateFullScreenLoading(false);
	}
	return (
		<>
			<ImageBackground
				source={require('@/assets/images/landing/home.png')}
				className="flex-1">
				<Box className={cn('flex-1 bg-background/95')}>
					<ScrollView
						style={{ display: 'flex' }}
						showsVerticalScrollIndicator={false}
						contentContainerClassName="pb-40 pt-10">
						<View className=" items-center">
							<Pressable
								onPress={() => setImageBottomSheet(true)}
								className=" gap-2 items-center">
								<Avatar className=" w-40 h-40">
									<AvatarFallbackText>{fullName(me)}</AvatarFallbackText>
									<AvatarImage source={getImageUrl(me?.profile_image)} />
								</Avatar>
								<View className="flex-row items-center gap-1">
									<Text>Edit</Text>
									<Icon size="sm" as={Edit2} />
								</View>
							</Pressable>
						</View>
						<View className="pt-8 flex-1 px-4 gap-6">
							<View className="gap-2">
								<View className="px-4">
									<Text size="lg" className="font-light">
										Full Name
									</Text>
								</View>
								<View className="flex-row justify-between items-center bg-background-muted rounded-xl p-4">
									<Text size="lg" className=" font-normal">
										{fullName(me) ?? 'N/A'}
									</Text>
									<Icon as={ChevronRight} />
								</View>
							</View>
							<View className="gap-2">
								<View className="px-4">
									<Text size="lg" className="font-light">
										Email Address
									</Text>
								</View>
								<View className="flex-row justify-between items-center bg-background-muted rounded-xl p-4">
									<Text size="lg" className=" font-normal">
										{me?.email ?? 'N/A'}
									</Text>
									<Icon as={ChevronRight} />
								</View>
							</View>
							<View className="gap-2">
								<View className="px-4">
									<Text size="lg" className="font-light">
										Phone number
									</Text>
								</View>
								<View className="flex-row justify-between items-center bg-background-muted rounded-xl p-4">
									<Text size="lg" className=" font-normal">
										{me?.phone ?? 'N/A'}
									</Text>
									<Icon as={ChevronRight} />
								</View>
							</View>
							<View className="gap-2">
								<View className="px-4">
									<Text size="lg" className="font-light">
										Gender
									</Text>
								</View>
								<View className="flex-row justify-between items-center bg-background-muted rounded-xl p-4">
									<Text size="lg" className=" font-normal">
										{me?.gender ?? 'N/A'}
									</Text>
									<Icon as={ChevronRight} />
								</View>
							</View>
							<View className="gap-2">
								<View className="px-4">
									<Text size="lg" className="font-light">
										Birthday
									</Text>
								</View>
								<View className="flex-row justify-between items-center bg-background-muted rounded-xl p-4">
									<Text size="lg" className=" font-normal">
										{me?.date_of_birth
											? format(new Date(me?.date_of_birth), 'MMM dd, yyyy')
											: 'N/A'}
									</Text>
									<Icon as={ChevronRight} />
								</View>
							</View>
						</View>
					</ScrollView>
				</Box>
			</ImageBackground>
			<ProfileImageBottomSheet
				visible={imageBottomSheet}
				onDismiss={() => setImageBottomSheet(false)}
				updateImage={handleImageUpload}
			/>
		</>
	);
}
