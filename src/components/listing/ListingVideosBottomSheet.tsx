import withRenderVisible from '@/components/shared/withRenderOpen';
import { FlatList, Pressable, View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Button, ButtonText, Icon } from '../ui';
import { UploadedFile } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { Trash2 } from 'lucide-react-native';
import { uniqueId } from 'lodash-es';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import FullHeightLoaderWrapper from '../loaders/FullHeightLoaderWrapper';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	deleteFile: (id: number) => void;
	onUpdate: (data: UploadedFile[]) => void;
	videos?: UploadedFile[];
};
function ListingVideosBottomSheet(props: Props) {
	const { visible, onDismiss, onUpdate, deleteFile, videos } = props;
	const [loading, setLoading] = useState(false);
	const pickVideos = async () => {
		setLoading(true);
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['videos'],
			selectionLimit: 5,
			allowsMultipleSelection: true,
			aspect: [4, 3],
			quality: 0.6,
		});
		setLoading(false);
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
	const takeVideos = async () => {
		const permitted = await ImagePicker.getCameraPermissionsAsync();
		if (
			permitted.status == ImagePicker.PermissionStatus.DENIED ||
			permitted.status == ImagePicker.PermissionStatus.UNDETERMINED
		) {
			return await ImagePicker.requestCameraPermissionsAsync();
		}
		setLoading(true);
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ['videos'],
			selectionLimit: 15,
			allowsMultipleSelection: true,
			aspect: [4, 3],
			quality: 0.6,
		});

		setLoading(false);
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
			title="Add videos to your property"
			withHeader={true}
			withBackButton={false}
			snapPoint={'80%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View className="flex-1 gap-2 py-4 pb-8 bg-background">
				<FullHeightLoaderWrapper loading={loading}>
					<FlatList
						data={videos}
						numColumns={2}
						contentContainerClassName=""
						keyExtractor={(item) => item.assetId!}
						ListHeaderComponent={() => (
							<View className="flex-1 gap-2  bg-background-muted rounded-xl py-6 mb-3">
								<View className=" flex-row gap-5 items-center justify-center">
									<Button size="xl" onPress={pickVideos}>
										<ButtonText>Add videos</ButtonText>
									</Button>
									<Button size="xl" onPress={takeVideos} variant="outline">
										<ButtonText>Take new videos</ButtonText>
									</Button>
								</View>
							</View>
						)}
						ItemSeparatorComponent={() => <View className=" h-4" />}
						renderItem={({ item, index }) => (
							<VideoScreen
								uri={item.uri}
								index={index}
								deleteFile={deleteFile}
							/>
						)}
						keyboardShouldPersistTaps="handled"
					/>
				</FullHeightLoaderWrapper>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(ListingVideosBottomSheet);

export function VideoScreen({
	uri,
	deleteFile,
	index,
}: {
	uri: string;
	index: number;
	deleteFile: (id: number) => void;
}) {
	const player = useVideoPlayer(uri, (player) => {
		player.loop = true;
		player.muted = true;
		player.play();
	});
	return (
		<View className="flex-1 px-2 relative">
			<View className=" mx-auto">
				<VideoView
					style={{
						width: '100%',
						aspectRatio: 16 / 12,
						borderRadius: 12,
						overflow: 'hidden',
					}}
					contentFit="cover"
					nativeControls={false}
					className="flex-1 mx-auto "
					player={player}
				/>
			</View>
			<View className=" absolute top-0 right-2">
				<Pressable
					onPress={() => deleteFile(index)}
					className=" self-end p-2.5 rounded-full bg-black/50 backdrop-blur-md">
					<Icon as={Trash2} className=" text-primary" />
				</Pressable>
			</View>
		</View>
	);
}
