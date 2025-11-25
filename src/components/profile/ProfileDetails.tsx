import { UserType } from "@/components/profile/ProfileWrapper";
import { Button, Icon, Text, View } from "@/components/ui";
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
  Key,
  Mail,
  MapPin,
  Phone,
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
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Personal Details</Text>
        </View>
        <View className="gap-4 p-4 bg-background-muted rounded-2xl">
          {personal.map((p) => (
            <View key={p.label} className="flex-row gap-4 items-center">
              <Icon as={p.icon} />
              <Text>{p.value}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Bio</Text>
        </View>
        <View className="gap-4 p-4 bg-background-muted rounded-2xl">
          <Text className="text-sm">
            {user.agent_profile?.about ||
              "Add an intresting bio about yourself to stand out."}
          </Text>
        </View>
      </View>
      <View className=" gap-2 mt-2">
        <View className="gap-2 flex-row justify-between">
          <Text className="text-typography/80">Bussiness hours</Text>
        </View>

        <View className="gap-2 flex-row items bg-background-muted px-4 border border-outline-100 rounded-xl">
          <View className="flex-row justify-between items-center py-4 flex-1">
            <WorkingDays days={user?.agent_profile?.working_hours} />
          </View>
        </View>
      </View>
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Contact Details</Text>
        </View>
        <View className="gap-4 p-4 bg-background-muted rounded-2xl">
          <View className="flex-row  gap-2">
            <View className="mt-1">
              <Icon as={Clock} className="w-4 h-4 text-typography/80" />
            </View>
            <View className="gap-2">
              <Text className="text-sm text-typography/80">Working Hours</Text>
              <Button className="h-9 bg-background">
                <Text className="text-sm">Always Open</Text>
              </Button>
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="mt-1">
              <Icon as={Key} className="w-4 h-4 text-typography/80" />
            </View>
            <View className=" gap-2">
              <Text className="text-sm text-typography/80">Specialties</Text>
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-sm">Apartments</Text>
                <Icon as={Dot} className="w-4 h-4" />
                <Text className="text-sm">Shortlets</Text>
                <Icon as={Dot} className="w-4 h-4" />
                <Text className="text-sm">Lands</Text>
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
              <Text className="text-sm text-typography/80">License Number</Text>
              <Text className="text-sm">
                {user.agent_profile?.license_number || "N/A"}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Globe} className="w-4 h-4" />
            {user.website ? (
              <Link
                target="_blank"
                className=" text-sm text-blue-500"
                href={user.website as any}
              >
                {user.website}
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
    <View className="flex-1">
      <TouchableOpacity
        onPress={() => setExpanded((prev) => !prev)}
        className="flex-row items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"
      >
        <View className="flex-row items-center gap-2">
          <Icon as={Clock} className=" text-primary" />
          <Text className="text-base font-medium capitalize">{today}</Text>
        </View>
        <View className="flex-row gap-2 items-center">
          {record[today] ? (
            <Text>{record[today]}</Text>
          ) : (
            <View className=" py-1 px-2 rounded-md bg-[#2a1200]">
              <Text className="text-primary">Closed</Text>
            </View>
          )}
          <Icon as={expanded ? ChevronUp : ChevronDown} />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View className="mt-2 ml-7 mr-6 gap-1">
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
                  <View className="px-3 py-1 rounded-xl bg-[#2a1200]">
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
