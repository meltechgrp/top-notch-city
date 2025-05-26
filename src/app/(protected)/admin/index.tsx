import AdminCards from '@/components/admin/dashboard/AdminCards';
import AgentTable from '@/components/admin/dashboard/AgentTable';
import ViewsTable from '@/components/admin/dashboard/ViewsTable';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { Box } from '@/components/ui';

export default function Dashboard() {
	return (
		<Box className="flex-1 pt-4">
			<BodyScrollView className="flex-1">
				<AdminCards />
				<AgentTable />
				<ViewsTable />
			</BodyScrollView>
		</Box>
	);
}
