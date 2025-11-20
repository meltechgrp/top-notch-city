import { fetchAdminDashboardStats } from "@/actions/dashboard/admin";
import BarChartCard from "@/components/custom/BarChartCard";
import DonutPieChart from "@/components/custom/DonutPieCard";
import LineChartCard from "@/components/custom/LineChartCard";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { Box, View } from "@/components/ui";
import { fillLast6Months, fillMissingTimeSeries } from "@/lib/utils";
import { useRefresh } from "@react-native-community/hooks";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function OverView() {
  const { data, refetch, isFetching, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboardStats,
  });
  const { onRefresh } = useRefresh(refetch);
  const views = useMemo(
    () =>
      fillMissingTimeSeries(data?.totalViewsLast30Days || [], {
        dateKey: "date",
        valueKey: "views",
      }),
    [data]
  );
  return (
    <Box className="flex-1">
      <BodyScrollView
        refreshing={isFetching || isLoading}
        onRefresh={onRefresh}
        className="flex-1 gap-1 pt-4 pb-8"
      >
        <DonutPieChart
          title="User Distribution"
          data={[
            { value: data?.totalNormalUsers, label: "users" },
            { value: data?.totalAdmin, label: "admins" },
            { value: data?.totalAgents, label: "agents" },
            { value: data?.totalAdminAgent, label: "admin agents" },
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
        <View>
          <LineChartCard title="Property Views" data={views} />
        </View>
        <BarChartCard
          title="Property Uploads"
          data={fillLast6Months(data?.totalUploadsLast6Months)}
        />
      </BodyScrollView>
    </Box>
  );
}
