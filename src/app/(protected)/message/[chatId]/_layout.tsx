import { Stack } from 'expo-router';

export default function GroupsLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerBackVisible: true,
			}}
		/>
	);
}
