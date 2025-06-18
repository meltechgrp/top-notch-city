import AgentTable from '@/components/admin/dashboard/AgentTable';
import ViewsTable from '@/components/admin/dashboard/ViewsTable';
import AnalyticCards from '@/components/admin/listings/AnalyticCards';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { Box, Text } from '@/components/ui';

export default function OverView() {
	return (
		<Box className="flex-1">
			<BodyScrollView className="flex-1 pt-4 pb-8">
				<AnalyticCards />
				<AgentTable title="Devices" />
				<ViewsTable title="Sold" />
				<AgentTable title="Requests" />
			</BodyScrollView>
		</Box>
	);
}
