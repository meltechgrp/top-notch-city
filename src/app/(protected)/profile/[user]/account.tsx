import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  ImageBackground,
  Pressable,
  View,
  Text,
  Icon,
} from "@/components/ui";
import { RefreshControl, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { cn, composeFullAddress, fullName } from "@/lib/utils";
import { useStore } from "@/store";
import { ChevronRight, Edit2 } from "lucide-react-native";
import { format } from "date-fns";
import ProfileImageBottomSheet from "@/components/account/ProfileImageBottomSheet";
import { getImageUrl } from "@/lib/api";
import ProfileNameBottomSheet from "@/components/account/ProfileNameBottomSheet";
import ProfileEmailBottomSheet from "@/components/account/ProfileEmailBottomSheet";
import ProfilePhoneBottomSheet from "@/components/account/ProfilePhoneBottomSheet";
import ProfileGenderBottomsheet from "@/components/account/ProfileGenderBottomsheet";
import ProfileDobBottomSheet from "@/components/account/ProfileDobBottomSheet";
import ProfileAddressBottomSheet from "@/components/account/ProfileAddressBottomSheet";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/actions/user";

export default function Account() {
  const { me, updateProfile } = useStore();
  const [refetching, setRefetching] = useState(false);
  const [imageBottomSheet, setImageBottomSheet] = useState(false);
  const [nameBottomSheet, setNameBottomSheet] = useState(false);
  const [emailBottomSheet, setEmailBottomSheet] = useState(false);
  const [phoneBottomSheet, setPhoneBottomSheet] = useState(false);
  const [genderBottomSheet, setGenderBottomSheet] = useState(false);
  const [dobBottomSheet, setDobBottomSheet] = useState(false);
  const [addressBottomSheet, setAddressBottomSheet] = useState(false);
  const { refetch, data } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
  });
  useEffect(() => {
    if (data) {
      updateProfile(data);
    }
  }, [data]);
  async function onRefresh() {
    try {
      setRefetching(true);
      const { data } = await refetch();
      if (data) {
        updateProfile(data);
      }
    } catch (error) {
    } finally {
      setRefetching(false);
    }
  }
  return (
    <>
      <ImageBackground
        source={require("@/assets/images/landing/home.png")}
        className="flex-1"
      >
        <Box className={cn("flex-1 bg-background/95")}>
          <ScrollView
            style={{ display: "flex" }}
            refreshControl={
              <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-40 pt-2"
          >
            <View className=" items-center">
              <Pressable
                onPress={() => setImageBottomSheet(true)}
                className=" gap-2 items-center"
              >
                <Avatar className=" w-40 h-40">
                  <AvatarFallbackText>{fullName(me)}</AvatarFallbackText>
                  <AvatarImage source={getImageUrl(me?.profile_image)} />
                </Avatar>
                <View className="flex-row items-center gap-1">
                  <Text>Edit</Text>
                  <Icon size="sm" as={Edit2} />
                </View>
              </Pressable>
            </View>
            <View className="pt-4 flex-1 px-4 gap-4">
              <View className="gap-2">
                <View className="px-4">
                  <Text size="sm" className="font-light">
                    Full Name
                  </Text>
                </View>
                <Pressable
                  onPress={() => setNameBottomSheet(true)}
                  className="flex-row justify-between items-center bg-background-muted rounded-xl p-4"
                >
                  <Text size="sm" className=" font-normal">
                    {fullName(me) ?? "N/A"}
                  </Text>
                  <Icon as={ChevronRight} />
                </Pressable>
              </View>
              <View className="gap-2">
                <View className="px-4">
                  <Text size="sm" className="font-light">
                    Email Address
                  </Text>
                </View>
                <Pressable
                  onPress={() => setEmailBottomSheet(true)}
                  className="flex-row justify-between items-center bg-background-muted rounded-xl p-4"
                >
                  <Text size="sm" className=" font-normal">
                    {me?.email ?? "N/A"}
                  </Text>
                  <Icon as={ChevronRight} />
                </Pressable>
              </View>
              <View className="gap-2">
                <View className="px-4">
                  <Text size="sm" className="font-light">
                    Phone number
                  </Text>
                </View>
                <Pressable
                  onPress={() => setPhoneBottomSheet(true)}
                  className="flex-row justify-between items-center bg-background-muted rounded-xl p-4"
                >
                  <Text size="sm" className=" font-normal">
                    {me?.phone ?? "N/A"}
                  </Text>
                  <Icon as={ChevronRight} />
                </Pressable>
              </View>
              <View className="gap-2">
                <View className="px-4">
                  <Text size="sm" className="font-light">
                    Gender
                  </Text>
                </View>
                <Pressable
                  onPress={() => setGenderBottomSheet(true)}
                  className="flex-row justify-between items-center bg-background-muted rounded-xl p-4"
                >
                  <Text size="sm" className=" font-normal capitalize">
                    {me?.gender ?? "N/A"}
                  </Text>
                  <Icon as={ChevronRight} />
                </Pressable>
              </View>
              <View className="gap-2">
                <View className="px-4">
                  <Text size="sm" className="font-light">
                    Birthday
                  </Text>
                </View>
                <Pressable
                  onPress={() => setDobBottomSheet(true)}
                  className="flex-row justify-between items-center bg-background-muted rounded-xl p-4"
                >
                  <Text size="sm" className=" font-normal">
                    {me?.date_of_birth
                      ? format(new Date(me?.date_of_birth), "MMM dd, yyyy")
                      : "N/A"}
                  </Text>
                  <Icon as={ChevronRight} />
                </Pressable>
              </View>
              <View className="gap-2">
                <View className="px-4">
                  <Text size="sm" className="font-light">
                    Address
                  </Text>
                </View>
                <Pressable
                  onPress={() => setAddressBottomSheet(true)}
                  className="flex-row justify-between items-center bg-background-muted rounded-xl p-4"
                >
                  <Text size="sm" className=" font-normal">
                    {me?.address?.country
                      ? composeFullAddress(me?.address)
                      : "N/A"}
                  </Text>
                  <Icon as={ChevronRight} />
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </Box>
      </ImageBackground>
      <ProfileImageBottomSheet
        visible={imageBottomSheet}
        onDismiss={() => setImageBottomSheet(false)}
      />
      <ProfileNameBottomSheet
        visible={nameBottomSheet}
        onDismiss={() => setNameBottomSheet(false)}
      />
      <ProfileEmailBottomSheet
        visible={emailBottomSheet}
        onDismiss={() => setEmailBottomSheet(false)}
      />
      <ProfilePhoneBottomSheet
        visible={phoneBottomSheet}
        onDismiss={() => setPhoneBottomSheet(false)}
      />
      <ProfileGenderBottomsheet
        visible={genderBottomSheet}
        onDismiss={() => setGenderBottomSheet(false)}
      />
      <ProfileDobBottomSheet
        visible={dobBottomSheet}
        onDismiss={() => setDobBottomSheet(false)}
      />
      <ProfileAddressBottomSheet
        visible={addressBottomSheet}
        onDismiss={() => setAddressBottomSheet(false)}
      />
    </>
  );
}
