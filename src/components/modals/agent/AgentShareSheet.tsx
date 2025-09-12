import React from "react";
import {
  TouchableOpacity,
  Linking,
  Share,
  Alert,
  ScrollView,
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
import QRCode from "react-native-qrcode-svg";
import { Icon, Text, View } from "@/components/ui";
import { Divider } from "@/components/ui/divider";
import logo from "@/assets/images/splash.png";
import BottomSheet from "@/components/shared/BottomSheet";

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
  const url = `https://topnotchcity.com/profile/${id}`;

  const handleShare = async (action: string) => {
    try {
      switch (action) {
        case "copy":
          await navigator.clipboard.writeText(url);
          Alert.alert("Copied", "Link copied to clipboard");
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
          Share.share({ message: url });
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
      snapPoint={["80%"]}
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

          <Divider />

          {/* QR Code Section */}
          <View className="items-center py-6">
            <Text className="text-sm  mb-2">Scan QR code to view Profile</Text>
            <View className="border-2 border-black">
              <QRCode
                value={url}
                size={240}
                //   backgroundColor="white"
                //   color="black"
                logo={logo}
                logoSize={40}
                logoBackgroundColor="transparent"
                //   linearGradient={["rgb(255,0,0)", "rgb(0,255,255)"]}
                //   enableLinearGradient
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
