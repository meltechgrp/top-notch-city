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
import { useRouter } from "expo-router";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { format } from "date-fns";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyApplications, uploadAgentForm } from "@/actions/agent";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { tempStore } from "@/store/tempStore";
import { getMe } from "@/actions/user";
import { useMe } from "@/hooks/useMe";

function asArray<T = any>(value: unknown): T[] {
  if (Array.isArray(value)) return value.filter(Boolean) as T[];
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean) as T[];
  }
  return [];
}

function asString(value: unknown) {
  if (value === null || value === undefined) return undefined;
  return String(value);
}

function formatBirthdate(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return format(date, "MMM dd, yyyy");
}

function normalizeProfileImage(value: unknown): Media | undefined {
  if (!value) return undefined;
  if (
    typeof value === "object" &&
    "url" in (value as Record<string, unknown>)
  ) {
    return value as Media;
  }
  const url = String(value);
  return {
    id: url,
    url,
    media_type: "IMAGE",
  } as Media;
}

export default function AgentFormScreen() {
  const updateApplication = tempStore((state) => state.updateApplication);
  const application = tempStore((state) => state.application);
  const { me } = useMe();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: uploadAgentForm,
  });
  const { data: profile } = useQuery({
    queryKey: ["user", me?.id],
    queryFn: getMe,
    enabled: !!me,
  });
  const { data: applications } = useQuery({
    queryKey: ["agent-application", me?.id],
    queryFn: getMyApplications,
    enabled: !!me,
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

  const existingApplication = React.useMemo(
    () =>
      Array.isArray(applications)
        ? (applications.find((item) => item.status !== "rejected") ??
          applications[0])
        : undefined,
    [applications],
  );

  React.useEffect(() => {
    if (!profile && !existingApplication) return;
    const current = tempStore.getState().application;
    const agentProfile = profile?.agent_profile;
    const applicationProfile = existingApplication?.profile;
    const applicationUser = existingApplication?.user;

    updateApplication({
      phone: asString(
        current.phone ?? applicationUser?.phone ?? profile?.phone,
      ),
      gender: (current.gender ??
        profile?.gender ??
        applicationUser?.gender) as Application["gender"],
      date_of_birth: asString(current.date_of_birth ?? profile?.date_of_birth),
      address: current.address ?? profile?.address,
      about: asString(current.about ?? agentProfile?.about),
      website: asString(
        current.website ?? applicationProfile?.website ?? agentProfile?.website,
      ),
      license_number:
        asString(current.license_number ?? agentProfile?.license_number) ??
        undefined,
      years_of_experience: asString(
        current.years_of_experience ??
          applicationProfile?.years_of_experience ??
          agentProfile?.years_of_experience,
      ),
      specialties: current.specialties?.length
        ? asArray(current.specialties)
        : asArray(applicationProfile?.specialties ?? agentProfile?.specialties),
      languages: current.languages?.length
        ? asArray(current.languages)
        : asArray(applicationProfile?.languages ?? agentProfile?.languages),
      companies: current.companies?.length
        ? asArray(current.companies)
        : asArray(agentProfile?.companies),
      documents: asArray(current.documents),
      profile_image:
        current.profile_image ??
        normalizeProfileImage(
          profile?.profile_image ?? applicationUser?.profile_image,
        ),
    });
  }, [existingApplication, profile, updateApplication]);

  const user = application ?? null;
  const profileImage =
    typeof user?.profile_image === "string"
      ? user.profile_image
      : user?.profile_image?.url;

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
    if (!asString(application?.years_of_experience)?.trim())
      missingFields.push("Experience");
    if (asArray(application?.specialties).length === 0)
      missingFields.push("Services");
    if (asArray(application?.documents).length === 0)
      missingFields.push("Documents");

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
        queryClient.invalidateQueries({ queryKey: ["user", me?.id] });
        queryClient.invalidateQueries({
          queryKey: ["agent-application", me?.id],
        });
        queryClient.invalidateQueries({ queryKey: ["agent-applications"] });
        router.push("/forms/success");
      },
      onError: (e) => {
        showErrorAlert({
          title: e?.message || "Something went wrong during upload.",
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
      value: user?.date_of_birth ? formatBirthdate(user.date_of_birth) : "N/A",
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
      value: asArray(user?.specialties).length
        ? `${asArray(user?.specialties).length} services added`
        : "Add services you offer",
    },
    {
      label: "Documents",
      field: "documents",
      value: asArray(user?.documents).length
        ? `${asArray(user?.documents).length} ${
            asArray(user?.documents).length > 1 ? "documents" : "document"
          } added`
        : "Add documents for verification",
    },
    {
      label: "Languages",
      field: "languages",
      value: asArray(user?.languages).length
        ? `${asArray(user?.languages).length} languages added`
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
                    <AvatarImage source={getImageUrl(profileImage)} />
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
                            pathname: "/forms/fields/[key]",
                            params: {
                              key: info.field,
                            },
                          })
                        }
                        className={cn(
                          "flex-row flex-1 justify-between items-center border-b border-b-outline-100 py-4",
                          i == personal.length - 1 && "border-b-0",
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
                        pathname: "/forms/fields/[key]",
                        params: {
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
                          !user?.about && "text-typography/60 text-sm",
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
                              pathname: "/forms/fields/[key]",
                              params: {
                                key: pro.field,
                              },
                            })
                          }
                          className={cn(
                            "flex-row flex-1 justify-between items-center border-b border-b-outline-100 py-4",
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
