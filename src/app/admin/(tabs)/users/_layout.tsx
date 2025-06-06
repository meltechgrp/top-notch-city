import MainLayout from '@/components/admin/shared/MainLayout';
import { Slot } from 'expo-router';

export const unstable_settings = {
	initialRouteName: 'index',
};

export default function UserLayoutsComponent() {
	return (
		<MainLayout>
			<Slot />
		</MainLayout>
	);
}
