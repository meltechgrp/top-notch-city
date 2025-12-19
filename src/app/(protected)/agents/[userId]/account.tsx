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
import React, { useMemo, useState } from "react";
import { cn, composeFullAddress, fullName } from "@/lib/utils";
import { ChevronRight, Clock, Edit } from "lucide-react-native";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";
import { router, useLocalSearchParams } from "expo-router";
import { DAYS } from "@/constants/user";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import ImageOptionBottomSheet from "@/components/modals/profile/ImageOptionBottomSheet";
import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import { MediaPreviewModal } from "@/components/modals/profile/MediaPreviewModal";
import { useMe } from "@/hooks/useMe";

export default function UserAccount() {
  const { userId } = useLocalSearchParams() as {
    userId: string;
  };
  const { isAgent } = useMe();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const [showActions, setShowActions] = useState(false);
  const [previewFiles, setFiles] = useState<Media[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { mutation } = useProfileMutations(userId);
  const [showOptions, setShowOptions] = useState(false);
  const { pickMedia, takeMedia, setLoading, loading, processFiles } =
    useMediaUpload({
      type: "image",
      maxSelection: 1,
      onSuccess: (media) => {
        setPreviewOpen(false);
        mutation.mutateAsync([
          {
            field: "profile_image_id",
            value: media[0].id,
          },
        ]);
      },
      onFiles: (media) => {
        setFiles(media);
        setPreviewOpen(true);
      },
    });
  const user = useMemo(() => data ?? null, [data]);

  const personal = [
    {
      label: "Name",
      value: fullName(user),
      field: "name",
    },
    {
      label: "Phone",
      value: user?.phone,
      field: "phone",
    },
    {
      label: "Gender",
      value: user?.gender,
      field: "gender",
    },
    {
      label: "Birthday",
      field: "date_of_birth",
      value: user?.date_of_birth
        ? format(new Date(user.date_of_birth), "MMM dd, yyyy")
        : "N/A",
    },
    {
      label: "Address",
      field: "address",
      value: user?.address?.country ? composeFullAddress(user.address) : "N/A",
    },
  ];
  const professional = [
    {
      label: "Social Links",
      value: user?.agent_profile?.social_links
        ? `${Object.values(user.agent_profile.social_links).filter((s) => s.length > 1).length} social links added`
        : "Add social links to your profile",
      field: "social_links",
    },
    {
      label: "Experience",
      value: user?.agent_profile?.years_of_experience
        ? `${user.agent_profile.years_of_experience} years of experience`
        : "Add years of experience",
      field: "years_of_experience",
    },
    {
      label: "Services",
      field: "specialties",
      value: user?.agent_profile?.specialties
        ? `${user.agent_profile.specialties.length} services added`
        : "Add services you offer",
    },
    {
      label: "Companies",
      field: "companies",
      value: user?.agent_profile?.companies
        ? `${user.agent_profile.companies.length} ${user.agent_profile.companies.length > 1 ? "companies" : "company"} added`
        : "Add companies you work with",
    },
    {
      label: "Languages",
      field: "languages",
      value: user?.agent_profile?.languages
        ? `${user.agent_profile.languages.length} languages added`
        : "Add languages to your profile",
    },
    {
      label: "Website",
      field: "website",
      value: user?.agent_profile?.website || "Add your webiste URL",
    },
    {
      label: "License",
      field: "license_number",
      value: user?.agent_profile?.license_number || "Add a license number",
    },
  ];

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
                onPress={() => setShowOptions(true)}
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
                  {personal?.map((info, i) => (
                    <View
                      key={info.field}
                      className="gap-2 flex-row items-center"
                    >
                      <View className="w-1/4">
                        <Text className="text-typography/80">{info.label}</Text>
                      </View>
                      <Pressable
                        onPress={() =>
                          router.push(
                            `/agents/${userId}/edit?key=${info.field}`
                          )
                        }
                        className={cn(
                          "flex-row flex-1 justify-between items-center border-b border-b-outline-100 py-4",
                          i == personal.length - 1 && "border-b-0"
                        )}
                      >
                        <Text className=" font-medium flex-1">
                          {info.value}
                        </Text>
                        <Icon as={ChevronRight} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
              {isAgent && (
                <View className="gap-2">
                  <View className=" gap-2 mt-2">
                    <Text className="text-typography/80">Bio</Text>
                    <Pressable
                      onPress={() =>
                        router.push(`/agents/${userId}/edit?key=about`)
                      }
                      className="bg-background-muted border border-outline-100 rounded-xl p-4 min-h-20 py-2 flex-row items-center gap-2"
                    >
                      <View className=" flex-1 ">
                        <Text
                          numberOfLines={4}
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
                      <View className=" justify-center">
                        <Icon as={ChevronRight} />
                      </View>
                    </Pressable>
                  </View>
                  <View className=" gap-2 my-2">
                    <View className="gap-2 flex-row justify-between">
                      <Text className="text-typography/80">
                        Bussiness hours
                      </Text>
                    </View>

                    <View className="gap-2 flex-row items bg-background-muted px-4 border border-outline-100 rounded-xl">
                      <View className="mr-4 mt-6">
                        <Icon as={Clock} className=" text-primary" />
                      </View>
                      <Pressable
                        onPress={() =>
                          router.push(
                            `/agents/${userId}/edit?key=working_hours`
                          )
                        }
                        className="flex-row justify-between items-center py-4 flex-1"
                      >
                        <WorkingDays
                          days={user?.agent_profile?.working_hours}
                        />
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
                      {professional.map((pro, i) => (
                        <View
                          key={pro.field}
                          className="gap-2 flex-row items-center"
                        >
                          <View className="w-1/4">
                            <Text className="text-sm font-medium">
                              {pro.label}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() =>
                              router.push(
                                `/agents/${userId}/edit?key=${pro.field}`
                              )
                            }
                            className={cn(
                              "flex-row flex-1 justify-between items-center border-b border-b-outline-100 py-4"
                            )}
                          >
                            <Text className="text-sm text-typography/80">
                              {pro.value}
                            </Text>
                            <View className="ml-auto flex-row gap-2 items-center">
                              <Icon as={ChevronRight} />
                            </View>
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </Box>
      </ImageBackground>
      <ImageOptionBottomSheet
        visible={showOptions}
        pickMedia={() => {
          pickMedia();
          setShowOptions(false);
        }}
        takeMedia={() => {
          takeMedia();
          setShowOptions(false);
        }}
        deleteMedia={() => {
          setShowOptions(false);
          setShowActions(true);
        }}
        onDismiss={() => setShowOptions(false)}
      />
      <OptionsBottomSheet
        isOpen={showActions}
        onDismiss={() => setShowActions(false)}
        onChange={async (val) =>
          mutation.mutateAsync([{ field: "profile_image_id", value: null }])
        }
        value={{ label: "Delete", value: "delete" }}
        options={[
          {
            label: "Delete",
            value: "delete",
          },
        ]}
      />
      <MediaPreviewModal
        open={previewOpen || loading}
        onClose={() => {
          setFiles([]);
          setPreviewOpen(false);
          setLoading(false);
        }}
        data={previewFiles}
        onDelete={(id: string) => {
          setFiles(previewFiles.filter((item) => item.id !== id));
        }}
        processFiles={processFiles}
      />
    </>
  );
}

type DayValue = string | undefined;

export function WorkingDays({ days }: { days?: Record<string, string> }) {
  const record = useMemo(() => {
    const base: Record<string, DayValue> = {};
    DAYS.forEach((d) => (base[d] = undefined));
    if (days) {
      Object.entries(days).forEach(([day, val]) => {
        const normalizedDay = day.trim();
        if (base.hasOwnProperty(normalizedDay)) {
          base[normalizedDay] = val?.trim() || undefined;
        }
      });
    }
    return base;
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
