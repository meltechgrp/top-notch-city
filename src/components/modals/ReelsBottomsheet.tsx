import { TouchableOpacity, Linking, Share, Alert } from "react-native";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  Link as LinkIcon,
  Flag,
  Twitter,
  MoreHorizontal,
} from "lucide-react-native";
import BottomSheet from "../shared/BottomSheet";
import { Icon, Switch, Text, View } from "@/components/ui";
import { Divider } from "@/components/ui/divider";
import { openEnquiryModal } from "@/components/globals/AuthModals";
import { useStore } from "@/store";

interface ShareSheetProps {
  visible: boolean;
  onDismiss: () => void;
  id: string;
  propertyUrl: string;
  downloadUrl?: string;
}

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

export function ReelsShareSheet({
  visible,
  onDismiss,
  propertyUrl,
  downloadUrl,
  id,
}: ShareSheetProps) {
  const { muted, updateMuted } = useStore();
  const handleShare = async (action: string) => {
    try {
      switch (action) {
        case "copy":
          await navigator.clipboard.writeText(propertyUrl);
          Alert.alert("Copied", "Link copied to clipboard");
          break;
        case "facebook":
          Linking.openURL(
            `https://www.facebook.com/sharer/sharer.php?u=${propertyUrl}`
          );
          break;
        case "instagram":
          Linking.openURL(`instagram://share?text=${propertyUrl}`);
          break;
        case "whatsapp":
          Linking.openURL(`whatsapp://send?text=${propertyUrl}`);
          break;
        case "twitter":
          Linking.openURL(
            `https://twitter.com/intent/tweet?url=${propertyUrl}`
          );
          break;
        case "email":
          Linking.openURL(
            `mailto:?subject=Check this property&body=${propertyUrl}`
          );
          break;
        case "native":
          Share.share({ message: propertyUrl });
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(e);
    } finally {
      onDismiss();
    }
  };
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["70%"]}
      title="Share with"
      withHeader
      withScroll
    >
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
                <Icon as={opt.icon} className=" w-7 h-7" />
              </View>
              <Text className="mt-2 text-xs text-center ">{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Divider />
        <View className=" bg-background-muted p-4 py-4 mx-4 rounded-lg flex-row justify-between items-center">
          <Text>Mute Video</Text>
          <Switch value={muted} onValueChange={updateMuted} />
        </View>
        <Divider />
        {/* Bottom actions */}
        <View className=" bg-background-muted p-4 py-6 mx-4 rounded-lg gap-6">
          <TouchableOpacity
            onPress={() => openEnquiryModal({ visible: true, id })}
            className="flex-row items-center gap-3 "
          >
            <Icon as={Flag} />
            <Text className="text-base">Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}
