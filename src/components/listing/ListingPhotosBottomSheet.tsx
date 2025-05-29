import withRenderVisible from '@/components/shared/withRenderOpen';
import { FlatList, ImageBackground, Pressable, View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText, Icon, Text } from '../ui';
import { UploadedFile } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { cn } from '@/lib/utils';
import { Camera, Images, MoreHorizontal } from 'lucide-react-native';
import { uniqueId } from 'lodash-es';
import { MiniEmptyState } from '../shared/MiniEmptyState';
import { useMemo, useState } from 'react';
import { useLayout } from '@react-native-community/hooks';
import OptionsBottomSheet from '../shared/OptionsBottomSheet';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	deleteFile: (id: number) => void;
	onUpdate: (data: UploadedFile[]) => void;
	photos?: UploadedFile[];
};
function ListingPhotosBottomSheet(props: Props) {
	const { visible, onDismiss, onUpdate, deleteFile, photos } = props;
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<number | undefined>();
	const { width, onLayout } = useLayout();
	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			selectionLimit: 15,
			orderedSelection: true,
			allowsMultipleSelection: true,
			aspect: [4, 3],
		});
		if (!result.canceled) {
			onUpdate(
				result.assets.map((img) => ({
					...img,
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
			cameraType: ImagePicker.CameraType.back,
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
	const ListHeader = useMemo(
		() => (
			<View className="flex-1 gap-2  bg-background-muted rounded-xl py-6 mb-3">
				<View className=" flex-row gap-5 items-center justify-center">
					<Button
						disabled={photos && photos?.length > 15}
						size="xl"
						onPress={pickImage}>
						<ButtonText>Choose photos</ButtonText>
						<Icon as={Images} />
					</Button>
					<Button
						disabled={photos && photos?.length > 15}
						size="xl"
						onPress={takeImage}
						variant="outline">
						<ButtonText>Take photos</ButtonText>
						<Icon as={Camera} className="text-primary" />
					</Button>
				</View>
				<Text className=" font-light text-center">
					Select any one to be the cover photo
				</Text>
			</View>
		),
		[takeImage, pickImage]
	);
	const RenderItem = ({
		item,
		index,
	}: {
		item: UploadedFile;
		index: number;
	}) => (
		<Pressable
			onPress={() => {
				setSelected(index);
				setOpenEdit(true);
			}}
			style={{ maxWidth: width / 4 }}
			className={cn('flex-1 h-24 px-2')}>
			<ImageBackground
				alt="images"
				className={cn('w-full h-full flex-1 p-1 rounded-xl overflow-hidden')}
				source={{ uri: item.uri }}>
				<View className=" flex-1 justify-between">
					<Pressable
						onPress={() => {
							setSelected(index);
							setOpenEdit(true);
						}}
						className=" self-end p-1.5 rounded-full bg-black/50 backdrop-blur-md">
						<Icon as={MoreHorizontal} className=" text-primary" />
					</Pressable>
				</View>
			</ImageBackground>
		</Pressable>
	);
	return (
		<BottomSheet
			title="Add photos to your property"
			withHeader={true}
			withBackButton={false}
			snapPoint={'90%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View
				onLayout={onLayout}
				className="flex-1 gap-2 py-4 pb-8 bg-background">
				<FlatList
					data={photos}
					numColumns={4}
					contentContainerClassName=""
					keyExtractor={(item) => item.assetId!}
					ListHeaderComponent={ListHeader}
					ListEmptyComponent={() => (
						<MiniEmptyState title="Pick or take photos to your property" />
					)}
					ItemSeparatorComponent={() => <View className=" h-4" />}
					renderItem={RenderItem}
					keyboardShouldPersistTaps="handled"
				/>
				{photos?.length && (
					<View className=" px-4">
						<Button className="h-12" onPress={onDismiss}>
							<ButtonText>Continue</ButtonText>
						</Button>
					</View>
				)}
			</View>
			<OptionsBottomSheet
				isOpen={openEdit}
				onDismiss={() => setOpenEdit(false)}
				withBackground={false}
				onChange={(val) => {
					if (!selected) return;
					if (val.value == 'delete') return deleteFile(selected);
				}}
				value={{ label: 'Set', value: 'delete' }}
				options={[
					{
						label: 'Delete Photo',
						value: 'delete',
					},
				]}
			/>
		</BottomSheet>
	);
}

export default withRenderVisible(ListingPhotosBottomSheet);
