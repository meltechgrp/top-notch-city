import UsersCards from '@/components/admin/users/UsersCards';
import UsersTable from '@/components/admin/users/UsersTable';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { Box, Text, View } from '@/components/ui';

export default function Users() {
	return (
		<Box className=" flex-1 pt-4">
			<BodyScrollView>
				<View className="gap-6 flex-1">
					<UsersCards />
					<UsersTable />
				</View>
			</BodyScrollView>
		</Box>
	);
}
