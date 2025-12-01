import {
  Avatar,
  AvatarImage,
  Box,
  ImageBackground,
  Pressable,
  View,
  Text,
  Icon,
  Button,
} from "@/components/ui";
import { ScrollView } from "react-native";
import React from "react";
import { cn, composeFullAddress } from "@/lib/utils";
import { ChevronRight, Edit, Upload } from "lucide-react-native";
import { getImageUrl } from "@/lib/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { format } from "date-fns";
import { useTempStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useMutation } from "@tanstack/react-query";
import { uploadAgentForm } from "@/actions/agent";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

export default function AgentFormScreen() {
  const { userId } = useLocalSearchParams() as {
    userId: string;
  };
  const { application, updateApplication } = useTempStore(useShallow((s) => s));

  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: uploadAgentForm,
  });
  const { pickMedia, loading, processFiles } = useMediaUpload({
    type: "image",
    maxSelection: 1,
    onSuccess: (media) => {
      updateApplication({
        profile_image: media[0],
      });
    },
    onFiles: (media) => {
      processFiles(media);
    },
  });

  const user = application ?? null;

  async function handleForm() {
    if (!application)
      return showErrorAlert({
        title: "Please in the application form.",
        alertType: "error",
        duration: 2500,
      });
    const missingFields: string[] = [];

    if (!application?.phone?.trim()) missingFields.push("Phone number");
    if (!application?.date_of_birth) missingFields.push("Birthdate");
    if (!application?.address) missingFields.push("Address");
    if (!application?.gender?.trim()) missingFields.push("Gender");
    if (!application?.about?.trim()) missingFields.push("Bio");
    if (!application?.years_of_experience?.trim())
      missingFields.push("Experience");
    if (!application?.specialties) missingFields.push("Services");
    if (!application?.documents) missingFields.push("Documents");

    if (missingFields.length > 0) {
      const message =
        missingFields.length === 1
          ? `${missingFields[0]} is required`
          : `${missingFields.slice(0, -1).join(", ")} and ${
              missingFields[missingFields.length - 1]
            } are required`;

      showErrorAlert({
        title: message,
        alertType: "error",
        duration: 3000,
      });

      return;
    }
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(application?.phone?.trim() || "")) {
      showErrorAlert({
        title: "Enter a valid phone number.",
        alertType: "error",
        duration: 2500,
      });
      return;
    }

    await mutateAsync(application, {
      onSuccess: () => {
        router.push({
          pathname: "/forms/[userId]/success",
          params: {
            userId,
          },
        });
      },
      onError: () => {
        showErrorAlert({
          title: "Something went wrong during upload.",
          alertType: "error",
        });
      },
    });
  }
  const personal = [
    {
      label: "Phone",
      value: user?.phone || "Add your phone number",
      field: "phone",
    },
    {
      label: "Gender",
      value: user?.gender || "Select your gender",
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
      label: "Experience",
      value: user?.years_of_experience
        ? `${user.years_of_experience} years of experience`
        : "Add years of experience",
      field: "years_of_experience",
    },
    {
      label: "Services",
      field: "specialties",
      value: user?.specialties
        ? `${user.specialties.length} services added`
        : "Add services you offer",
    },
    {
      label: "Documents",
      field: "documents",
      value: user?.documents
        ? `${user.documents.length} ${user.documents.length > 1 ? "documents" : "document"} added`
        : "Add documents for verification",
    },
    {
      label: "Languages",
      field: "languages",
      value: user?.languages
        ? `${user.languages.length} languages added`
        : "Add languages to your profile",
    },
    {
      label: "Website",
      field: "website",
      value: user?.website || "Add your webiste URL",
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
              <Pressable onPress={pickMedia} className=" gap-2 items-center">
                <Avatar
                  className={cn(" w-28 h-28", loading && "bg-background-muted")}
                >
                  {!loading && (
                    <AvatarImage
                      source={getImageUrl(user?.profile_image?.url)}
                    />
                  )}
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
                          router.push({
                            pathname: "/forms/[userId]/fields/[key]",
                            params: {
                              userId,
                              key: info.field,
                            },
                          })
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
                    onPress={() =>
                      router.push({
                        pathname: "/forms/[userId]/fields/[key]",
                        params: {
                          userId,
                          key: "about",
                        },
                      })
                    }
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
                            router.push({
                              pathname: "/forms/[userId]/fields/[key]",
                              params: {
                                userId,
                                key: pro.field,
                              },
                            })
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
            <View className="px-4">
              <Button onPress={handleForm} className="h-12">
                {isPending ? <SpinningLoader /> : <Icon as={Upload} />}
                <Text>Submit Application</Text>
              </Button>
            </View>
          </ScrollView>
        </Box>
      </ImageBackground>
    </>
  );
}
