import config from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    uri: `${config.origin}${media.url}`,
    isImage: media.media_type == "IMAGE",
    id: media.id,
  };
};
export const generateMediaUrlSingle = (media: string) => {
  return `${config.origin}${media}`;
};

const SEARCH_HISTORY_KEY = "search_history";

export type SearchHistory = {
  country?: string;
  state?: string;
  city?: string;
};

export async function saveSearchToHistory(search: SearchHistory) {
  try {
    const historyStr = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    const history = historyStr ? JSON.parse(historyStr) : [];

    const existingIndex = history.findIndex(
      (item: any) =>
        item.city === search.city &&
        item.state === search.state &&
        item.country === search.country
    );

    if (existingIndex !== -1) history.splice(existingIndex, 1);
    history.unshift(search); // most recent first

    const trimmed = history.slice(0, 10); // keep last 10
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error("Failed to save search history:", err);
  }
}

export async function getSearchHistory() {
  try {
    const data = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load search history:", err);
    return [];
  }
}
