import withRenderVisible from "@/components/shared/withRenderOpen";
import { FlatList, Pressable, View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Button, ButtonText, Icon, Text } from "../ui";
import { Camera, MoreHorizontal, Video } from "lucide-react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useMemo, useState } from "react";
import { MiniEmptyState } from "../shared/MiniEmptyState";
import OptionsBottomSheet from "../shared/OptionsBottomSheet";
import { useLayout } from "@react-native-community/hooks";
import { cn } from "@/lib/utils";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { generateMediaUrlSingle } from "@/lib/api";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";

const MAX = 2;

type Props = {
  visible: boolean;
  onDismiss: () => void;
  deleteFile: (id: string) => void;
  onUpdate: (data: UploadedFile[]) => void;
  deleteAllFile: () => void;
  videos?: UploadedFile[];
};
function ListingVideosBottomSheet(props: Props) {
  const [previewFiles, setPreviewFiles] = useState<UploadedFile[]>([]);
  const { visible, onDismiss, onUpdate, deleteFile, videos, deleteAllFile } =
    props;
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<string | undefined>();

  const currentCount = useMemo(() => {
    return videos?.length || 0;
  }, [videos]);

  const { pickMedia, takeMedia, progressMap, processFiles } = useMediaUpload({
    type: "video",
    onFiles: (media) => {
      processFiles(media);
      setPreviewFiles(media);
    },
    apply_watermark: true,
    onSuccess: (media) => {
      setPreviewFiles([]);
      onUpdate(media);
    },
    maxSelection: MAX - currentCount,
  });
  const { width, onLayout } = useLayout();
  const ListHeader = useMemo(
    () => (
      <>
        <View className="flex-1 gap-2  bg-background-muted rounded-xl py-6 mb-3">
          <View className=" flex-row gap-5 px-4 items-center justify-center">
            <Button
              disabled={currentCount >= MAX}
              isDisabled={currentCount >= MAX}
              size="lg"
              className="flex-1"
              onPress={pickMedia}
            >
              <ButtonText size="sm">Choose Videos</ButtonText>
              <Icon as={Video} />
            </Button>
            <Button
              disabled={currentCount >= MAX}
              isDisabled={currentCount >= MAX}
              size="lg"
              className="flex-1"
              onPress={takeMedia}
              variant="outline"
            >
              <ButtonText size="sm">Take Videos</ButtonText>
              <Icon as={Camera} className="text-primary" />
            </Button>
          </View>
          {currentCount >= MAX && (
            <Text className=" font-light text-center">
              Maximum is {MAX} videos
            </Text>
          )}
        </View>
        <View
          className={cn(
            "flex-row flex-wrap gap-2 justify-between ",
            previewFiles.length > 0 && "my-4"
          )}
        >
          {previewFiles.map((f) => {
            let progress = progressMap[f.id] ?? 0;
            const percent = Math.round(progress || 0);

            return (
              <View
                key={f.id}
                style={{ maxWidth: width / 2, width: width / 2.1 }}
                className="h-40 px-2"
              >
                <View className="w-full h-full p-1 bg-background-muted rounded-xl overflow-hidden items-center justify-center">
                  <View className="flex-1 items-center justify-center">
                    <MotiView
                      from={{ rotate: "0deg" }}
                      animate={{ rotate: "360deg" }}
                      transition={{
                        loop: true,
                        type: "timing",
                        duration: 1000,
                        easing: Easing.linear,
                      }}
                      className="w-8 h-8 rounded-full border-2 border-outline-200 border-t-primary"
                    />
                    <Text className="absolute text-xs font-semibold text-primary">
                      {percent}%
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </>
    ),
    [currentCount, previewFiles, progressMap]
  );
  return (
    <>
      <BottomSheet
        title="Add videos"
        withHeader={true}
        withBackButton={false}
        snapPoint={"95%"}
        visible={visible}
        onDismiss={onDismiss}
      >
        <View
          onLayout={onLayout}
          className="flex-1 gap-2 py-4 pb-8 bg-background"
        >
          <FlatList
            data={videos}
            numColumns={2}
            contentContainerClassName=""
            ListEmptyComponent={() =>
              previewFiles.length == 0 ? (
                <MiniEmptyState title="Pick or take videos" />
              ) : undefined
            }
            keyExtractor={(item) => item.id!}
            ListHeaderComponent={ListHeader}
            ItemSeparatorComponent={() => <View className=" h-4" />}
            renderItem={({ item, index }) => (
              <ProfileImageTrigger image={videos || []} index={index}>
                <VideoScreen
                  item={item}
                  index={index}
                  width={width}
                  setOpenEdit={setOpenEdit}
                  setSelected={setSelected}
                />
              </ProfileImageTrigger>
            )}
            keyboardShouldPersistTaps="handled"
          />
          <View className=" flex-row gap-6 px-4 mt-auto">
            {currentCount > 1 && (
              <View className="flex-1">
                <Button
                  className="h-12"
                  variant="outline"
                  onPress={deleteAllFile}
                >
                  <ButtonText>Remove All</ButtonText>
                </Button>
              </View>
            )}
            {currentCount > 0 && (
              <View className="flex-1">
                <Button className="h-12" onPress={onDismiss}>
                  <ButtonText>Continue</ButtonText>
                </Button>
              </View>
            )}
          </View>
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
        value={{ label: "Delete", value: "delete" }}
        options={[
          {
            label: "Delete Video",
            value: "delete",
          },
        ]}
      />
    </>
  );
}

export default withRenderVisible(ListingVideosBottomSheet);

export function VideoScreen({
  item,
  setSelected,
  width,
  setOpenEdit,
  size,
  rounded = false,
}: {
  item: UploadedFile;
  index: number;
  width: number;
  size?: number;
  rounded?: boolean;
  setSelected: (id: string) => void;
  setOpenEdit: (id: boolean) => void;
}) {
  const player = useVideoPlayer(generateMediaUrlSingle(item.url), (player) => {
    player.loop = false;
  });
  return (
    <View
      className={cn(
        " overflow-hidden bg-background-muted ml-2 border border-outline-100 p-1 relative rounded-xl"
      )}
    >
      <VideoView
        style={{
          width: size || width / 2.2,
          height: size || 120,
          borderRadius: 8,
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
              setSelected(item.id);
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
