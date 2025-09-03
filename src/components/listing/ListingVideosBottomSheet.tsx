import withRenderVisible from "@/components/shared/withRenderOpen";
import { FlatList, Pressable, View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Button, ButtonText, Icon, Text } from "../ui";
import { Camera, MoreHorizontal, Video } from "lucide-react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useMemo, useState } from "react";
import FullHeightLoaderWrapper from "../loaders/FullHeightLoaderWrapper";
import { MiniEmptyState } from "../shared/MiniEmptyState";
import OptionsBottomSheet from "../shared/OptionsBottomSheet";
import { useLayout } from "@react-native-community/hooks";
import { cn } from "@/lib/utils";
import { useMediaUpload } from "@/hooks/useMediaUpload";

const MAX = 1;

type Props = {
  visible: boolean;
  onDismiss: () => void;
  deleteFile: (id: number) => void;
  onUpdate: (data: UploadedFile[]) => void;
  deleteAllFile: () => void;
  videos?: UploadedFile[];
};
function ListingVideosBottomSheet(props: Props) {
  const { visible, onDismiss, onUpdate, deleteFile, videos, deleteAllFile } =
    props;
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<number | undefined>();

  const currentCount = useMemo(() => {
    return videos?.length || 0;
  }, [videos]);

  const { loading, pickMedia, takeMedia } = useMediaUpload({
    type: "video",
    onSuccess: onUpdate,
    maxSelection: MAX - currentCount,
  });
  const { width, onLayout } = useLayout();
  const ListHeader = useMemo(
    () => (
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
          <Text className=" font-light text-center">Maximum is 4 videos</Text>
        )}
      </View>
    ),
    [takeMedia, pickMedia]
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
