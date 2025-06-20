import { ListFilterIcon, SearchIcon, XIcon } from 'lucide-react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
} from 'react-native-reanimated';
import { Badge, Icon, Pressable, Text, View } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { cn } from '@/lib/utils';

interface Props {
	text: string;
	onChangeText: (text: string) => void;
	onSubmit: () => void;
	textInputRef: React.RefObject<TextInput | null>;
	setShowFilter: (show: boolean) => void;
	setFilter: (category: string) => void;
	filter: SearchFilters;
}

export function SearchHeader({
	text,
	onChangeText,
	onSubmit,
	textInputRef,
	setShowFilter,
	setFilter,
	filter,
}: Props) {
	const translateY = useSharedValue(50);

	useEffect(() => {
		// Animate to 0 (i.e., left aligned)
		translateY.value = withTiming(0, {
			duration: 2500,
			easing: Easing.out(Easing.exp),
		});
	}, []);
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));
	return (
		<View className=" absolute top-0 left-0 w-full z-30">
			<SafeAreaView edges={['top']}>
				<View className=" w-full">
					<View className="flex-row items-center gap-x-4 px-4 w-full">
						<Animated.View
							className={'flex-1 flex-row gap-4'}
							style={animatedStyle}>
							<View className="h-12 bg-background-muted flex-1 rounded-full flex-row items-center px-2 py-1">
								<TextInput
									ref={textInputRef}
									className="h-[36px] flex-1 px-2 text-typography bg-transparent"
									placeholder={'Search by category or city...'}
									value={text}
									onChangeText={onChangeText}
									onSubmitEditing={onSubmit}
									returnKeyLabel="Search"
									returnKeyType="search"
								/>
								<View className=" p-2 bg-primary rounded-full">
									<Icon as={SearchIcon} color="white" />
								</View>
							</View>
							<TouchableOpacity
								className=" p-3 flex items-center justify-center rounded-full bg-background-muted" // consistent width
								onPress={() => setShowFilter(true)}>
								<Icon as={ListFilterIcon} className={cn('w-6 h-6')} />
							</TouchableOpacity>
						</Animated.View>
						{!!text && (
							<Pressable
								className="px-2 h-10 justify-center"
								onPress={() => onChangeText('')}>
								<View className="w-8 h-8 rounded-full bg-background-muted items-center justify-center">
									<Icon as={XIcon} width={15} height={15} />
								</View>
							</Pressable>
						)}
					</View>
				</View>
				<Animated.View style={animatedStyle} className="mt-4">
					<ScrollView
						horizontal
						contentContainerClassName="gap-x-4 pl-4 pr-20"
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						snapToInterval={200}
						snapToAlignment="center"
						decelerationRate="fast">
						{/* {[].map((category) => (
							<TouchableOpacity
								key={category.name}
								className="min-w-[120px]" // consistent width
								onPress={() => setFilter(category.name)}>
								<Badge action="info" className="rounded-full pr-2 py-1.5">
									<View
										className={cn(
											'p-2 rounded-full',
											filter.category == category.name
												? 'bg-primary'
												: 'bg-background'
										)}>
										<Icon
											as={category.icon}
											color={
												filter.category == category.name ? 'white' : undefined
											}
											className="w-6 h-6"
										/>
									</View>
									<Text className="ml-2 font-medium capitalize">
										{category.name}
									</Text>
								</Badge>
							</TouchableOpacity>
						))} */}
					</ScrollView>
				</Animated.View>
			</SafeAreaView>
		</View>
	);
}
