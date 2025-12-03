import * as React from "react";
import { useStore } from "@/store";
import { router } from "expo-router";
import { cn } from "@/lib/utils";
import TabView from "@/components/shared/TabView";
import {
  ImageBackground,
  Text,
  View,
  Pressable,
  Button,
  ButtonText,
} from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";
import SystemNavigationBar from "react-native-system-navigation-bar";

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { setIsOnboarded } = useStore();

  React.useEffect(() => {
    if (Platform.OS == "android") {
      SystemNavigationBar.setNavigationColor("translucent");
    }
  }, []);
  function skipHandler() {
    router.replace("/signin");
  }
  React.useEffect(() => {
    setIsOnboarded(true);
  }, []);
  return (
    <View className="flex-1 bg-background">
      <TabView activeTab={activeIndex} onTabSelected={setActiveIndex}>
        <PageOne
          key={1}
          setActiveIndex={setActiveIndex}
          activeIndex={activeIndex}
          skipHandler={skipHandler}
        />
        <PageTwo
          key={2}
          setActiveIndex={setActiveIndex}
          activeIndex={activeIndex}
          skipHandler={skipHandler}
        />
        <PageThree
          key={3}
          setActiveIndex={setActiveIndex}
          activeIndex={activeIndex}
          skipHandler={skipHandler}
        />
      </TabView>
    </View>
  );
}

function PageDots({
  activeIndex,
  length,
}: {
  activeIndex: number;
  length: number;
}) {
  return (
    <View className="flex-row items-center justify-center">
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          className={cn(
            "w-2 h-2 rounded-full mr-2",
            activeIndex === i ? "bg-white" : "bg-gray-500"
          )}
        />
      ))}
    </View>
  );
}

function PageOne({
  setActiveIndex,
  activeIndex,
  skipHandler,
}: {
  setActiveIndex: (index: number) => void;
  activeIndex: number;
  skipHandler: () => void;
}) {
  return (
    <ImageBackground
      source={require("@/assets/images/landing/home.png")}
      className="flex-1"
      imageStyle={{ resizeMode: "cover" }}
    >
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-black/20">
        <View className=" flex-1 mb-16 px-6">
          <View className="flex-1 items-end mt-4 ">
            <Pressable onPress={skipHandler}>
              <Text size="lg" className="text-white font-medium">
                Skip
              </Text>
            </Pressable>
          </View>
          <View className=" gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-4xl font-bold font-heading w-[60%] text-white">
                Find Your Dream{" "}
                <Text className="text-4xl text-[#FF4C00] font-bold font-heading">
                  Home
                </Text>
              </Text>
            </View>
            <View className="flex-row justify-between items-center gap-16">
              <View className=" w-[60%]">
                <Text className=" text-white text-base">
                  Explore thousands of properties for sale and rent
                </Text>
              </View>
            </View>
            <NextIcon
              setActiveIndex={setActiveIndex}
              activeIndex={activeIndex}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
function PageTwo({
  setActiveIndex,
  activeIndex,
  skipHandler,
}: {
  setActiveIndex: (index: number) => void;
  activeIndex: number;
  skipHandler: () => void;
}) {
  return (
    <ImageBackground
      source={require("@/assets/images/landing/direction.png")}
      className="flex-1"
      imageStyle={{ resizeMode: "cover" }}
    >
      <SafeAreaView edges={["top"]} className="flex-1 bg-black/20">
        <View className=" flex-1 mb-16 px-6">
          <View className="flex-1 items-end mt-4 ">
            <Pressable onPress={skipHandler}>
              <Text size="lg" className="text-white font-medium">
                Skip
              </Text>
            </Pressable>
          </View>
          <View className=" gap-2">
            <View className="flex-row justify-between items-center">
              <View className="">
                <View className=" flex-row gap-1">
                  <Text className="text-4xl font-bold text-white">Which </Text>
                  <Text className="text-4xl font-bold text-primary">
                    location{" "}
                  </Text>
                  <Text className="text-4xl font-bold text-white">are </Text>
                </View>
                <Text className="text-4xl font-bold text-white">
                  you interested in
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center gap-16">
              <View className=" w-[75%]">
                <Text className=" text-white text-sm">
                  Filter by location, price, or property type to find exactly
                  what you’re looking for.
                </Text>
              </View>
            </View>
            <NextIcon
              setActiveIndex={setActiveIndex}
              activeIndex={activeIndex}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
function PageThree({
  setActiveIndex,
  activeIndex,
  skipHandler,
}: {
  setActiveIndex: (index: number) => void;
  activeIndex: number;
  skipHandler: () => void;
}) {
  return (
    <ImageBackground
      source={require("@/assets/images/landing/agent.png")}
      className="flex-1"
      imageStyle={{ resizeMode: "cover" }}
    >
      <SafeAreaView edges={["top"]} className="flex-1 bg-black/40">
        <View className="flex-1 mb-16 px-6">
          <View className="flex-1 items-end "></View>
          <View className=" gap-4 flex-row mb-2">
            <View className="flex-1">
              <Text className="text-4xl  font-bold w-[70%] text-white">
                Connect with Trusted{" "}
                <Text className="text-[#FF4C00] text-4xl  font-bold">
                  Agents{" "}
                </Text>
              </Text>
            </View>
          </View>
          <View className="mb-6  w-[70%]">
            <Text className=" text-white text-sm">
              Get personalized assistance from verified and experienced real
              estate professionals.
            </Text>
          </View>
          <Button
            onPress={skipHandler}
            size="xl"
            className="rounded-xl border-white"
          >
            <ButtonText size="lg" className=" text-white font-semibold">
              Get Started
            </ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function NextIcon({
  activeIndex,
  setActiveIndex,
  disable,
}: {
  activeIndex: number;
  setActiveIndex: (val: number) => void;
  disable?: boolean;
}) {
  return (
    <View className="relative justify-center items-center">
      <Pressable
        onPress={() => {
          !disable && setActiveIndex(activeIndex + 1);
        }}
        className=" justify-center items-center"
      >
        <PageDots length={3} activeIndex={activeIndex} />
      </Pressable>
    </View>
  );
}
