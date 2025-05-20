import withRenderVisible from '@/components/shared/withRenderOpen';
import { FlatList, ImageBackground, Pressable, View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText, Icon, Text } from '../ui';
import { UploadedFile } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react-native';
import { uniqueId } from 'lodash-es';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	deleteFile: (id: number) => void;
	setCoverPhoto: (id: number) => void;
	onUpdate: (data: UploadedFile[]) => void;
	photos?: UploadedFile[];
};
function ListingPhotosBottomSheet(props: Props) {
	const { visible, onDismiss, setCoverPhoto, onUpdate, deleteFile, photos } =
		props;
	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			selectionLimit: 15,
			allowsMultipleSelection: true,
			aspect: [4, 3],
		});
		if (!result.canceled) {
			onUpdate(
				result.assets.map((img) => ({
					...img,
					default: false,
					assetId: uniqueId(),
				}))
			);
		}
	};
	const takeImage = async () => {
		const permitted = await ImagePicker.getCameraPermissionsAsync();
		if (
			permitted.status == ImagePicker.PermissionStatus.DENIED ||
			permitted.status == ImagePicker.PermissionStatus.UNDETERMINED
		) {
			return await ImagePicker.requestCameraPermissionsAsync();
		}
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ['images'],
			selectionLimit: 15,
			allowsMultipleSelection: true,
			aspect: [4, 3],
		});

		if (!result.canceled) {
			onUpdate(
				result.assets.map((img) => ({
					...img,
					default: false,
					assetId: uniqueId(),
				}))
			);
		}
	};
	return (
		<BottomSheet
			title="Add photos to your property"
			withHeader={true}
			withBackButton={false}
			snapPoint={'80%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View className="flex-1 gap-2 py-4 pb-8 bg-background">
				<FlatList
					data={photos}
					numColumns={2}
					contentContainerClassName=""
					keyExtractor={(item) => item.assetId!}
					ListHeaderComponent={() => (
						<View className="flex-1 gap-2  bg-background-muted rounded-xl py-6 mb-3">
							<View className=" flex-row gap-5 items-center justify-center">
								<Button size="xl" onPress={pickImage}>
									<ButtonText>Add photos</ButtonText>
								</Button>
								<Button size="xl" onPress={takeImage} variant="outline">
									<ButtonText>Take new photos</ButtonText>
								</Button>
							</View>
							<Text className=" font-light text-center">
								Select any one to be the cover photo
							</Text>
						</View>
					)}
					ItemSeparatorComponent={() => <View className=" h-4" />}
					renderItem={({ item, index }) => (
						<Pressable
							onPress={() => setCoverPhoto(index)}
							className={cn('flex-1 h-44 px-2')}>
							<ImageBackground
								alt="images"
								className={cn(
									'w-full h-full flex-1 p-4  rounded-xl overflow-hidden',
									item.default && 'border border-primary'
								)}
								source={{ uri: item.uri }}>
								<View className=" flex-1 justify-between">
									<Pressable
										onPress={() => deleteFile(index)}
										className=" self-end p-2.5 rounded-full bg-black/50 backdrop-blur-md">
										<Icon as={Trash2} className=" text-primary" />
									</Pressable>
									{item.default && (
										<View className=" bg-black/60 backdrop-blur-md self-start p-2 px-4 rounded-xl">
											<Text size="xl" className="text-white">
												Cover photo
											</Text>
										</View>
									)}
								</View>
							</ImageBackground>
						</Pressable>
					)}
					keyboardShouldPersistTaps="handled"
				/>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(ListingPhotosBottomSheet);
