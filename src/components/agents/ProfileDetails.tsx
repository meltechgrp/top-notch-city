import { Button, Icon, Pressable, Text, View } from "@/components/ui";
import { composeFullAddress } from "@/lib/utils";
import { Link } from "expo-router";
import {
  CalendarCog,
  Clock,
  CreativeCommons,
  Dot,
  Globe,
  Key,
  Mail,
  MapPin,
  Phone,
} from "lucide-react-native";

interface ProfileDetailsProps {
  me: Me | null;
}

export function ProfileDetails({ me }: ProfileDetailsProps) {
  return (
    <View className="px-4 gap-6">
      <View className="gap-1">
        <Text className="text-base font-medium">Personal Details</Text>
        <View className="gap-4 p-4 bg-background-muted rounded-2xl">
          <View className="flex-row gap-4 items-center">
            <Icon as={Mail} />
            <Text numberOfLines={1}>{me?.email || "-"}</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={MapPin} />
            <Text numberOfLines={1}>
              {me?.address ? composeFullAddress(me.address) : "-"}
            </Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={Phone} />
            <Text numberOfLines={1}>{me?.phone || "-"}</Text>
          </View>
        </View>
      </View>
      <View className="gap-1">
        <Text className="text-base font-medium">Contact Details</Text>
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
          {me?.agent_profile?.license_number && (
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
                  {me?.agent_profile?.license_number}
                </Text>
              </View>
            </View>
          )}
          {me?.website && (
            <View className="flex-row items-center gap-2">
              <Icon as={Globe} className="w-4 h-4" />
              <Link
                target="_blank"
                className=" text-sm text-blue-500"
                href={me?.website as any}
              >
                {me.website}
              </Link>
            </View>
          )}
          <View className=" flex-row items-center gap-2">
            <Icon as={CalendarCog} className="w-4 h-4 text-typography/80" />
            <View className="flex-row gap-1 items-center">
              <Text className="text-sm">
                {me?.agent_profile?.years_of_experience || "-"}
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
