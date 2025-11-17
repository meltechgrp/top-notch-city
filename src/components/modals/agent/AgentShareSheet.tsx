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
  { label: "Copy link", icon: LinkIcon, color: "bg-blue-500", action: "copy" },
  {
    label: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    action: "facebook",
  },
  {
    label: "Instagram",
    icon: Instagram,
    color: "bg-pink-500",
    action: "instagram",
  },
  {
    label: "WhatsApp",
    icon: MessageCircle,
    color: "bg-green-500",
    action: "whatsapp",
  },
  { label: "Twitter", icon: Twitter, color: "bg-sky-500", action: "twitter" },
  { label: "Email", icon: Mail, color: "bg-red-500", action: "email" },
  {
    label: "More",
    icon: MoreHorizontal,
    color: "bg-gray-500",
    action: "native",
  },
];

export function AgentShareSheet({ visible, onDismiss, id }: AuthModalProps) {
  const url = `https://topnotchcity.com/agents/${id}`;
  const message =
    `📣 *Check out my profile on TopNotch City Estate!*\n\n` +
    `Looking for your dream apartment or real estate deals? View my listings and let's get started.\n\n` +
    `👉 Tap here to view my profile: ${url}\n\n` +
    `Download the app for the best experience and updates.`;
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
            title: "Visit My Profile on TopNotch City Estate",
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
      title="Share Property"
      withHeader
      withScroll
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="gap-6 pt-4">
          {/* Share Grid */}
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
