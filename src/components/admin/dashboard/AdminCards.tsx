import { Eye, House, Smartphone, Users } from "lucide-react-native";
import { View } from "@/components/ui";
import { useRouter } from "expo-router";
import { DashboardCard } from "@/components/custom/DashboardCard";

type Props = {
  data?: AdminDashboardStats;
};

export default function AdminCards({ data }: Props) {
  const router = useRouter();
  return (
    <View className="gap-4 px-4">
      <View className="flex-wrap gap-4">
        <View className="flex-row gap-4">
          <DashboardCard
            title="Users"
            icon={Users}
            total={data?.totalUsers}
            data={data?.totalUsersWithinLast6Months}
            onPress={() => router.push("/admin/users")}
          />
          <DashboardCard
            title="Properties"
            icon={House}
            total={data?.totalProperties}
            data={data?.totalUploadsLast6Months}
            onPress={() => router.push("/admin/listings")}
          />
        </View>
        <View className="flex-row gap-4">
          <DashboardCard
            title="Devices"
            icon={Smartphone}
            total={data?.totalDevices}
            onPress={() => router.push("/admin/analytics/requests")}
          />
          <DashboardCard
            title="Views"
            icon={Eye}
            total={data?.totalViews}
            data={data?.totalViewsLast30Days.map((data) => ({
              month: data.date,
              count: data.views,
            }))}
          />
        </View>
      </View>
    </View>
  );
}
