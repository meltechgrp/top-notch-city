import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, View } from "react-native";
import { Heading, Icon, Text, useResolvedTheme } from "@/components/ui";
import {
  Bot,
  HelpCircle,
  House,
  SendHorizonal,
  UserSearch,
  X,
} from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import { router } from "expo-router";
import {
  openAccessModal,
  openEnquiryModal,
} from "@/components/globals/AuthModals";
import { useMe } from "@/hooks/useMe";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
const h = Dimensions.get("screen").height;

export default function Start() {
  const { me } = useMe();
  const theme = useResolvedTheme();
  return (
    <>
      <LinearGradient
        colors={
          theme == "dark" ? ["#161819", "#1b1b1f"] : ["#d6d6d7", "#d3d3d4"]
        }
        locations={[0.2, 0.4]}
        style={{
          flex: 1,
          height: h,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 24,
          paddingTop: 30,
        }}
      >
        <View className=" flex-1 relative rounded-t-3xl">
          <View className="mt-12 gap-3">
            <Heading className=" text-3xl text-typography/80">
              Hi {me?.first_name}
            </Heading>
            <Heading className=" text-3xl">How can we help?</Heading>
          </View>
          <AnimatedPressable
            onPress={() => {
              router.dismiss();
              if (!me) {
                return openAccessModal({ visible: true });
              }
              router.push("/staffs");
            }}
            className=" mt-6 px-6 py-6 flex-row shadow justify-between items-center bg-background-muted rounded-3xl"
          >
            <View>
              <Text size="xl" className=" font-heading">
                Chat with us
              </Text>
              <Text size="lg" className="text-typography/70">
                We reply in few minutes
              </Text>
            </View>
            <Icon className="text-primary" as={SendHorizonal} />
          </AnimatedPressable>
          <View className=" mt-6 px-6 shadow py-6 gap-4 bg-background-muted rounded-3xl">
            <AnimatedPressable
              onPress={() => {
                router.dismiss();
                router.push("/agents");
              }}
              className="flex-row justify-between items-center"
            >
              <Text size="xl" className=" font-heading">
                Find Agents
              </Text>
              <Icon className="text-primary" as={UserSearch} />
            </AnimatedPressable>
            <Divider />
            <AnimatedPressable
              onPress={() => {
                router.dismiss();
                router.push({
                  pathname: "/explore",
                  params: {
                    list: "true",
                  },
                });
              }}
              className="flex-row justify-between items-center"
            >
              <Text size="xl" className=" font-heading">
                Explore Properties
              </Text>
              <Icon className="text-primary" as={House} />
            </AnimatedPressable>
          </View>
          <View className=" mt-6 px-6 shadow py-6 gap-4 bg-background-muted rounded-3xl">
            <AnimatedPressable
              onPress={() => {
                router.push("/support/contact");
              }}
              className="flex-row justify-between items-center"
            >
              <Text size="xl" className=" font-heading">
                Help
              </Text>
              <Icon className="text-primary" as={HelpCircle} />
            </AnimatedPressable>
            <Divider />
            <AnimatedPressable
              onPress={() => {
                router.dismiss();
                openEnquiryModal({ visible: true });
              }}
              className="flex-row justify-between items-center"
            >
              <Text size="xl" className=" font-heading">
                Send us a feedback
              </Text>
              <Icon className="text-primary" as={Bot} />
            </AnimatedPressable>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}
