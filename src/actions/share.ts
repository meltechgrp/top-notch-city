import config from "@/config";
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

📱 View in app: ${config.websiteUrl}/property/${property.link}

Download the app: ${config.websiteUrl} 
`;

    const result = await Share.share(
      {
        title: property.title,
        message,
        url: `${config.websiteUrl}/property/${property.link}`,
      },
      {
        dialogTitle: property.title,
      }
    );

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
