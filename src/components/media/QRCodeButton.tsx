import IconButton from "@/components/media/IconButton";
import { Icon, Image, Pressable, Text, View } from "@/components/ui";
import {
  composeFullAddress,
  formatMoney,
  formatNumberCompact,
  fullName,
  generateTitle,
} from "@/lib/utils";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { generateMediaUrlSingle } from "@/lib/api";
import { Dot, Heart, Home, House, MapPin, Users } from "lucide-react-native";

interface QRCodeButton {
  handleOpenQRCode: () => void;
  bottom: number;
  qrCodeDetected: string;
  preview: {
    type: "agent" | "property";
    data: any;
  } | null;
}

export default function QRCodeButton({
  handleOpenQRCode,
  bottom,
  preview,
  qrCodeDetected,
}: QRCodeButton) {
  const translateY = useSharedValue(60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (qrCodeDetected) {
      translateY.value = withSpring(0, {
        damping: 14,
        stiffness: 120,
      });
      opacity.value = withTiming(1, { duration: 180 });
    } else {
      translateY.value = withTiming(60, { duration: 150 });
      opacity.value = withTiming(0, { duration: 120 });
    }
  }, [qrCodeDetected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (qrCodeDetected) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [qrCodeDetected]);
  return (
    <Animated.View
      style={[
        {
          bottom: bottom + 220,
        },
        animatedStyle,
      ]}
      className="absolute flex-row justify-center w-full z-20"
    >
      {preview && preview.data ? (
        <Pressable
          onPress={handleOpenQRCode}
          className="p-3 w-80 bg-background-muted rounded-xl flex-row gap-3 border border-outline-100"
        >
          <View className="w-24 h-24 rounded-xl">
            <Image
              source={{
                uri: generateMediaUrlSingle(
                  preview.type === "agent"
                    ? preview.data.profile_image
                    : preview.data.media[0].url
                ),
              }}
              rounded
            />
          </View>

          <View className="flex-1">
            <Text className="font-bold text-lg">
              {preview.type === "agent"
                ? fullName(preview.data)
                : formatMoney(
                    preview.data.price,
                    preview.data?.currency?.code || "NGN",
                    0
                  )}
            </Text>
            {preview.type === "agent" && (
              <View className="flex-row gap-2 my-1 items-center">
                <View className="gap-1 items-center flex-row">
                  <Icon as={Users} className="w-5 h-5 text-success-100" />
                  <Text className="text-sm font-medium">
                    {formatNumberCompact(preview.data?.followers_count || 0)}
                  </Text>
                </View>
                <Icon as={Dot} className="w-3 h-3" />
                <View className="gap-1 items-center flex-row">
                  <Icon as={House} className="w-5 h-5 text-info-100" />
                  <Text className="text-sm font-medium">
                    {formatNumberCompact(preview.data?.total_properties || 0)}
                  </Text>
                </View>
                <Icon as={Dot} className="w-3 h-3" />
                <View className="gap-1 items-center flex-row">
                  <Icon
                    as={Heart}
                    className="w-5 h-5 text-primary fill-primary"
                  />
                  <Text className="text-sm font-medium">
                    {formatNumberCompact(preview.data?.likes_count || 0)}
                  </Text>
                </View>
              </View>
            )}
            {preview.type === "property" && (
              <View>
                <View className=" flex-row gap-1 items-center">
                  <Icon size="sm" as={MapPin} className="text-primary" />
                  <Text numberOfLines={1} className="text-white flex-1 text-xs">
                    {composeFullAddress(preview.data.address)}
                  </Text>
                </View>
                <View className="flex-row gap-1 items-center mt-1">
                  <Icon as={Home} size="sm" className="text-primary" />
                  <Text className=" text-sm">
                    {generateTitle(preview.data.title)}
                  </Text>
                </View>
              </View>
            )}
            <Text className="text-xs mt-auto">Tap to view in app</Text>
          </View>
        </Pressable>
      ) : (
        <Pressable
          onPress={handleOpenQRCode}
          className="w-60 h-12 border border-primary rounded-full bg-background-muted p-2 flex-row gap-2 items-center"
        >
          <IconButton
            className="rounded-full border border-outline-100 p-1"
            iosName="qrcode"
            androidName="qr-code"
          />
          <Text numberOfLines={1} className="text-sm font-bold">
            Open in browser
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
