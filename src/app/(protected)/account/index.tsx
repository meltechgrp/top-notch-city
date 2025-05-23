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
import { profileDefault, useStore } from '@/store';
import { ChevronRight, Edit2 } from 'lucide-react-native';
import { format } from 'date-fns';
import ProfileImageBottomSheet from '@/components/account/ProfileImageBottomSheet';

export default function Account() {
	const { me, updateProfile } = useStore();
	const [imageBottomSheet, setImageBottomSheet] = useState(false);
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
									<AvatarImage
										source={
											me?.photo
												? {
														uri: me?.photo,
													}
												: profileDefault
										}
									/>
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
										{me?.phoneNumber ?? 'N/A'}
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
										{me?.dob
											? format(new Date(me?.dob), 'MMM dd, yyyy')
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
				photo={me?.photo}
				onUpdate={updateProfile}
			/>
		</>
	);
}
