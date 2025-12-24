import config from "@/config";
import { profileDefault } from "@/store";

export const getImageUrl = (url?: string | null) => {
  if (url)
    return {
      uri: `${config.origin}${url}`,
    };
  return profileDefault;
};
export const generateMediaUrl = (media: Media) => {
  return {
    uri: `${config.origin}${media?.url}`,
    isImage: media?.mediaType == "IMAGE",
    id: media?.id,
  };
};
export const generateMediaUrlSingle = (media: string) => {
  return `${config.origin}${media}`;
};
