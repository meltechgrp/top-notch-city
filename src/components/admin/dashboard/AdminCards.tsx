import {
  CircleAlert,
  Eye,
  GitPullRequest,
  House,
  Smartphone,
  Users,
} from "lucide-react-native";
import { View } from "@/components/ui";
import { useRouter } from "expo-router";
import { DashboardCard } from "@/components/custom/DashboardCard";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboardStats } from "@/actions/dashboard/admin";

export default function AdminCards() {
  const { data, refetch, isFetching, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboardStats,
  });
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
            onPress={() => router.push("/admin/properties")}
          />
        </View>
        <View className="flex-row gap-4">
          <DashboardCard
            title="Devices"
            icon={Smartphone}
            total={data?.totalDevices}
            onPress={() => router.push("/admin/analytics")}
          />
          <DashboardCard
            title="Views"
            icon={Eye}
            total={data?.totalViews}
            data={data?.totalViewsLast30Days.map((data) => ({
              month: data.date,
              count: data.views,
            }))}
            onPress={() => router.push("/admin/analytics")}
          />
        </View>
        <View className="flex-row gap-4">
          <DashboardCard
            title="Requests"
            icon={GitPullRequest}
            total={data?.totalRequests}
            showDirection={false}
            onPress={() => router.push("/admin/requests")}
          />
          <DashboardCard
            title="Pending Properties"
            icon={CircleAlert}
            total={data?.totalRequests}
            onPress={() => router.push("/admin/pending")}
            showDirection={false}
          />
        </View>
      </View>
    </View>
  );
}
