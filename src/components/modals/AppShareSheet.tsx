import React from "react";
import {
  TouchableOpacity,
  Linking,
  Share,
  Alert,
  ScrollView,
  ToastAndroid,
} from "react-native";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  Link as LinkIcon,
  Twitter,
  MoreHorizontal,
} from "lucide-react-native";
import { Icon, Text, View } from "@/components/ui";
import * as Clipboard from "expo-clipboard";
import BottomSheet from "@/components/shared/BottomSheet";
import Platforms from "@/constants/Plaforms";
import { showErrorAlert } from "@/components/custom/CustomNotification";

const SHARE_OPTIONS = [
  {
    label: "Copy App Link",
    icon: LinkIcon,
    color: "bg-blue-500",
    action: "copy",
  },
  {
    label: "Share on Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    action: "facebook",
  },
  {
    label: "Share on Instagram",
    icon: Instagram,
    color: "bg-pink-500",
    action: "instagram",
  },
  {
    label: "Send via WhatsApp",
    icon: MessageCircle,
    color: "bg-green-500",
    action: "whatsapp",
  },
  {
    label: "Share on Twitter",
    icon: Twitter,
    color: "bg-sky-500",
    action: "twitter",
  },
  {
    label: "Share via Email",
    icon: Mail,
    color: "bg-red-500",
    action: "email",
  },
  {
    label: "More Options",
    icon: MoreHorizontal,
    color: "bg-gray-500",
    action: "native",
  },
];

export function AppShareSheet({ visible, onDismiss }: AuthModalProps) {
  const url = `https://topnotchcity.com`;
  const message =
    `🏡 *Experience Real Estate the Smart Way*\n\n` +
    `Browse verified listings, stunning apartment reels, and detailed neighbourhood insights.\n\n` +
    `TopNotch City Estate—your gateway to smarter property decisions.\n\n` +
    `Download the app today.`;
  const handleShare = async (action: string) => {
    try {
      switch (action) {
        case "copy":
          await Clipboard.setStringAsync(url);
          ToastAndroid.show("Message copied to clipboard", 1500);
          Platforms.isIOS() &&
            showErrorAlert({
              title: "Message copied to clipboard",
              alertType: "success",
              duration: 1500,
            });
          break;
        case "facebook":
          Linking.openURL(
            `https://www.facebook.com/sharer/sharer.php?u=${url}`
          );
          break;
        case "instagram":
          Linking.openURL(`instagram://share?text=${url}`);
          break;
        case "whatsapp":
          Linking.openURL(`whatsapp://send?text=${url}`);
          break;
        case "twitter":
          Linking.openURL(`https://twitter.com/intent/tweet?url=${url}`);
          break;
        case "email":
          Linking.openURL(`mailto:?subject=Check this property&body=${url}`);
          break;
        case "native":
          Share.share({
            title: "Visit TopNotch City Estate",
            url,
            message: message,
          });
          break;
        default:
          break;
      }
    } catch (e) {
      console.log("Share error:", e);
    } finally {
      onDismiss?.();
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["40%"]}
      title="Share TopNotch City with Others"
      withHeader
      withScroll
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="gap-6 pt-4">
          <Text className="text-sm text-typography/80 mb-4">
            Invite friends and clients to explore premium property listings and
            apartment reels.
          </Text>
          <View className="flex-row flex-wrap justify-start gap-y-6">
            {SHARE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                onPress={() => handleShare(opt.action)}
                className="items-center w-1/4"
              >
                <View
                  className={`w-14 h-14 rounded-full ${opt.color} items-center justify-center`}
                >
                  <Icon as={opt.icon} className="w-7 h-7 text-white" />
                </View>
                <Text className="mt-2 text-xs text-center">{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
