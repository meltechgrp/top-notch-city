import config from "@/config";
import { getActiveToken } from "@/lib/secureStore";
import axios from "axios";

export type UploadedFile = {
  url: string;
  id?: string;
};

export async function uploadToBucket({
  data,
  type,
}: {
  data: UploadedFile[];
  type: "image" | "video" | "audio";
}) {
  try {
    const token = await getActiveToken();
    console.log(token, data);
    if (!token) throw new Error("Authentication token missing");

    const formData = new FormData();

    data.forEach((item, index) => {
      const isImage = type === "image";
      const fileName = isImage ? `image_${index}.jpg` : `video_${index}.mp4`;
      const mimeType = isImage ? "image/jpeg" : "video/mp4";

      formData.append("files", {
        uri: item.url,
        name: fileName,
        type: mimeType,
      } as any);
    });

    const url = `${config.origin}/api/bucket/upload/`;

    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    return response.data?.files?.map((f: any) => ({
      id: f.id,
      url: f.file_url,
      mediaType: f.file_type,
    })) as Media[];
  } catch (error: any) {
    throw Error(error?.message);
  }
}
