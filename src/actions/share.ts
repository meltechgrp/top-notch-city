import { generateMediaUrl } from "@/lib/api";
import { Share } from "react-native";

export async function onInvite(property: {
  title: string;
  imageUrl: string;
  link: string;
}) {
  try {
    const message = `
🏡 Check out this property on Top-Notch City Estates!

${property.title}

📱 View in app: topnotchcity://property/${encodeURIComponent(property.link)}

🌐 View online: ${property.link}

🖼️ Image: ${property.imageUrl}

Download the app: https://topnotchcity.com/app
`;

    const result = await Share.share({
      message,
      url: generateMediaUrl({
        url: property.imageUrl,
        id: "",
        media_type: "IMAGE",
      }).uri, // Helps with preview on some platforms
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    alert(error.message);
  }
}
