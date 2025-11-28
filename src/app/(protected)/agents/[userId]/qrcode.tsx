import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Image,
  Pressable,
} from "@/components/ui";
import QRCode from "react-native-qrcode-svg";
import { Icon, Text, View } from "@/components/ui";
import { ToastAndroid, TouchableOpacity } from "react-native";
import { Link, ShareIcon } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";
import { fullName } from "@/lib/utils";
import { openAgentModal } from "@/components/globals/AuthModals";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import logo from "@/assets/images/notification.png";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "lucide-react-native";
import Platforms from "@/constants/Plaforms";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { getImageUrl } from "@/lib/api";

export default function QrCodeScreen() {
  const { userId } = useLocalSearchParams() as { userId: string };

  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const url = `https://topnotchcity.com/agents/${data?.slug}`;
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
          style={{ flex: 1 }}
          className="flex-1 w-full"
        >
          <View className="flex-1 w-full justify-center gap-4">
            <View className=" absolute top-0 left-4">
              <SafeAreaView edges={["top"]}>
                <Pressable
                  onPress={() => {
                    if (router.canGoBack()) router.back();
                    else router.push("/");
                  }}
                  className="py-1 flex-row items-center rounded-full bg-white p-1 pr-1.5"
                >
                  <Icon className=" w-8 h-8 text-black" as={ChevronLeftIcon} />
                </Pressable>
              </SafeAreaView>
            </View>
            <View className="border-2 relative mx-auto border-gray-100 bg-white w-[90%] rounded-3xl items-center justify-center py-8">
              <View className=" -mt-20 border-4 border-white rounded-full mb-2">
                <Avatar className="w-28 h-28">
                  <AvatarFallbackText>{fullName(data)}</AvatarFallbackText>
                  <AvatarImage
                    className="rounded-full"
                    source={getImageUrl(data?.profile_image)}
                  />
                </Avatar>
              </View>
              <View className="mb-6">
                <Text className=" text-2xl text-black font-bold">
                  {fullName(data)}
                </Text>
              </View>
              <QRCode
                value={url}
                size={240}
                backgroundColor="white"
                // color={theme == "dark" ? "white" : "black"}
              />
              <View className="mt-4 flex-row gap-2 items-center">
                <View className="w-8 h-8 rounded-full">
                  <Image source={logo} rounded />
                </View>
                <Text className=" text-lg text-black font-bold">
                  Top-Notch City
                </Text>
              </View>
            </View>
            <View className="flex-row gap-4 w-[90%] mx-auto">
              <TouchableOpacity
                onPress={async () => {
                  await Clipboard.setStringAsync(url);
                  ToastAndroid.show("Message copied to clipboard", 1500);
                  Platforms.isIOS() &&
                    showErrorAlert({
                      title: "Link copied to clipboard",
                      alertType: "success",
                      duration: 1500,
                    });
                }}
                className="items-center flex-1 bg-white border border-gray-300 p-4 rounded-xl"
              >
                <View>
                  <Icon as={Link} className="w-7 h-7 text-black" />
                </View>
                <Text className="mt-2 text-sm font-medium text-black text-center">
                  Copy link
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openAgentModal({ visible: true, id: userId })}
                className="items-center flex-1 bg-white border border-gray-300 p-4 rounded-xl"
              >
                <View>
                  <Icon as={ShareIcon} className="w-7 h-7 text-black" />
                </View>
                <Text className="mt-2 text-sm font-medium text-black text-center">
                  Share link
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
