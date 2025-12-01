import agents from "@/components/profile/agents";
import CampaignCard from "@/components/profile/CampaignCard";
import { UserType } from "@/components/profile/ProfileWrapper";
import { Badge, Button, Icon, Text, View } from "@/components/ui";
import { DAYS } from "@/constants/user";
import { composeFullAddress } from "@/lib/utils";
import { format } from "date-fns";
import { Link } from "expo-router";
import {
  Calendar,
  CalendarCog,
  ChevronDown,
  ChevronUp,
  Clock,
  CreativeCommons,
  Dot,
  Globe,
  Home,
  Key,
  Languages,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  User,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";

interface ProfileDetailsProps {
  user: Me;
  userType: UserType;
  isAgent: boolean;
}

export function ProfileDetails({
  user,
  userType,
  isAgent,
}: ProfileDetailsProps) {
  const personal = [
    {
      label: "email",
      value: user.email || "N/A",
      icon: Mail,
    },
    {
      label: "Phone",
      value: user?.phone || "N/A",
      icon: Phone,
    },
    ...[
      userType !== "visitor" && {
        label: "Gender",
        value: user?.gender || "N/A",
        icon: User,
      },
    ],
    ...[
      userType !== "visitor" && {
        label: "Birthday",
        icon: Calendar,
        value: user?.date_of_birth
          ? format(new Date(user.date_of_birth), "MMM dd, yyyy")
          : "N/A",
      },
    ],
    {
      label: "Address",
      icon: MapPin,
      value: user?.address?.country ? composeFullAddress(user.address) : "N/A",
    },
  ].filter((p) => !!p);
  return (
    <View className="px-4 gap-6">
      {userType == "owner" && user?.role == "user" && (
        <CampaignCard
          title="Become an agent"
          subtitle="Join TopNotch City and start connecting with clients."
          actionLabel="Apply now"
          actionRoute={`/forms/${user?.id}/agent`}
        />
      )}
      {userType == "owner" && isAgent && (
        <CampaignCard
          title="Upload your property"
          subtitle="List your property for sale or rent today."
          icon={PlusCircle}
          actionLabel="Upload"
          actionRoute={`/agents/${user?.id}/properties/add`}
        />
      )}
      {(userType !== "owner" || isAgent) && (
        <View className=" gap-2 mt-2">
          <View className="gap-2 flex-row justify-between">
            <Text className="text-typography/80">Bussiness hours</Text>
          </View>
          <WorkingDays days={user?.agent_profile?.working_hours} />
        </View>
      )}
      {(userType !== "owner" || isAgent) && (
        <View className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-medium">Bio</Text>
          </View>
          <View className="gap-4 p-4 bg-background-muted min-h-20 rounded-2xl">
            <Text className="text-sm">
              {user.agent_profile?.about
                ? user.agent_profile?.about
                : userType == "owner"
                  ? "Add an intresting bio about yourself to stand out."
                  : "N/A"}
            </Text>
          </View>
        </View>
      )}

      {(userType !== "owner" || isAgent) && (
        <View>
          {user.agent_profile?.specialties?.slice() ? (
            <View className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-medium">Services</Text>
              </View>
              <View className="gap-4 flex-row p-4 bg-background-muted rounded-2xl">
                {user.agent_profile?.specialties?.map((s) => (
                  <Badge
                    className="bg-background rounded-2xl px-3 border border-primary"
                    key={s}
                  >
                    <Text className="text-sm">{s}</Text>
                  </Badge>
                ))}
              </View>
            </View>
          ) : undefined}
        </View>
      )}
      {(userType !== "owner" || isAgent) && (
        <View className="gap-1">
          <View className="gap-4 p-4 bg-background-muted rounded-2xl">
            <View className="flex-row gap-2">
              <View className="mt-1">
                <Icon as={Languages} className="w-4 h-4 text-typography/80" />
              </View>
              <View className=" gap-2">
                <Text className="text-sm text-typography/80">Languages</Text>
                <View className="flex-row flex-wrap items-center gap-2">
                  {user.agent_profile?.languages?.slice(0, 3).map((l) => (
                    <Text key={l} className="text-sm capitalize">
                      {l}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="mt-1">
                <Icon
                  as={CreativeCommons}
                  className="w-4 h-4 text-typography/80"
                />
              </View>
              <View className="gap-2">
                <Text className="text-sm text-typography/80">
                  License Number
                </Text>
                <Text className="text-sm">
                  {user.agent_profile?.license_number || "N/A"}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <Icon as={Globe} className="w-4 h-4" />
              {user.agent_profile?.website ? (
                <Link
                  target="_blank"
                  className=" text-sm text-blue-500"
                  href={user.agent_profile?.website as any}
                >
                  {user.agent_profile?.website}
                </Link>
              ) : (
                <Text className="text-sm">N/A</Text>
              )}
            </View>
            <View className=" flex-row items-center gap-2">
              <Icon as={CalendarCog} className="w-4 h-4 text-typography/80" />
              <View className="flex-row gap-1 items-center">
                <Text className="text-sm">
                  {user.agent_profile?.years_of_experience || "N/A"}
                </Text>
                <Text className="text-sm text-typography/80">
                  Years of Experience
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {(userType !== "owner" || isAgent) && (
        <View>
          {user.agent_profile?.companies?.slice().length ? (
            <View className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-medium">Companies</Text>
              </View>
              <View className="gap-4 bg-background-muted p-4 rounded-xl">
                {user.agent_profile?.companies?.slice(0, 1).map((c) => (
                  <View
                    key={c.id}
                    className=" flex-row justify-between items-center"
                  >
                    <View className="flex-1">
                      <Text className="font-semibold">{c.name}</Text>
                      {!!c.address && (
                        <Text className="text-typography/80">{c.address}</Text>
                      )}
                      {!!c.phone && (
                        <Text className="text-typography/80">{c.phone}</Text>
                      )}
                      {!!c.email && (
                        <Text className="text-typography/80">{c.email}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : undefined}
        </View>
      )}
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-md text-typography/80 font-medium">
            Contact Details
          </Text>
        </View>
        <View className="gap-4 p-4 bg-background-muted rounded-2xl">
          {personal.map((p) => (
            <View key={p.label} className="flex-row gap-4 items-center">
              <Icon size={"sm"} as={p.icon} />
              <Text>{p.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

type DayValue = string | undefined;

export function WorkingDays({ days }: { days?: Record<string, string> }) {
  const [expanded, setExpanded] = useState(false);

  const record = useMemo(() => {
    const base: Record<string, DayValue> = {};
    DAYS.forEach((d) => (base[d.toLowerCase()] = undefined));

    if (days) {
      Object.entries(days).forEach(([day, val]) => {
        const normalizedDay = day.trim().toLowerCase();
        if (base.hasOwnProperty(normalizedDay)) {
          base[normalizedDay] = val?.trim() || undefined;
        }
      });
    }
    return base;
  }, [days]);
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  const orderedDays = [today, ...DAYS.filter((d) => d.toLowerCase() !== today)];

  return (
    <View className="flex-1 bg-background-muted rounded-xl pb-3">
      <TouchableOpacity
        onPress={() => setExpanded((prev) => !prev)}
        className="flex-row items-center justify-between p-3 pb-0"
      >
        <View className="flex-row items-center gap-2">
          <Icon as={Clock} className=" text-primary" />
          <Text className="text-base font-medium capitalize">{today}</Text>
        </View>
        <View className="flex-row gap-4 items-center">
          {record[today] ? (
            <Text>{record[today]}</Text>
          ) : (
            <View className=" py-1 px-4 rounded-md bg-[#2a1200]">
              <Text className="text-primary">Closed</Text>
            </View>
          )}
          <Icon as={expanded ? ChevronUp : ChevronDown} />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View className="mt-2 ml-7 mr-9 gap-1">
          {orderedDays.slice(1).map((day) => {
            const val = record[day.toLowerCase()];
            return (
              <View
                key={day}
                className="flex-row items-center justify-between gap-3 px-3"
              >
                <Text className="text-base font-medium capitalize">{day}</Text>
                {val ? (
                  <Text>{val}</Text>
                ) : (
                  <View className="px-4 py-1 rounded-md bg-[#2a1200]">
                    <Text className="text-primary">Closed</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
