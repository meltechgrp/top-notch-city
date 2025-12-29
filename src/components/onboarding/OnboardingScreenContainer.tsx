import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { Box, Image, ImageBackground, Text } from "../ui";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
          <SafeAreaView edges={edges} style={{ flex: 1 }}>
            <View className="py-6 flex-1 relative ">
              <View className="flex-row  items-center pb-4 px-6">
                {allowBack && (
                  <Pressable
                    onPress={_onBack}
                    className=" bg-outline-100/60 p-1.5 rounded-full"
                  >
                    <ChevronLeft strokeWidth={2} color={"#fff"} />
                  </Pressable>
                )}
                {showHeader && (
                  <View className=" absolute left-1/2 -translate-x-1/2 -top-2 w-48 h-10 ">
                    <Image
                      source={require("@/assets/images/logo.png")}
                      alt="Logo"
                      contentFit="contain"
                    />
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
          </SafeAreaView>
        </View>
      </ImageBackground>
    </Box>
  );
}
