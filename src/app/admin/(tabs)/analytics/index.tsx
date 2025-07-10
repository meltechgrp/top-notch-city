import { fetchAdminDashboardStats } from "@/actions/dashboard/admin";
import AnalyticCards from "@/components/admin/listings/AnalyticCards";
import BarChartCard from "@/components/custom/BarChartCard";
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
        <AnalyticCards data={data} />
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
