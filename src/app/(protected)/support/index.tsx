import { Box } from "@/components/ui";
import { ScrollView } from "react-native";
import React, { useState } from "react";
import {
  FileQuestion,
  MessageCircleMoreIcon,
  Smartphone,
} from "lucide-react-native";
import { MenuListItem } from "@/components/menu/MenuListItem";
import { Divider } from "@/components/ui/divider";
import { useRouter } from "expo-router";
export default function SupportScreen() {
  const router = useRouter();
  return (
    <>
      <Box className={"flex-1"}>
        <ScrollView
          contentContainerClassName="px-4"
          showsVerticalScrollIndicator={false}
        >
          <Divider className=" h-[0.3px] mb-4 opacity-50" />
          {/* <MenuListItem
						title="Call Us"
						description="Contact call center"
						onPress={() => router.push('/support/contact')}
						icon={Smartphone}
						iconColor="success"
						className=" py-2"
					/>
					<Divider className=" h-[0.3px] mb-4 opacity-50" /> */}
          <MenuListItem
            title="Chat With Us"
            description="Send an in-app message"
            onPress={() => router.push("/staffs")}
            icon={MessageCircleMoreIcon}
            iconColor="primary"
            className=" py-2"
          />
          <Divider className=" h-[0.3px] mb-4 opacity-50" />
          <MenuListItem
            title="FAQs"
            description="Frequently Asked Questions"
            onPress={() => router.push("/support/faq")}
            icon={FileQuestion}
            iconColor="tertiary-300"
            className=" py-2"
          />
        </ScrollView>
      </Box>
    </>
  );
}
