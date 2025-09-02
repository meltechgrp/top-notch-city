import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Heading,
  Icon,
  Pressable,
  Text,
  useResolvedTheme,
} from "../ui";
import BottomSheet from "../shared/BottomSheet";
import {
  Bot,
  HelpCircle,
  House,
  MessagesSquare,
  NotebookPen,
  SendHorizonal,
  X,
} from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import { router } from "expo-router";
import {
  openEnquiryModal,
  openStaffsModal,
} from "@/components/globals/AuthModals";
import CustomerCareBottomSheet from "@/components/modals/CustomerCareBottomSheet";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  setStaffs?: () => void;
  me: Me;
};
export default function ConnectionsListSelectBottomSheet(props: Props) {
  const { onDismiss, visible, setStaffs, me } = props;
  const theme = useResolvedTheme();
  return (
    <>
      <BottomSheet
        visible={visible}
        onDismiss={onDismiss}
        addBackground={false}
        plain
        snapPoint={["85%"]}
      >
        <LinearGradient
          colors={
            theme == "dark" ? ["#161819", "#1b1b1f"] : ["#d6d6d7", "#d3d3d4"]
          }
          locations={[0.2, 0.4]}
          style={{
            flex: 1,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingTop: 30,
          }}
        >
          <View className=" flex-1 relative rounded-t-3xl">
            <View className="flex-row justify-between items-center py-2">
              <View>
                <Avatar size="md" className=" rounded-xl bg-transparent">
                  <AvatarImage
                    className="rounded-none"
                    source={require("@/assets/images/notification.png")}
                  />
                </Avatar>
              </View>
              <View className="flex-row items-center gap-4">
                <AvatarGroup>
                  <Avatar size="md" className=" bg-background-muted">
                    <AvatarFallbackText className=" text-typography">
                      Humphrey
                    </AvatarFallbackText>
                  </Avatar>
                  <Avatar size="md" className=" bg-background-muted">
                    <AvatarFallbackText className=" text-typography">
                      Sunday
                    </AvatarFallbackText>
                  </Avatar>
                  <Avatar size="md" className=" bg-background-muted">
                    <AvatarFallbackText className=" text-typography">
                      Monday
                    </AvatarFallbackText>
                  </Avatar>
                </AvatarGroup>
                <Pressable onPress={onDismiss}>
                  <X size={30} color={"white"} />
                </Pressable>
              </View>
            </View>
            <View className="mt-12 gap-3">
              <Heading className=" text-3xl text-typography/80">
                Hi {me.first_name}
              </Heading>
              <Heading className=" text-3xl">How can we help?</Heading>
            </View>
            <TouchableOpacity
              onPress={() => {
                onDismiss();
                setStaffs?.();
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
              <Icon as={SendHorizonal} />
            </TouchableOpacity>
            <View className=" mt-6 px-6 shadow py-6 gap-4 bg-background-muted rounded-3xl">
              <TouchableOpacity
                onPress={() => {
                  router.push("/messages");
                  onDismiss();
                }}
                className="flex-row justify-between items-center"
              >
                <Text size="xl" className=" font-heading">
                  Messages
                </Text>
                <Icon as={MessagesSquare} />
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/search",
                    params: {
                      list: "true",
                    },
                  });
                  onDismiss();
                }}
                className="flex-row justify-between items-center"
              >
                <Text size="xl" className=" font-heading">
                  Explore Properties
                </Text>
                <Icon as={House} />
              </TouchableOpacity>
            </View>
            <View className=" mt-6 px-6 shadow py-6 gap-4 bg-background-muted rounded-3xl">
              <TouchableOpacity
                onPress={() => {
                  router.push("/support/contact");

                  onDismiss();
                }}
                className="flex-row justify-between items-center"
              >
                <Text size="xl" className=" font-heading">
                  Help
                </Text>
                <Icon as={HelpCircle} />
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity
                onPress={() => {
                  onDismiss();
                  openEnquiryModal({ visible: true });
                }}
                className="flex-row justify-between items-center"
              >
                <Text size="xl" className=" font-heading">
                  Send us a feedback
                </Text>
                <Icon as={Bot} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </BottomSheet>
    </>
  );
}
