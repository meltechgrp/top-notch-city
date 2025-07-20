import withRenderVisible from "@/components/shared/withRenderOpen";
import { FlatList, ImageBackground, Pressable, View } from "react-native";
import BottomSheet from "../../shared/BottomSheet";
import { Button, ButtonText, Icon, Text } from "../../ui";
import { cn, showSnackbar } from "@/lib/utils";
import { Camera, Images, MoreHorizontal, Video } from "lucide-react-native";
import { MiniEmptyState } from "../../shared/MiniEmptyState";
import { useMemo, useState } from "react";
import { useLayout } from "@react-native-community/hooks";
import OptionsBottomSheet from "../../shared/OptionsBottomSheet";
import FullHeightLoaderWrapper from "../../loaders/FullHeightLoaderWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { usePropertyDataMutations } from "@/tanstack/mutations/usePropertyDataMutations";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { VideoScreen } from "@/components/listing/ListingVideosBottomSheet";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  property: Property;
  previousLenght?: number;
  type: "image" | "video";
};

const Max_Photos_lenght = 16;
const Max_Videos_lenght = 3;

function PropertyMediaBottomSheet(props: Props) {
  const { visible, onDismiss, type, previousLenght = 0, property } = props;
  const [photos, setPhotos] = useState<{ uri: string; id: string }[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<string | undefined>();
  const { width, onLayout } = useLayout();
  const { mutateAsync, isPending } =
    usePropertyDataMutations().updatePropertyMediaMutation;
  const max = type == "image" ? Max_Photos_lenght : Max_Videos_lenght;
  const currentCount = useMemo(() => {
    return previousLenght + photos?.length;
  }, [photos, previousLenght, type, max]);
  const { loading, pickMedia, takeMedia } = useMediaUpload({
    type: type,
    onSuccess: (media) => setPhotos([...photos, ...media]),
    maxSelection: currentCount,
  });

  async function handleUpload() {
    await mutateAsync(
      {
        propertyId: property.id,
        data: photos,
        type: type,
      },
      {
        onSuccess: () => {
          showErrorAlert({
            title: "Property updated successfully",
            alertType: "success",
          });
          setPhotos([]);
          onDismiss();
        },
        onError: (err) => {
          showErrorAlert({
            title: "Failed to update property",
            alertType: "error",
          });
        },
      }
    );
  }
  const ListHeader = useMemo(
    () => (
      <View className="flex-1 gap-2  bg-background-muted rounded-xl py-6 mb-3">
        <View className=" flex-row px-4 gap-5 items-center justify-center">
          <Button
            disabled={currentCount >= max}
            size="xl"
            className="flex-1"
            isDisabled={currentCount >= max}
            onPress={pickMedia}
          >
            <ButtonText numberOfLines={1} size="md">
              Choose {type == "image" ? "photos" : "videos"}
            </ButtonText>
            {type == "image" ? <Icon as={Images} /> : <Icon as={Video} />}
          </Button>
          <Button
            disabled={currentCount >= max}
            size="xl"
            className="flex-1"
            isDisabled={currentCount >= max}
            onPress={takeMedia}
            variant="outline"
          >
            <ButtonText size="md" numberOfLines={1}>
              Take {type == "image" ? "photos" : "videos"}
            </ButtonText>
            <Icon as={Camera} className="text-primary" />
          </Button>
        </View>
        <Text className=" text-sm font-light text-center">
          {currentCount >= max
            ? `You have reached you limit. Max is ${type == "image" ? 15 : 3}`
            : `Pick or take new ${type == "image" ? "photos" : "videos"} to upload`}
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
      style={{ maxWidth: type == "image" ? width / 4 : width / 2 }}
      className={cn("flex-1 h-24 px-2")}
    >
      {type == "image" ? (
        <ImageBackground
          alt="images"
          className={cn("w-full h-full flex-1 p-1 rounded-xl overflow-hidden")}
          source={{ uri: item.uri }}
        >
          <View className=" flex-1 justify-between">
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
        </ImageBackground>
      ) : (
        <VideoScreen
          index={index}
          width={width}
          uri={item.uri}
          setSelected={(val) => setSelected(item.id)}
          setOpenEdit={setOpenEdit}
        />
      )}
    </Pressable>
  );
  return (
    <BottomSheet
      title={
        type == "image"
          ? "Add photos to your property"
          : "Add videos to your property"
      }
      withHeader={true}
      withBackButton={false}
      snapPoint={"90%"}
      visible={visible}
      onDismiss={() => {
        setPhotos([]);
        onDismiss();
      }}
    >
      <View
        onLayout={onLayout}
        className="flex-1 gap-2 py-4 pb-8 bg-background"
      >
        <SafeAreaView edges={["bottom"]} className={"flex-1"}>
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
          {photos?.length > 0 && (
            <View className=" px-4">
              <Button
                disabled={isPending}
                className="h-12"
                onPress={handleUpload}
              >
                {isPending && <SpinningLoader />}
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
        value={{ label: "Set", value: "delete" }}
        options={[
          {
            label: type == "image" ? "Delete Photo" : "Delete video",
            value: "delete",
          },
        ]}
      />
    </BottomSheet>
  );
}

export default withRenderVisible(PropertyMediaBottomSheet);
