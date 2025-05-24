import { getMe } from '@/actions/user';
import GlobalFullScreenLoader from '@/components/loaders/GlobalFullScreenLoader';
import SnackBar from '@/components/shared/SnackBar';
import eventBus from '@/lib/eventBus';
import { getAuthToken, removeAuthToken } from '@/lib/secureStore';
import { useStore, useTempStore } from '@/store';
import { router } from 'expo-router';
import React, { useEffect } from 'react';

export default function GlobalManager() {
	const fullScreenLoading = useTempStore((s) => s.fullScreenLoading);
	const setMe = useStore((s) => s.setMe);
	const updateFullScreenLoading = useTempStore(
		(s) => s.updateFullScreenLoading
	);
	const hasAuth = useStore((s) => s.hasAuth);
	const [snackBars, setSnackBars] = React.useState<Array<SnackBarOption>>([]);
	const [activeSnackBar, setActiveSnackBar] =
		React.useState<SnackBarOption | null>(null);

	async function updateMe() {
		const me = await getMe();
		if (me) {
			console.log(me);
			setMe(me);
		}
	}

	async function unsetAuthToken() {
		useStore.getState().resetStore();
		removeAuthToken();
		router.replace({
			pathname: '/(auth)/signin',
			params: {
				allowBack: 'false',
			},
		});
	}
	function addSnackBar(snackBar: SnackBarOption) {
		if (activeSnackBar) {
			setSnackBars([snackBar, ...snackBars]);
		} else {
			setActiveSnackBar(snackBar);
		}
	}
	function removeSnackBar() {
		const newSnackBar = snackBars[0];
		setSnackBars((v) => (v.length > 1 ? v.slice(1) : []));
		setActiveSnackBar(null);
		if (newSnackBar) {
			setActiveSnackBar(newSnackBar);
		}
	}

	React.useEffect(() => {
		eventBus.addEventListener('addSnackBar', addSnackBar);
		eventBus.addEventListener('REFRESH_PROFILE', updateMe);

		return () => {
			eventBus.removeEventListener('addSnackBar', addSnackBar);
			eventBus.removeEventListener('REFRESH_PROFILE', updateMe);
		};
	}, []);
	useEffect(() => {
		if (hasAuth && !getAuthToken()) {
			unsetAuthToken();
		}
	}, [hasAuth]);
	return (
		<>
			{!!activeSnackBar && (
				<SnackBar
					type={activeSnackBar.type}
					onClose={removeSnackBar}
					text={activeSnackBar.message}
					duration={activeSnackBar.duration}
					icon={activeSnackBar.icon}
					backdrop={activeSnackBar.backdrop}
				/>
			)}
			<GlobalFullScreenLoader
				visible={fullScreenLoading}
				onDismiss={() => updateFullScreenLoading(false)}
				dismissOnBack={false}
			/>
		</>
	);
}
