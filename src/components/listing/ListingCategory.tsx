import { useCategorySections } from '@/actions/property';
import {
	Box,
	Heading,
	Icon,
	Text,
	useResolvedTheme,
	View,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { useLayout } from '@react-native-community/hooks';
import { chunk } from 'lodash-es';
import { House } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { useTempStore } from '@/store';

export default function ListingCategory() {
	const { width, onLayout } = useLayout();
	const { listing, updateListing } = useTempStore();
	const { sections: data, loading } = useCategorySections();
	return (
		<>
			<Box className="flex-1 py-2 px-4">
				<View className="  gap-2 flex-1">
					<Heading size="xl">Select your property category</Heading>
					<View onLayout={onLayout} className="py-4 gap-8">
						{!loading &&
							data &&
							data.map((section) => (
								<View key={section.cat} className="gap-3">
									<View className="">
										<Text size="xl" className="font-light">
											{section.cat} Properties
										</Text>
									</View>

									{chunk(section.subs, 2).map((row, i) => (
										<View className={cn('flex-row gap-4')} key={i}>
											{row.map((item) => (
												<TouchableOpacity
													key={item.name}
													style={{
														maxWidth: width / 2,
													}}
													className="flex-1 min-w-12 min-h-24"
													onPress={() => {
														updateListing({
															...listing,
															category: section.cat,
															subCategory: item.name,
														});
													}}>
													<View
														className={cn(
															' gap-1 justify-center items-center py-3 rounded-md bg-background-muted border-b-4 border-background-muted',
															listing.subCategory == item.name &&
																'border-primary'
														)}>
														<View
															className={cn(
																' bg-background self-center rounded-full p-2 mb-2',
																listing.subCategory == item.name && 'bg-primary'
															)}>
															<Icon
																as={House}
																size="xl"
																className={
																	listing.subCategory == item.name
																		? 'text-white'
																		: ''
																}
															/>
														</View>
														<Text size="lg" className=" text-center">
															{item.name}
														</Text>
													</View>
												</TouchableOpacity>
											))}
										</View>
									))}
								</View>
							))}
						{loading && (
							<View className="gap-4">
								<CategorySkeleton />
								<CategorySkeleton />
								<CategorySkeleton />
							</View>
						)}
					</View>
				</View>
			</Box>
		</>
	);
}

const CategorySkeleton = () => {
	const theme = useResolvedTheme();
	return (
		<View className="flex-row gap-4">
			{Array(2)
				.fill(null)
				.map((_, i) => (
					<MotiView
						key={i}
						transition={{
							type: 'timing',
						}}
						className="relative h-32 flex-1 gap-1 justify-center items-center bg-background-muted p-2 rounded-md">
						<Skeleton
							colorMode={theme == 'dark' ? 'dark' : 'light'}
							radius="round"
							height={28}
							width={28}
						/>
						<Skeleton
							colorMode={theme == 'dark' ? 'dark' : 'light'}
							height={10}
							width="60%"
						/>
					</MotiView>
				))}
		</View>
	);
};
