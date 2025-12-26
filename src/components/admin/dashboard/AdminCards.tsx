import {
  BookCheck,
  Building2,
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
import { useEffect } from "react";
import eventBus from "@/lib/eventBus";

export default function AdminCards() {
  const { data, refetch } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboardStats,
  });
  const router = useRouter();

  useEffect(() => {
    eventBus.addEventListener("REFRESH_DASHBOARD", refetch);
    return () => {
      eventBus.removeEventListener("REFRESH_DASHBOARD", refetch);
    };
  }, [refetch]);

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
            total={data?.deviceStats.totalDevices}
            onPress={() => router.push("/admin/analytics")}
          />
          <DashboardCard
            title="Views"
            icon={Eye}
            total={data?.totalViews}
            showDirection={false}
            onPress={() => router.push("/admin/analytics")}
          />
        </View>
        <View className="flex-row gap-4">
          <DashboardCard
            title="IOS Devices"
            icon={Smartphone}
            showDirection={false}
            total={data?.deviceStats.totalIOSDevices}
            onPress={() => router.push("/admin/analytics")}
          />
          <DashboardCard
            title="Android Devices"
            icon={Smartphone}
            total={data?.deviceStats.totalAndroidDevices}
            showDirection={false}
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
            total={data?.totalPendingProperties}
            onPress={() => router.push("/admin/pending")}
            showDirection={false}
          />
        </View>
        <View className="flex-row gap-4">
          <DashboardCard
            title="Companies"
            icon={Building2}
            total={data?.companyStats.totalCompanies}
            showDirection={false}
            onPress={() => router.push("/admin/analytics")}
          />
          <DashboardCard
            title="Bookings"
            icon={BookCheck}
            total={data?.bookingsSummary.totalBookings}
            onPress={() => router.push("/admin/analytics")}
            showDirection={false}
          />
        </View>
      </View>
    </View>
  );
}
