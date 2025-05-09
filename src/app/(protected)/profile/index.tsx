import { useStore } from '@/store';
import { Redirect } from 'expo-router';

export default function ProfileIndex() {
	const me = useStore((v) => v.me);

	if (!me) return null;

	return (
		<Redirect
			href={{
				pathname: '/(protected)/profile/[user]',
				params: {
					user: me?.id,
				},
			}}
		/>
	);
}
