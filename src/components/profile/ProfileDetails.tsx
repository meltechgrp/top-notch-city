import { Button, Icon, Pressable, Text, View } from "@/components/ui";
import { Link } from "expo-router";
import {
  Calendar,
  CalendarCog,
  Clock,
  CreativeCommons,
  Dot,
  Edit,
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

export function ProfileDetails({ me }: ProfileDetailsProps) {
  return (
    <View className="px-4 gap-6">
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Personal Details</Text>
          <Pressable className="px-2">
            <Icon as={Edit} className="w-5 h-5" />
          </Pressable>
        </View>
        <View className="gap-4 p-4 bg-background-muted rounded-2xl">
          <View className="flex-row gap-4 items-center">
            <Icon as={Mail} />
            <Text>joshuahumphrey579@gmail.com</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={MapPin} />
            <Text>Port Harcourt, Nigeria</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={Phone} />
            <Text>0812 936 8320</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={User} />
            <Text>Male</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <Icon as={Calendar} />
            <Text>April, 5</Text>
          </View>
        </View>
      </View>
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Bio</Text>
          <Pressable className="px-2">
            <Icon as={Edit} className="w-5 h-5" />
          </Pressable>
        </View>
        <View className="gap-4 p-4 bg-background-muted rounded-2xl">
          <Text className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id ullam,
            doloremque quaerat repellendus quam aut eveniet fuga nam nulla eos!
          </Text>
        </View>
      </View>
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Contact Details</Text>
          <Pressable className="px-2">
            <Icon as={Edit} className="w-5 h-5" />
          </Pressable>
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
              <Text className="text-sm">123456789</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Globe} className="w-4 h-4" />
            <Link
              target="_blank"
              className=" text-sm text-blue-500"
              href={"https://humphreyjoshua.vercel.app"}
            >
              https://humphreyjoshua.vercel.app
            </Link>
          </View>
          <View className=" flex-row items-center gap-2">
            <Icon as={CalendarCog} className="w-4 h-4 text-typography/80" />
            <View className="flex-row gap-1 items-center">
              <Text className="text-sm">4</Text>
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
