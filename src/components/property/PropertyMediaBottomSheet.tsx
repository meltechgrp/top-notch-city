import withRenderVisible from '@/components/shared/withRenderOpen';
import { FlatList, ImageBackground, Pressable, View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText, Icon, Text } from '../ui';
import { UploadedFile } from '@/store';
import { cn, showSnackbar } from '@/lib/utils';
import { Camera, Images, MoreHorizontal, Video } from 'lucide-react-native';
import { MiniEmptyState } from '../shared/MiniEmptyState';
import { useMemo, useState } from 'react';
import { useLayout } from '@react-native-community/hooks';
import OptionsBottomSheet from '../shared/OptionsBottomSheet';
import FullHeightLoaderWrapper from '../loaders/FullHeightLoaderWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { usePropertyDataMutations } from '@/tanstack/mutations/usePropertyDataMutations';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	property: Property;
	previousLenght?: number;
	type: 'image' | 'video';
};

const Max_Photos_lenght = 16;
const Max_Videos_lenght = 3;

function PropertyMediaBottomSheet(props: Props) {
	const { visible, onDismiss, type, previousLenght = 0, property } = props;
	const [photos, setPhotos] = useState<{ uri: string; id: string }[]>([]);
	const [openEdit, setOpenEdit] = useState(false);
	const [selected, setSelected] = useState<string | undefined>();
	const { width, onLayout } = useLayout();
	const { updatePropertyMediaMutation } = usePropertyDataMutations();
	const currentCount = useMemo(() => {
		const max = type == 'image' ? Max_Photos_lenght : Max_Videos_lenght;
		return max - previousLenght - photos?.length;
	}, [photos, previousLenght, type]);
	const { loading, pickMedia, takeMedia } = useMediaUpload({
		type: type,
		onSuccess: (media) => setPhotos(media),
		maxSelection: currentCount,
	});

	async function handleUpload() {
		await updatePropertyMediaMutation.mutateAsync(
			{
				propertyId: property.id,
				data: photos,
			},
			{
				onSuccess: () => {
					showSnackbar({
						message: 'Property updated successfully',
						type: 'success',
					});
					onDismiss();
				},
				onError: () => {
					showSnackbar({ message: 'Failed to update property', type: 'error' });
				},
			}
		);
	}
	const ListHeader = useMemo(
		() => (
			<View className="flex-1 gap-2  bg-background-muted rounded-xl py-6 mb-3">
				<View className=" flex-row px-4 gap-5 items-center justify-center">
					<Button
						disabled={photos && photos?.length > 15}
						size="xl"
						className="flex-1"
						isDisabled={currentCount < 2}
						onPress={pickMedia}>
						<ButtonText>
							Choose {type == 'image' ? 'photos' : 'videos'}
						</ButtonText>
						{type == 'image' ? <Icon as={Images} /> : <Icon as={Video} />}
					</Button>
					<Button
						disabled={photos && photos?.length > 15}
						size="xl"
						className="flex-1"
						isDisabled={currentCount < 2}
						onPress={takeMedia}
						variant="outline">
						<ButtonText>
							Take {type == 'image' ? 'photos' : 'videos'}
						</ButtonText>
						<Icon as={Camera} className="text-primary" />
					</Button>
				</View>
				<Text className=" font-light text-center">
					{currentCount < 2
						? 'You have reached you limit. Max is 15'
						: 'Pick from your phone galary or take new ones to upload'}
				</Text>
			</View>
		),
		[takeMedia, pickMedia]
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
				setSelected(item.id);
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
							setSelected(item.id);
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
				<SafeAreaView edges={['bottom']} className={'flex-1'}>
					<FullHeightLoaderWrapper loading={loading}>
						<FlatList
							data={photos}
							numColumns={4}
							contentContainerClassName=""
							keyExtractor={(item) => item.id!}
							ListHeaderComponent={ListHeader}
							ListEmptyComponent={() => (
								<MiniEmptyState title="Pick or take media files for your property" />
							)}
							ItemSeparatorComponent={() => <View className=" h-4" />}
							renderItem={RenderItem}
							keyboardShouldPersistTaps="handled"
						/>
					</FullHeightLoaderWrapper>
					{photos?.length && (
						<View className=" px-4">
							<Button className="h-12" onPress={handleUpload}>
								<ButtonText>Upload</ButtonText>
							</Button>
						</View>
					)}
				</SafeAreaView>
			</View>
			<OptionsBottomSheet
				isOpen={openEdit}
				onDismiss={() => setOpenEdit(false)}
				withBackground={false}
				onChange={(val) => {
					if (!selected) return;
					return setPhotos(photos.filter((p) => p.id !== selected));
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

export default withRenderVisible(PropertyMediaBottomSheet);
