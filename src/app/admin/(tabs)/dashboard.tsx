import AdminCards from '@/components/admin/dashboard/AdminCards';
import AgentTable from '@/components/admin/dashboard/AgentTable';
import ViewsTable from '@/components/admin/dashboard/ViewsTable';
import MainLayout from '@/components/admin/shared/MainLayout';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';

export default function Dashboard() {
	return (
		<MainLayout>
			<BodyScrollView className="flex-1 pt-4 pb-8">
				<AdminCards />
				<AgentTable title="Properties Uploads" />
				<ViewsTable title="Property Views" />
			</BodyScrollView>
		</MainLayout>
	);
}
