import BottomSheetTwo from '@/components/shared/BottomSheetTwo';
import ContinueContainer from '@/components/shared/ContinueContainer';
import Loading from '@/components/search/Loading';
import withRenderVisible from '@/components/shared/withRenderOpen';
import { cn, useApiQuery, useLazyApiQuery } from '@/lib/utils';
import { fetchStatesByCountry, fetchTownsByState } from '@/lib/api';
import { useStore } from '@/store';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { Button, ButtonText, Text } from '../ui';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	onApply: (state: string | null, towns: string[]) => void;
	state: string | null;
	towns: string[];
};
function SearchFilterBottomSheet(props: Props) {
	const { visible, onDismiss, onApply } = props;
	const [selectedState, setSelectedState] = useState<string | null>(
		props.state
	);
	const [selectedTowns, setSelectedTowns] = useState<string[]>(props.towns);
	const { loading, data } = useApiQuery(fetchStatesByCountry, 'NG');

	const [fetchTowns, { data: _towns }] = useLazyApiQuery(fetchTownsByState);
	const [towns, setTowns] = useState<string[]>();
	const hasFilter = useMemo(
		() => !!selectedState || !!selectedTowns.length,
		[selectedState, selectedTowns]
	);
	function resetFilter() {
		setSelectedState(null);
		setSelectedTowns([]);
		onApply(null, []);
	}
	function onApplyFilter() {
		onApply(selectedState, selectedTowns);
		onDismiss();
	}
	useEffect(() => {
		// This is a hack to force the FlatList to re-render without throwing error
		// due to the FlatList not being able to handle the change in the number of columns
		if (_towns?.length) {
			setTowns([]);
			setTimeout(() => {
				setTowns(_towns);
			}, 1);
		}
	}, [_towns]);
	return (
		<BottomSheetTwo title="Filter" visible={visible} onDismiss={onDismiss}>
			<View className="flex-1">
				{loading ? (
					<View className="py-6 justify-center">
						<Loading />
					</View>
				) : data ? (
					<View className="flex-1 ">
						<View className="flex-1">
							<View className="w-full h-[64px]">
								<View className="flex-row justify-between">
									<Text className="px-4 pb-2 text-gray-500 uppercase ">
										Filter By
									</Text>
									{hasFilter && (
										<Pressable>
											<Text
												className="px-4 text-primary-900"
												onPress={resetFilter}>
												Clear All
											</Text>
										</Pressable>
									)}
								</View>
								<View className="relative  w-full">
									<ScrollView
										horizontal
										contentContainerClassName="gap-x-2 px-4"
										showsHorizontalScrollIndicator={false}>
										{data.map((state) => (
											<Pressable
												key={state}
												className={cn(
													'px-3 border h-[35px] rounded-full justify-center items-center',
													selectedState === state
														? 'border-primary-900'
														: 'border-gray-200'
												)}
												onPress={() => {
													// setSelectedState((v) => {
													//   const newState = v === state ? null : state
													//   if (newState) {
													//     fetchTowns(
													//       activeAddress?.countryCode || 'NG',
													//       newState
													//     )
													//   } else {
													//     setTowns([])
													//   }
													//   return newState
													// })
												}}>
												<Text
													className={cn(
														selectedState === state
															? 'text-black-900'
															: 'text-gray-500'
													)}>
													{state}
												</Text>
											</Pressable>
										))}
									</ScrollView>
									<EllipsisGradient />
								</View>
							</View>
							<View className="px-4 py-6">
								<View className="h-px w-full bg-gray-200" />
							</View>
							{!!_towns?.length && !!selectedState && (
								<View className="w-full h-[140px] relative">
									<Text className="px-4 pb-2 text-gray-500 uppercase ">
										Town
									</Text>
									<ScrollView
										horizontal
										showsHorizontalScrollIndicator={false}
										directionalLockEnabled={true}
										alwaysBounceVertical={false}>
										{!!towns?.length && (
											<FlatList
												contentContainerClassName="gap-2 px-4"
												numColumns={Math.ceil(towns.length / 3)}
												showsVerticalScrollIndicator={false}
												showsHorizontalScrollIndicator={false}
												data={towns}
												directionalLockEnabled={true}
												alwaysBounceVertical={false}
												keyExtractor={(item) => item}
												renderItem={({ item: town }) => {
													return (
														<Pressable
															key={town}
															className={cn(
																'px-3 h-[35px] rounded-full justify-center items-center mr-2',
																selectedTowns.includes(town)
																	? 'bg-primary-900'
																	: 'bg-primary-50'
															)}
															onPress={() => {
																setSelectedTowns((prev) =>
																	prev.includes(town)
																		? prev.filter((v) => v !== town)
																		: [...prev, town]
																);
															}}>
															<Text
																className={cn(
																	selectedTowns.includes(town)
																		? 'text-white'
																		: 'text-primary-900'
																)}>
																{town}
															</Text>
														</Pressable>
													);
												}}
											/>
										)}
									</ScrollView>
									<EllipsisGradient />
								</View>
							)}
						</View>
						<ContinueContainer className="px-4 pb-6">
							{hasFilter ? (
								<Button onPress={onApplyFilter}>
									<ButtonText>Apply</ButtonText>
								</Button>
							) : (
								<Button onPress={onDismiss}>
									<ButtonText>Close</ButtonText>
								</Button>
							)}
						</ContinueContainer>
					</View>
				) : (
					<View className="py-6 justify-center">
						<Text>Unable to load states, please try again</Text>
					</View>
				)}
			</View>
		</BottomSheetTwo>
	);
}

function EllipsisGradient() {
	return (
		<LinearGradient
			colors={['#FFFFFF', 'rgba(255, 255, 255, 0)']}
			locations={[0.25, 0.82]}
			start={{ x: 1, y: 0.5 }}
			end={{ x: -0.01, y: 0.5 }}
			className=" absolute right-[0px] top-[0px] bottom-[0px] w-[20%]"
		/>
	);
}

export default withRenderVisible(SearchFilterBottomSheet);
