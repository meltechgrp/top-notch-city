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
import { ScrollView } from "react-native";
import React, { useMemo, useState } from "react";
import { cn, composeFullAddress, fullName } from "@/lib/utils";
import { ChevronRight, Clock, Edit } from "lucide-react-native";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/api";
import { router } from "expo-router";
import { DAYS } from "@/constants/user";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import ImageOptionBottomSheet from "@/components/modals/profile/ImageOptionBottomSheet";
import { MediaPreviewModal } from "@/components/modals/profile/MediaPreviewModal";
import { useTempStore } from "@/store";

export default function AgentFormScreen() {
  const { application: user, updateApplication } = useTempStore((s) => s);
  const [previewFiles, setFiles] = useState<Media[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { pickMedia, takeMedia, setLoading, loading, progress, processFiles } =
    useMediaUpload({
      type: "image",
      maxSelection: 1,
      onSuccess: (media) => {
        setPreviewOpen(false);
      },
      onFiles: (media) => {
        setFiles(media);
        setPreviewOpen(true);
      },
    });
  const personal = [
    {
      label: "Phone",
      value: user?.phone || "Add your phone number",
      field: "phone",
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
      value: user?.social_links
        ? `${Object.values(user.social_links).filter((s) => s.length > 1).length} social links added`
        : "Add social links to your profile",
      field: "social_links",
    },
    {
      label: "Experience",
      value: user?.years_of_experience
        ? `${user.years_of_experience} years of experience`
        : "Add years of experience",
      field: "years_of_experience",
    },
    {
      label: "Companies",
      field: "companies",
      value: user?.companies
        ? `${user.companies.length} ${user.companies.length > 1 ? "companies" : "company"} added`
        : "Add companies you work with",
    },
    {
      label: "License",
      field: "license_number",
      value: user?.license_number || "Add a license number",
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
                          router.push(`/forms/fields/${info.field}`)
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
              <View className="gap-2">
                <View className=" gap-2 mt-2">
                  <Text className="text-typography/80">Bio</Text>
                  <Pressable
                    onPress={() => router.push(`/forms/fields/about`)}
                    className="bg-background-muted border border-outline-100 rounded-xl p-4 min-h-20 py-2 flex-row items-center gap-2"
                  >
                    <View className=" flex-1 ">
                      <Text
                        numberOfLines={4}
                        className={cn(
                          " flex-1 text-base",
                          !user?.about && "text-typography/60 text-sm"
                        )}
                      >
                        {user?.about ||
                          "Tell users about yourself to build trust and show your personality."}
                      </Text>
                    </View>
                    <View className=" justify-center">
                      <Icon as={ChevronRight} />
                    </View>
                  </Pressable>
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
                            router.push(`/forms/fields/${pro.field}`)
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
            </View>
          </ScrollView>
        </Box>
      </ImageBackground>
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
        loading={loading}
        progress={progress}
        processFiles={processFiles}
      />
    </>
  );
}
