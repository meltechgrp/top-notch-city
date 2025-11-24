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
import React, { useEffect, useMemo, useState } from "react";
import { cn, composeFullAddress, fullName } from "@/lib/utils";
import { useStore } from "@/store";
import { ChevronRight, Clock, Edit } from "lucide-react-native";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";
import { router, useLocalSearchParams } from "expo-router";
import { DAYS } from "@/constants/user";

export default function UserAccount() {
  const { userId } = useLocalSearchParams() as {
    userId: string;
  };
  const updateProfile = useStore.getState().updateProfile;
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const user = useMemo(() => data ?? null, [data]);
  useEffect(() => {
    if (user) {
      updateProfile({
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        gender: user.gender,
        phone: user.phone,
      });
    }
  }, [user]);
  return (
    <>
      <ImageBackground
        source={require(`@/assets/images/landing/home.png`)}
        className="flex-1"
      >
        <Box className={cn(`flex-1 bg-background/95`)}>
          <ScrollView
            style={{ display: "flex" }}
            collapsable={false}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-40 pt-2 gap-4"
          >
            <View className=" items-center">
              <Pressable
                // onPress={() => setImageBottomSheet(true)}
                className=" gap-2 items-center"
              >
                <Avatar className=" w-28 h-28">
                  <AvatarFallbackText>{fullName(user)}</AvatarFallbackText>
                  <AvatarImage source={getImageUrl(user?.profile_image)} />
                </Avatar>
                <View className="flex-row items-center gap-1 ">
                  <Text className="text-primary">Edit picture</Text>
                  <Icon className="text-primary" as={Edit} />
                </View>
              </Pressable>
            </View>
            <View className="px-4 gap-4">
              <View className="gap-2">
                <Text className="text-typography/80">Personal Infomation</Text>
                <View className=" flex-1 bg-background-muted border border-outline-100 rounded-xl p-4 py-2">
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-typography/80">Name</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=name`)
                      }
                      className="flex-row flex-1 justify-between items-center border-b border-b-outline-100 py-4"
                    >
                      <Text className=" font-medium">
                        {fullName(user) ?? "N/A"}
                      </Text>
                      <Icon as={ChevronRight} />
                    </Pressable>
                  </View>
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-typography/80">Phone</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=phone`)
                      }
                      className="flex-row justify-between items-center border-b border-b-outline-100 py-4 flex-1"
                    >
                      <Text className=" font-medium">
                        {user?.phone ?? "N/A"}
                      </Text>
                      <Icon as={ChevronRight} />
                    </Pressable>
                  </View>
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-typography/80">Gender</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=gender`)
                      }
                      className="flex-row justify-between items-center border-b border-b-outline-100 py-4 flex-1"
                    >
                      <Text className=" font-medium capitalize">
                        {user?.gender ?? "N/A"}
                      </Text>
                      <Icon as={ChevronRight} />
                    </Pressable>
                  </View>
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-typography/80">Birthday</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=date_of_birth`)
                      }
                      className="flex-row justify-between items-center border-b border-b-outline-100 py-4 flex-1"
                    >
                      <Text className=" font-medium">
                        {user?.date_of_birth
                          ? format(
                              new Date(user?.date_of_birth),
                              "MMM dd, yyyy"
                            )
                          : "N/A"}
                      </Text>
                      <Icon as={ChevronRight} />
                    </Pressable>
                  </View>
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-typography/80">Address</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=name`)
                      }
                      className="flex-row justify-between items-center py-4 flex-1"
                    >
                      <Text className=" font-medium">
                        {user?.address?.country
                          ? composeFullAddress(user?.address)
                          : "N/A"}
                      </Text>
                      <Icon as={ChevronRight} />
                    </Pressable>
                  </View>
                </View>
              </View>
              <View className=" gap-2 mt-2">
                <Text className="text-typography/80">Bio</Text>
                <Pressable
                  onPress={() =>
                    router.push(`/agents/${userId}/edit?key=about`)
                  }
                  className="bg-background-muted border border-outline-100 rounded-xl h-20 p-4 py-2 flex-row items-center gap-2"
                >
                  <View className=" flex-1 ">
                    <Text
                      className={cn(
                        " flex-1 text-base",
                        !user?.agent_profile?.about &&
                          "text-typography/60 text-sm"
                      )}
                    >
                      {user?.agent_profile?.about ||
                        "Tell users about yourself to build trust and show your personality."}
                    </Text>
                  </View>
                  <View className="h-full justify-center">
                    <Icon as={ChevronRight} />
                  </View>
                </Pressable>
              </View>
              <View className=" gap-2 mt-2">
                <View className="gap-2 flex-row justify-between">
                  <Text className="text-typography/80">Bussiness hours</Text>
                </View>

                <View className="gap-2 flex-row items bg-background-muted px-4 border border-outline-100 rounded-xl">
                  <View className="mr-4 mt-6">
                    <Icon as={Clock} className=" text-primary" />
                  </View>
                  <Pressable
                    onPress={() =>
                      router.push(`/agents/${userId}/edit?key=working_hours`)
                    }
                    className="flex-row justify-between items-center py-4 flex-1"
                  >
                    <WrokingDays days={user?.agent_profile?.working_hours} />
                    <View className="ml-10 flex-row gap-2 items-center">
                      <Icon as={ChevronRight} />
                    </View>
                  </Pressable>
                </View>
              </View>
              <View className="gap-2">
                <Text className="text-typography/80">
                  Professional Infomation
                </Text>
                <View className=" flex-1 bg-background-muted border border-outline-100 rounded-xl p-4 py-2">
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-sm font-medium">Social Links</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=social_links`)
                      }
                      className="flex-row flex-1 justify-between items-center border-b border-b-outline-100 py-4"
                    >
                      <Text className="text-sm text-typography/80">
                        {user?.agent_profile?.social_links
                          ? `${Object.values(user?.agent_profile?.social_links)?.length} social links added`
                          : "Add social links to your profile"}
                      </Text>
                      <View className="ml-auto flex-row gap-2 items-center">
                        <Icon as={ChevronRight} />
                      </View>
                    </Pressable>
                  </View>
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-sm font-medium">Experience</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(
                          `/agents/${userId}/edit?key=years_of_experience`
                        )
                      }
                      className="flex-row justify-between items-center border-b border-b-outline-100 py-4 flex-1"
                    >
                      <Text className="text-sm text-typography/80">
                        {user?.agent_profile?.years_of_experience
                          ? `${user?.agent_profile?.years_of_experience} years of experience`
                          : "Add years of experience"}
                      </Text>
                      <View className="ml-auto flex-row gap-2 items-center">
                        <Icon as={ChevronRight} />
                      </View>
                    </Pressable>
                  </View>
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-sm font-medium">Services</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=specialties`)
                      }
                      className="flex-row justify-between items-center border-b border-b-outline-100 py-4 flex-1"
                    >
                      <Text className="text-sm text-typography/80">
                        {user?.agent_profile?.specialties
                          ? `${user?.agent_profile?.specialties?.length} services added`
                          : "Add services offered you offer"}
                      </Text>
                      <View className="ml-auto flex-row gap-2 items-center">
                        <Icon as={ChevronRight} />
                      </View>
                    </Pressable>
                  </View>
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-sm font-medium">Companies</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=companies`)
                      }
                      className="flex-row justify-between items-center border-b border-b-outline-100 py-4 flex-1"
                    >
                      <Text className="text-sm text-typography/80">
                        {user?.agent_profile?.companies
                          ? `${user?.agent_profile?.companies?.length} ${user?.agent_profile?.companies?.length > 1 ? "companies" : "company"} added`
                          : "Add companies you work with"}
                      </Text>
                      <View className="ml-auto flex-row gap-2 items-center">
                        <Icon as={ChevronRight} />
                      </View>
                    </Pressable>
                  </View>
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-sm font-medium">License</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=license_number`)
                      }
                      className="flex-row justify-between items-center border-b border-b-outline-100 py-4 flex-1"
                    >
                      <Text className="text-sm text-typography/80">
                        {user?.agent_profile?.license_number
                          ? user?.agent_profile?.license_number
                          : "Add a license number"}
                      </Text>
                      <View className="ml-auto flex-row gap-2 items-center">
                        <Icon as={ChevronRight} />
                      </View>
                    </Pressable>
                  </View>
                  <View className="gap-2 flex-row items-center">
                    <View className="w-1/4">
                      <Text className="text-sm font-medium">Languages</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=languages`)
                      }
                      className="flex-row justify-between items-center py-4 flex-1"
                    >
                      <Text className="text-sm text-typography/80">
                        {user?.agent_profile?.languages
                          ? `${user?.agent_profile?.languages?.length} ${user?.agent_profile?.languages?.length > 1 ? "languages" : "language"} added`
                          : "Add languages to your profile"}
                      </Text>
                      <View className="ml-auto flex-row gap-2 items-center">
                        <Icon as={ChevronRight} />
                      </View>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </Box>
      </ImageBackground>
    </>
  );
}

type DayValue = string | undefined;

export function WrokingDays({ days }: { days?: Record<string, string> }) {
  const [record, setRecord] = useState<Record<string, DayValue>>({});

  useEffect(() => {
    const base: Record<string, DayValue> = {};
    DAYS.forEach((d) => (base[d] = undefined));

    if (days) {
      Object.entries(days).forEach((pair) => {
        const [day, val] = pair.map((x) => x.trim());
        if (base.hasOwnProperty(day)) {
          base[day] = val || undefined;
        }
      });
    }

    setRecord(base);
  }, [days]);
  return (
    <View className="gap-1 flex-1">
      {DAYS.map((day) => {
        const val = record[day];

        return (
          <View
            key={day}
            className="flex-row items-center justify-between gap-3"
          >
            <Text className=" text-base font-medium capitalize">{day}</Text>

            {val ? (
              <View className="flex-row items-center gap-2">
                <Text>{val}</Text>
              </View>
            ) : (
              <View className="px-3 py-1 rounded-xl bg-[#2a1200]">
                <Text className="text-primary">Closed</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
