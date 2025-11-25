import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { uniqueId } from "lodash-es";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { uploadToBucket } from "@/actions/bucket";
import { uploadWithFakeProgress } from "@/lib/utils";

type MediaType = "image" | "video" | "audio";

type UseMediaUploadOptions = {
  onSuccess: (media: Media[]) => void;
  onFiles: (media: Media[]) => void;
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
  const [progress, setProgress] = useState<number>(0);

  const processBeforeUpload = async (files: { url: string }[]) => {
    if (type === "audio") {
      return files.map((f) => f.url);
    }

    if (type === "image") {
      const compressed = await Promise.all(
        files.map(async (f) => {
          try {
            const context = ImageManipulator.manipulate(f.url);
            context.resize({ width: 1080 });

            const file = await context.renderAsync();
            const result = await file.saveAsync({
              compress: 0.5,
              format: SaveFormat.JPEG,
            });

            return result.uri;
          } catch (e) {
            console.log("Image compression error:", e);
            return f.url;
          }
        })
      );

      return compressed;
    }

    if (type === "video") {
      return files.map((f) => f.url);
    }

    return files.map((f) => f.url);
  };

  const handleUpload = async (urls: string[]) => {
    try {
      const payload = urls.map((url) => ({ url }));
      const result = await uploadWithFakeProgress(
        () =>
          uploadToBucket({
            data: payload,
            type,
            apply_watermark,
          }),
        (p) => setProgress(p)
      );
      onSuccess(result);
    } catch (error) {
      console.log(error);
      showErrorAlert({
        title: "Upload failed. Try again.",
        alertType: "warn",
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const processFiles = async (files: { url: string }[]) => {
    setLoading(true);

    const compressedurls = await processBeforeUpload(files);
    await handleUpload(compressedurls);
  };
  const pickMedia = async () => {
    if (type === "audio") {
      showErrorAlert({
        title: "Audio picking is not supported via system picker yet.",
        alertType: "warn",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === "image" ? ["images"] : ["videos"],
      selectionLimit: maxSelection,
      allowsMultipleSelection: type === "image",
      orderedSelection: true,
      quality: type === "video" ? 1 : undefined,
    });

    setLoading(true);

    if (!result.canceled) {
      const files = result.assets.map((a) => ({
        url: a.uri,
        id: uniqueId("media_"),
        media_type: type.toUpperCase() as Media["media_type"],
      })) as Media[];
      onFiles(files);
    } else {
      setLoading(false);
    }
  };

  const takeMedia = async () => {
    if (type === "audio") {
      showErrorAlert({
        title: "Audio recording not implemented in this hook.",
        alertType: "warn",
      });
      return;
    }

    const permitted = await ImagePicker.getCameraPermissionsAsync();
    if (permitted.status !== ImagePicker.PermissionStatus.GRANTED) {
      await ImagePicker.requestCameraPermissionsAsync();
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: type === "image" ? ["images"] : ["videos"],
      cameraType: ImagePicker.CameraType.back,
      quality: 1,
    });

    setLoading(true);
    if (!result.canceled) {
      const files = result.assets.map((a) => ({
        url: a.uri,
        id: uniqueId("media_"),
        media_type: type.toUpperCase() as Media["media_type"],
      })) as Media[];
      onFiles(files);
    } else {
      setLoading(false);
    }
  };
  return {
    loading,
    progress,
    pickMedia,
    takeMedia,
    processFiles,
    setLoading,
  };
}
