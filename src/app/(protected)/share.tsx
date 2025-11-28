import { Pressable, TouchableOpacity, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, Text, View, Image } from "@/components/ui";
import { ChevronLeftIcon, Link, ShareIcon } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useState } from "react";
import logo from "@/assets/images/notification.png";
import Platforms from "@/constants/Plaforms";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { openAppModal } from "@/components/globals/AuthModals";

export default function ShareAppScreen() {
  const url = "https://topnotchcity.com";

  const gradients = [
    ["#4158D0", "#C850C0", "#FFCC70"],
    ["#36D1DC", "#5B86E5"],
    ["#FC466B", "#3F5EFB"],
    ["#00B09B", "#96C93D"],
    ["#f12711", "#f5af19"],
    ["#833ab4", "#fd1d1d", "#fcb045"],
  ];

  const [index, setIndex] = useState(0);
  const progress = useSharedValue(0);

  const handleBackgroundTap = () => {
    const nextIndex = (index + 1) % gradients.length;
    setIndex(nextIndex);
    progress.value = withTiming(progress.value === 0 ? 1 : 0, {
      duration: 700,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {};
  });

  const currentGradient = gradients[index] as any;

  return (
    <Pressable onPress={handleBackgroundTap} className="flex-1">
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <LinearGradient
          colors={currentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 w-full"
        >
          <View className="flex-1 justify-center gap-4">
            {/* Back button */}
            <View className="absolute top-0 left-4">
              <SafeAreaView edges={["top"]}>
                <Pressable
                  onPress={() => {
                    if (router.canGoBack()) router.back();
                    else router.push("/");
                  }}
                  className="py-1 flex-row items-center rounded-full bg-white p-1 pr-1.5"
                >
                  <Icon className="w-8 h-8 text-black" as={ChevronLeftIcon} />
                </Pressable>
              </SafeAreaView>
            </View>

            {/* Card */}
            <View className="mx-auto border-2 border-gray-100 bg-white w-[90%] rounded-3xl items-center py-10">
              <View className="flex items-center mb-6">
                <Image source={logo} className="w-16 h-16 rounded-xl" />
                <Text className="mt-3 text-2xl text-black font-bold">
                  Share TopNotchCity
                </Text>
                <Text className="mt-1 text-gray-500 text-sm">
                  Help someone discover their next property
                </Text>
              </View>

              <QRCode value={url} size={240} backgroundColor="white" />

              <View className="mt-4 flex-row gap-2 items-center">
                <Text className="text-lg text-black font-semibold">
                  topnotchcity.com
                </Text>
              </View>
            </View>

            <View className="flex-row gap-4 w-[90%] mx-auto mt-2">
              <TouchableOpacity
                onPress={async () => {
                  await Clipboard.setStringAsync(url);
                  ToastAndroid.show("Link copied to clipboard", 1500);

                  Platforms.isIOS() &&
                    showErrorAlert({
                      title: "Link copied",
                      alertType: "success",
                      duration: 1500,
                    });
                }}
                className="items-center flex-1 bg-white border border-gray-300 p-4 rounded-xl"
              >
                <Icon as={Link} className="w-7 h-7 text-black" />
                <Text className="mt-2 text-sm font-medium text-black text-center">
                  Copy link
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openAppModal({ visible: true })}
                className="items-center flex-1 bg-white border border-gray-300 p-4 rounded-xl"
              >
                <Icon as={ShareIcon} className="w-7 h-7 text-black" />
                <Text className="mt-2 text-sm font-medium text-black text-center">
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
