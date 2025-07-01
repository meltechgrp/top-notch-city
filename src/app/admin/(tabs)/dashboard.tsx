import { fetchAdminDashboardStats } from "@/actions/dashboard/admin";
import AdminCards from "@/components/admin/dashboard/AdminCards";
import MainLayout from "@/components/admin/shared/MainLayout";
import BarChartCard from "@/components/custom/BarChartCard";
import DonutPieChart from "@/components/custom/DonutPieCard";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { fillLast6Months } from "@/lib/utils";
import { useRefresh } from "@react-native-community/hooks";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data, refetch, isFetching, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboardStats,
  });
  const { onRefresh } = useRefresh(refetch);
  return (
    <MainLayout>
      <BodyScrollView
        refreshing={isFetching || isLoading}
        onRefresh={onRefresh}
        className="flex-1 gap-1 pt-4 pb-8"
      >
        <AdminCards data={data} />
        <DonutPieChart
          title="User Distribution"
          data={[
            { value: data?.totalNormalUsers, label: "users" },
            { value: data?.totalAdmin, label: "admins" },
            { value: data?.totalAgents, label: "agents" },
            { value: 0, label: "admin agents" },
          ]}
        />
        <BarChartCard
          title="User Stats"
          data={fillLast6Months(data?.totalUsersWithinLast6Months)}
        />
        <BarChartCard
          title="Devices Stats"
          data={fillLast6Months(data?.totalDevicesLast6Months)}
        />
      </BodyScrollView>
    </MainLayout>
  );
}
