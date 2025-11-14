import config from "@/config";
import { Share } from "react-native";

export async function onInvite(property: { title: string; link: string }) {
  try {
    const message = `
🏡 Check out this property on Top-Notch City Estates!

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
      } else {
      }
    } else if (result.action === Share.dismissedAction) {
    }
  } catch (error: any) {
    alert(error.message);
  }
}
