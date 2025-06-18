import { FlashList } from '@shopify/flash-list';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';

export const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);
export const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
