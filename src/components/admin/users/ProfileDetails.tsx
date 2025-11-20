import { Button, Icon, Text, View } from "@/components/ui";
import { composeFullAddress } from "@/lib/utils";
import { format } from "date-fns";
import { Link } from "expo-router";
import {
  Calendar,
  CalendarCog,
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

interface ProfileDetailsProps {
  me: Me | null;
}

export function AdminProfileDetails({ me }: ProfileDetailsProps) {
  return (
    <View className="px-4 gap-6">
      <View className="gap-1">
        <Text className="text-base font-medium">Personal Details</Text>
        <View className="gap-4 p-4 bg-background-muted rounded-2xl">
          <View className="flex-row gap-4 items-center">
            <Icon as={Mail} />
            <Text>{me?.email || "N/A"}</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={MapPin} />
            <Text>{me?.address ? composeFullAddress(me.address) : "N/A"}</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={Phone} />
            <Text>{me?.phone || "N/A"}</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={User} />
            <Text>{me?.gender || "N/A"}</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={Calendar} />
            <Text>
              {me?.date_of_birth
                ? format(new Date(me.date_of_birth), "dd MMM")
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-1">
        <Text className="text-base font-medium">Bio</Text>
        <View className="gap-4 p-4 bg-background-muted rounded-2xl">
          <Text className="text-sm">{me?.about || "N/A"}</Text>
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
          <View className="flex-row gap-2">
            <View className="mt-1">
              <Icon
                as={CreativeCommons}
                className="w-4 h-4 text-typography/80"
              />
            </View>
            <View className="gap-2">
              <Text className="text-sm text-typography/80">License Number</Text>
              <Text className="text-sm">{me?.license_number || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Globe} className="w-4 h-4" />
            {me?.website ? (
              <Link
                target="_blank"
                className=" text-sm text-blue-500"
                href={me?.website as any}
              >
                {me.website}
              </Link>
            ) : (
              <Text className="text-sm">N/A</Text>
            )}
          </View>
          <View className=" flex-row items-center gap-2">
            <Icon as={CalendarCog} className="w-4 h-4 text-typography/80" />
            <View className="flex-row gap-1 items-center">
              <Text className="text-sm">
                {me?.years_of_experience || "N/A"}
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
