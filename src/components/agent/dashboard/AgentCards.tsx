import { Eye, Heart, House, ScrollText } from "lucide-react-native";
import { View } from "@/components/ui";
import { useRouter } from "expo-router";
import { DashboardCard } from "@/components/custom/DashboardCard";

type Props = {
  data?: AgentDashboardStats;
};

export default function AgentCards({ data }: Props) {
  const router = useRouter();
  return (
    <View className="gap-4 px-4">
      <View className="flex-wrap gap-4">
        <View className="flex-row gap-4">
          <DashboardCard
            title="Listings"
            icon={House}
            total={data?.totalProperties}
            showDirection={false}
            onPress={() => router.push("/agent/(tabs)/properties")}
          />
          <DashboardCard
            title="Views"
            showDirection={false}
            icon={Eye}
            total={data?.totalPropertyViews}
          />
        </View>
        <View className="flex-row gap-4">
          <DashboardCard
            title="Bookings"
            showDirection={false}
            icon={ScrollText}
            total={0}
          />
          <DashboardCard
            title="Likes"
            showDirection={false}
            icon={Heart}
            total={0}
          />
        </View>
      </View>
    </View>
  );
}
