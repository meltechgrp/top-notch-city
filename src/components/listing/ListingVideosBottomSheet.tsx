import withRenderVisible from "@/components/shared/withRenderOpen";
import { FlatList, Pressable, View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Button, ButtonText, Icon, Text } from "../ui";
import * as ImagePicker from "expo-image-picker";
import { Camera, MoreHorizontal, Video } from "lucide-react-native";
import { uniqueId } from "lodash-es";
import { useVideoPlayer, VideoView } from "expo-video";
import { useMemo, useState } from "react";
import FullHeightLoaderWrapper from "../loaders/FullHeightLoaderWrapper";
import { MiniEmptyState } from "../shared/MiniEmptyState";
import OptionsBottomSheet from "../shared/OptionsBottomSheet";
import { useLayout } from "@react-native-community/hooks";
import { useMediaCompressor } from "@/hooks/useMediaCompressor";
import { cn, showSnackbar } from "@/lib/utils";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  deleteFile: (id: number) => void;
  onUpdate: (data: UploadedFile[]) => void;
  videos?: UploadedFile[];
};
function ListingVideosBottomSheet(props: Props) {
  const { visible, onDismiss, onUpdate, deleteFile, videos } = props;
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const { compress } = useMediaCompressor();

  const { width, onLayout } = useLayout();
  const pickVideos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      aspect: [4, 3],
      quality: 1,
      // videoQuality: ImagePicker.UIImagePickerControllerQualityType.Low,
      allowsEditing: true,
      // videoMaxDuration: 1200,
    });
    if (!result.canceled) {
      setLoading(true);
      await handleUpload(
        result.assets.map((vid) => ({
          uri: vid.uri,
        }))
      );
    } else {
      setLoading(false);
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
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      aspect: [4, 3],
      quality: 0.6,
      cameraType: ImagePicker.CameraType.back,
      allowsEditing: true,
      // videoMaxDuration: 1200,
    });

    if (!result.canceled) {
      setLoading(true);
      await handleUpload(
        result.assets.map((vid) => ({
          uri: vid.uri,
        }))
      );
    } else {
      setLoading(false);
    }
  };

  async function handleUpload(data: { uri: string }[]) {
    const result = await Promise.all(
      data.map(
        async (file) =>
          await compress({
            type: "video",
            uri: file.uri,
          })
      )
    );
    const compressed = result
      .filter((item) => item !== null)
      .map((item) => ({ uri: item, id: uniqueId() }));
    setLoading(false);
    if (compressed.length == 0) {
      return showErrorAlert({
        title: "Failed to upload.. try again",
        alertType: "warn",
      });
    } else {
      onUpdate(compressed);
    }
  }
  const ListHeader = useMemo(
    () => (
      <View className="flex-1 gap-2  bg-background-muted rounded-xl py-6 mb-3">
        <View className=" flex-row gap-5 px-4 items-center justify-center">
          <Button
            disabled={videos && videos?.length > 2}
            size="lg"
            className="flex-1"
            onPress={pickVideos}
          >
            <ButtonText size="md">Choose Videos</ButtonText>
            <Icon as={Video} />
          </Button>
          <Button
            disabled={videos && videos?.length > 2}
            size="lg"
            className="flex-1"
            onPress={takeVideos}
            variant="outline"
          >
            <ButtonText size="md">Take Videos</ButtonText>
            <Icon as={Camera} className="text-primary" />
          </Button>
        </View>
        <Text className=" font-light text-center">Maximum is 3 videos</Text>
      </View>
    ),
    [takeVideos, pickVideos]
  );
  return (
    <>
      <BottomSheet
        title="Add videos to your property"
        withHeader={true}
        withBackButton={false}
        snapPoint={"80%"}
        visible={visible}
        onDismiss={onDismiss}
      >
        <View
          onLayout={onLayout}
          className="flex-1 gap-2 py-4 pb-8 bg-background"
        >
          <FullHeightLoaderWrapper loading={loading}>
            <FlatList
              data={videos}
              numColumns={2}
              contentContainerClassName=""
              ListEmptyComponent={() => (
                <MiniEmptyState title="Pick or take videos to your property" />
              )}
              keyExtractor={(item) => item.id!}
              ListHeaderComponent={ListHeader}
              ItemSeparatorComponent={() => <View className=" h-4" />}
              renderItem={({ item, index }) => (
                <VideoScreen
                  uri={item.uri}
                  index={index}
                  width={width}
                  setOpenEdit={setOpenEdit}
                  setSelected={setSelected}
                />
              )}
              keyboardShouldPersistTaps="handled"
            />
            {videos?.length && (
              <View className=" px-4">
                <Button className="h-12" onPress={onDismiss}>
                  <ButtonText>Continue</ButtonText>
                </Button>
              </View>
            )}
          </FullHeightLoaderWrapper>
        </View>
      </BottomSheet>
      <OptionsBottomSheet
        isOpen={openEdit}
        onDismiss={() => setOpenEdit(false)}
        withBackground={false}
        onChange={(val) => {
          if (!selected) return;
          if (val.value == "delete") return deleteFile(selected);
        }}
        value={{ label: "Set as Cover Photo", value: "delete" }}
        options={[
          {
            label: "Delete Photo",
            value: "delete",
          },
        ]}
      />
    </>
  );
}

export default withRenderVisible(ListingVideosBottomSheet);

export function VideoScreen({
  uri,
  setSelected,
  index,
  width,
  setOpenEdit,
  size,
  rounded = false,
}: {
  uri: string;
  index: number;
  width: number;
  size?: number;
  rounded?: boolean;
  setSelected: (id: number) => void;
  setOpenEdit: (id: boolean) => void;
}) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });
  return (
    <View
      className={cn(
        " overflow-hidden p-2 relative",
        rounded && "rounded-xl p-0"
      )}
    >
      <VideoView
        style={{
          width: size || width / 2.2,
          height: size || 120,
        }}
        contentFit="cover"
        nativeControls={false}
        className="flex-1 mx-auto"
        player={player}
      />
      {!rounded && (
        <View className=" absolute top-3 right-3">
          <Pressable
            onPress={() => {
              setSelected(index + 1);
              setOpenEdit(true);
            }}
            className=" self-end p-1.5 rounded-full bg-black/50 backdrop-blur-md"
          >
            <Icon as={MoreHorizontal} className=" text-primary" />
          </Pressable>
        </View>
      )}
    </View>
  );
}
