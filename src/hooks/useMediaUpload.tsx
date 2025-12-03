import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { uniqueId } from "lodash-es";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { uploadToBucket } from "@/actions/bucket";
import { uploadWithFakeProgress } from "@/lib/utils";

type MediaType = "image" | "video" | "audio";

type UseMediaUploadOptions = {
  onSuccess: (media: UploadedFile[]) => void;
  onFiles: (media: UploadedFile[]) => void;
  type: MediaType;
  maxSelection?: number;
  apply_watermark?: boolean;
};

export function useMediaUpload({
  onSuccess,
  type,
  maxSelection,
  onFiles,
  apply_watermark = false,
}: UseMediaUploadOptions) {
  const [loading, setLoading] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const updateProgress = (id: string, value: number) => {
    setProgressMap((prev) => ({ ...prev, [id]: value }));
  };

  const processBeforeUpload = async (files: { url: string }[]) => {
    if (type === "audio") return files.map((f) => f.url);

    if (type === "image") {
      const compressed = await Promise.all(
        files.map(async (f) => {
          try {
            const ctx = ImageManipulator.manipulate(f.url);
            ctx.resize({ width: 1080 });

            const file = await ctx.renderAsync();
            const output = await file.saveAsync({
              compress: 0.7,
              format: SaveFormat.JPEG,
            });
            return output.uri;
          } catch {
            return f.url;
          }
        })
      );
      return compressed;
    }

    return files.map((f) => f.url);
  };

  const handleUpload = async (media: UploadedFile[]) => {
    try {
      const results = await Promise.all(
        media.map(
          (item) =>
            new Promise(async (resolve, reject) => {
              try {
                const uploaded = await uploadWithFakeProgress(
                  () =>
                    uploadToBucket({
                      data: [{ url: item.url }],
                      type,
                      apply_watermark,
                    }),
                  (p) => updateProgress(item.id, p),
                  type == "video"
                );

                resolve(uploaded[0]);
              } catch (e) {
                reject(e);
              }
            })
        )
      );
      const uploaded = media.map((m, index) => ({
        ...m,
        // @ts-ignore
        id: results[index].id,
        // @ts-ignore
        url: results[index].url,
        loading: false,
        progress: 100,
      }));

      onSuccess(uploaded);
    } catch (error) {
      showErrorAlert({
        title: "Upload failed. Try again.",
        alertType: "warn",
      });
    } finally {
      setLoading(false);
      setProgressMap({});
    }
  };

  const processFiles = async (files: UploadedFile[]) => {
    setLoading(true);

    const urls = await processBeforeUpload(files);
    const updated = files.map((f, i) => ({ ...f, url: urls[i] }));

    updated.forEach((f) => updateProgress(f.id, 0));

    await handleUpload(updated);
  };

  const pickMedia = async () => {
    if (type === "audio") {
      showErrorAlert({
        title: "Audio picking is not supported.",
        alertType: "warn",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === "image" ? ["images"] : ["videos"],
      selectionLimit: maxSelection,
      allowsMultipleSelection: true,
      orderedSelection: true,
      quality: type === "video" ? 1 : undefined,
    });

    if (result.canceled) return;

    setLoading(true);

    const files = result.assets.map((a) => ({
      url: a.uri,
      id: uniqueId("media_"),
      media_type: type.toUpperCase() as Media["media_type"],
      loading: true,
      progress: 0,
    })) as UploadedFile[];

    onFiles(files);
  };

  const takeMedia = async () => {
    if (type === "audio") {
      showErrorAlert({
        title: "Audio recording not supported.",
        alertType: "warn",
      });
      return;
    }

    const permitted = await ImagePicker.getCameraPermissionsAsync();
    if (!permitted.granted) await ImagePicker.requestCameraPermissionsAsync();

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: type === "image" ? ["images"] : ["videos"],
      cameraType: ImagePicker.CameraType.back,
      quality: 1,
    });

    if (result.canceled) return;

    setLoading(true);

    const files = result.assets.map((a) => ({
      url: a.uri,
      id: uniqueId("media_"),
      media_type: type.toUpperCase() as Media["media_type"],
      loading: true,
      progress: 0,
    })) as UploadedFile[];

    onFiles(files);
  };

  return {
    loading,
    progressMap,
    pickMedia,
    takeMedia,
    processFiles,
    setLoading,
  };
}
