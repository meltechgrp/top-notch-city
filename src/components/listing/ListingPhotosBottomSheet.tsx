import withRenderVisible from "@/components/shared/withRenderOpen";
import { FlatList, ImageBackground, Pressable, View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Button, ButtonText, Icon, Text } from "../ui";
import { cn } from "@/lib/utils";
import { Camera, Images, MoreHorizontal } from "lucide-react-native";
import { MiniEmptyState } from "../shared/MiniEmptyState";
import { useMemo, useState } from "react";
import { useLayout } from "@react-native-community/hooks";
import OptionsBottomSheet from "../shared/OptionsBottomSheet";
import FullHeightLoaderWrapper from "../loaders/FullHeightLoaderWrapper";
import { useMediaUpload } from "@/hooks/useMediaUpload";

const MAX = 15;

type Props = {
  visible: boolean;
  onDismiss: () => void;
  deleteFile: (id: number) => void;
  deleteAllFile: () => void;
  onUpdate: (data: UploadedFile[]) => void;
  photos?: UploadedFile[];
  multiple?: boolean;
  withDescription?: boolean;
};
function ListingPhotosBottomSheet(props: Props) {
  const { visible, onDismiss, onUpdate, deleteFile, photos, deleteAllFile } =
    props;
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<number | undefined>();
  const { width, onLayout } = useLayout();
  const currentCount = useMemo(() => {
    return photos?.length || 0;
  }, [photos]);

  // const { loading, pickMedia, takeMedia } = useMediaUpload({
  //   type: "image",
  //   onSuccess: () => {},
  //   maxSelection: 16 - currentCount,
  // });

  const ListHeader = useMemo(
    () => (
      <View className="flex-1 gap-2  bg-background-muted rounded-xl py-6 mb-3">
        <View className=" flex-row flex-1 px-4 gap-5 items-center justify-center">
          <Button
            disabled={currentCount >= MAX}
            isDisabled={currentCount >= MAX}
            size="xl"
            className="flex-1 items-center"
            // onPress={pickMedia}
          >
            <ButtonText size="sm">Choose photos</ButtonText>
            <Icon as={Images} />
          </Button>
          <Button
            disabled={currentCount >= MAX}
            isDisabled={currentCount >= MAX}
            size="xl"
            className="flex-1  items-center"
            // onPress={takeMedia}
            variant="outline"
          >
            <ButtonText size="sm">Take photos</ButtonText>
            <Icon as={Camera} className="text-primary" />
          </Button>
        </View>
        {currentCount >= MAX && (
          <Text className=" font-light text-center">
            Maximum number of property photos is 15
          </Text>
        )}
      </View>
    ),
    []
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
      className={cn("flex-1 h-24 px-2")}
    >
      <ImageBackground
        alt="images"
        className={cn("w-full h-full flex-1 p-1 rounded-xl overflow-hidden")}
        source={{ uri: item.uri, cache: "force-cache" }}
        resizeMode="cover"
      >
        <View className=" flex-1 justify-between">
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
      </ImageBackground>
    </Pressable>
  );
  return (
    <BottomSheet
      title="Add photos to your property"
      withHeader={true}
      withBackButton={false}
      snapPoint={"90%"}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View
        onLayout={onLayout}
        className="flex-1 gap-2 py-4 pb-8 bg-background"
      >
        <FullHeightLoaderWrapper loading={false}>
          <FlatList
            data={photos}
            numColumns={4}
            contentContainerClassName=""
            keyExtractor={(item) => item.id!}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={() => (
              <MiniEmptyState title="Pick or take photos to your property" />
            )}
            ItemSeparatorComponent={() => <View className=" h-4" />}
            renderItem={RenderItem}
            keyboardShouldPersistTaps="handled"
          />
        </FullHeightLoaderWrapper>
        <View className=" flex-row gap-6 px-4 mt-auto">
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
          if (!selected) return;
          if (val.value == "delete") return deleteFile(selected);
        }}
        value={{ label: "Set", value: "delete" }}
        options={[
          {
            label: "Delete Photo",
            value: "delete",
          },
        ]}
      />
    </BottomSheet>
  );
}

export default withRenderVisible(ListingPhotosBottomSheet);
