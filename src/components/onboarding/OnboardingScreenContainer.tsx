import ScreenContianer from "@/components/shared/ScreenContianer";
import Platforms from "@/constants/Plaforms";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { Box, Image, ImageBackground, Text } from "../ui";
import { ChevronLeft } from "lucide-react-native";
type Props = {
  children: React.ReactNode;
  allowBack?: boolean;
  withScroll?: boolean;
  edges?: Array<"top" | "bottom" | "left" | "right">;
  onBack?: () => void;
  showHeader?: boolean;
  skip?: boolean;
};

export default function OnboardingScreenContainer(props: Props) {
  const {
    children,
    allowBack = true,
    withScroll = true,
    showHeader = true,
    edges = ["top"],
    skip = false,
  } = props;

  function _onBack() {
    if (props.onBack) {
      props.onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push({ pathname: "/home" });
    }
  }

  return (
    <Box className="flex-1 mx-auto w-full">
      <ImageBackground
        source={require("@/assets/images/landing/home.png")}
        className="flex-1 bg-cover w-full md:max-w-[1400px]"
      >
        <View className="flex-1 bg-black/30">
          {/* <ScreenContianer
            edges={edges}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platforms.isIOS() ? 20 : 0}
          > */}
          <View className="py-6 flex-1 ">
            <View className="flex-row mt-2 items-center pb-4 px-6">
              {allowBack && (
                <Pressable
                  onPress={_onBack}
                  className=" bg-outline-100/60 p-1.5 rounded-full"
                >
                  <ChevronLeft strokeWidth={2} color={"#fff"} />
                </Pressable>
              )}
              {showHeader && (
                <View className="flex-1 gap-2 justify-center flex-row items-center ">
                  <View className="w-12 h-12">
                    <Image
                      source={require("@/assets/images/splash.png")}
                      alt="Logo"
                    />
                  </View>
                </View>
              )}
              {skip && (
                <Pressable
                  onPress={() => router.push("/home")}
                  className="ml-auto"
                >
                  <Text className="text-lg">Skip</Text>
                </Pressable>
              )}
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentInsetAdjustmentBehavior="automatic"
              automaticallyAdjustsScrollIndicatorInsets={true}
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical
              contentInset={{ bottom: 0 }}
              scrollIndicatorInsets={{ bottom: 0 }}
              automaticallyAdjustKeyboardInsets={true}
              contentContainerClassName="pt-2 px-6"
            >
              {children}
            </ScrollView>
          </View>
          {/* </ScreenContianer> */}
        </View>
      </ImageBackground>
    </Box>
  );
}
