import React from 'react';
import { Fab, FabIcon } from './ui';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from './layouts/ThemeProvider';

const MobileModeChangeButton = () => {
	const { theme, toggleTheme } = useTheme();
	return (
		<Fab onPress={toggleTheme} className="md:hidden bottom-4 right-4">
			<FabIcon
				as={theme === 'light' ? Moon : Sun}
				className="fill-typography-50"
			/>
		</Fab>
	);
};

export default MobileModeChangeButton;
