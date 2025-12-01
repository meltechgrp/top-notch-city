import withRenderVisible from "@/components/shared/withRenderOpen";
import { FlatList, Pressable, View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Button, ButtonText, Icon, Image, Text } from "../ui";
import { Camera, Images, MoreHorizontal } from "lucide-react-native";
import { MiniEmptyState } from "../shared/MiniEmptyState";
import { useMemo, useState } from "react";
import { useLayout } from "@react-native-community/hooks";
import OptionsBottomSheet from "../shared/OptionsBottomSheet";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { Easing } from "react-native-reanimated";
import { MotiView } from "moti";
import {
  ImageViewerProvider,
  ProfileImageTrigger,
} from "@/components/custom/ImageViewerProvider";
import { cn } from "@/lib/utils";
import { generateMediaUrlSingle } from "@/lib/api";

const MAX = 25;

type Props = {
  visible: boolean;
  onDismiss: () => void;
  deleteFile: (id: string) => void;
  deleteAllFile: () => void;
  onUpdate: (data: Media[]) => void;
  photos?: Media[];
  multiple?: boolean;
  withDescription?: boolean;
};

function ListingPhotosBottomSheet({
  visible,
  onDismiss,
  onUpdate,
  deleteFile,
  deleteAllFile,
  photos,
}: Props) {
  const [previewFiles, setPreviewFiles] = useState<UploadedFile[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<string | undefined>();
  const { width, onLayout } = useLayout();

  const currentCount = photos?.length || 0;

  const { pickMedia, takeMedia, progressMap, processFiles } = useMediaUpload({
    type: "image",
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

  const ListHeader = useMemo(
    () => (
      <>
        <View className="gap-2 bg-background-muted rounded-xl py-6 mb-4">
          <View className="flex-row gap-5 px-4 items-center justify-center">
            <Button
              disabled={currentCount >= MAX}
              size="xl"
              className="flex-1 items-center"
              onPress={pickMedia}
            >
              <ButtonText size="sm">Choose photos</ButtonText>
              <Icon as={Images} />
            </Button>

            <Button
              disabled={currentCount >= MAX}
              size="xl"
              variant="outline"
              className="flex-1 items-center"
              onPress={takeMedia}
            >
              <ButtonText size="sm">Take photos</ButtonText>
              <Icon as={Camera} className="text-primary" />
            </Button>
          </View>

          {currentCount >= MAX && (
            <Text className="text-center font-light">
              Maximum number of property photos is {MAX}
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
                style={{ maxWidth: width / 3, width: width / 3.2 }}
                className="h-36 px-2"
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

  const RenderItem = ({
    item,
    index,
  }: {
    item: UploadedFile;
    index: number;
  }) => {
    return (
      <ProfileImageTrigger
        image={photos || []}
        index={index}
        style={{ maxWidth: width / 3 }}
        className="h-36 flex-1 px-2"
      >
        <View className="w-full h-full p-1 bg-background-muted rounded-xl overflow-hidden items-center relative justify-center">
          <Image
            className="w-full h-full rounded-xl overflow-hidden"
            source={{
              uri: generateMediaUrlSingle(item.url),
              cacheKey: item.id,
            }}
            rounded
          />
          <Pressable
            onPress={() => {
              setSelected(item.id);
              setOpenEdit(true);
            }}
            className="self-end p-1.5 absolute top-1 right-1 rounded-full bg-black/50"
          >
            <Icon as={MoreHorizontal} className="text-primary" />
          </Pressable>
        </View>
      </ProfileImageTrigger>
    );
  };

  return (
    <BottomSheet
      title="Add photos"
      withHeader
      snapPoint="95%"
      visible={visible}
      onDismiss={onDismiss}
    >
      <View className="flex-1 py-4 pb-8 bg-background" onLayout={onLayout}>
        <ImageViewerProvider>
          <FlatList
            data={photos}
            numColumns={3}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={() =>
              previewFiles.length == 0 ? (
                <MiniEmptyState title="Pick or take photos" />
              ) : undefined
            }
            keyExtractor={(item) => item.id!}
            renderItem={RenderItem}
            ItemSeparatorComponent={() => <View className="h-4" />}
            keyboardShouldPersistTaps="handled"
          />
        </ImageViewerProvider>

        <View className="flex-row gap-6 px-4 mt-auto">
          {currentCount > 3 && (
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

      <OptionsBottomSheet
        isOpen={openEdit}
        onDismiss={() => setOpenEdit(false)}
        withBackground={false}
        onChange={(val) => {
          if (selected === undefined) return;
          if (val.value === "delete") deleteFile(selected);
        }}
        value={{ label: "Delete Photo", value: "delete" }}
        options={[{ label: "Delete Photo", value: "delete" }]}
      />
    </BottomSheet>
  );
}

export default withRenderVisible(ListingPhotosBottomSheet);
