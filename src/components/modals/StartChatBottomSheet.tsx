import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import {
	Avatar,
	AvatarFallbackText,
	AvatarGroup,
	AvatarImage,
	Heading,
	Icon,
	Pressable,
	Text,
} from '../ui';
import BottomSheet from '../shared/BottomSheet';
import { CircleHelp, NotebookPen, SendHorizonal, X } from 'lucide-react-native';
import { useStore } from '@/store';
import { fullName } from '@/lib/utils';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	onSelect?: (member: any) => void;
	me: Me
};
export default function ConnectionsListSelectBottomSheet(props: Props) {
	const { onDismiss, visible, onSelect, me } = props;
	return (
		<BottomSheet
			visible={visible}
			onDismiss={onDismiss}
			plain
			snapPoint={['55%', '64%']}>
			<LinearGradient
				colors={['#F16000', '#ddd']}
				locations={[0.3, 0.6]}
				style={{
					flex: 1,
					borderTopLeftRadius: 24,
					borderTopRightRadius: 24,
					padding: 24,
					paddingTop: 30,
				}}>
				<View className=" flex-1 relative rounded-t-3xl">
					<View className="flex-row justify-between items-center py-2">
						<View>
							<Avatar size="md" className=" rounded-none bg-transparent">
								<AvatarImage
									className="rounded-none"
									source={require('@/assets/images/icon.png')}
								/>
							</Avatar>
						</View>
						<View className="flex-row items-center gap-4">
							<AvatarGroup>
								<Avatar size="md" className=" bg-background-muted">
									<AvatarFallbackText className=" text-typography">
										Humphrey
									</AvatarFallbackText>
								</Avatar>
								<Avatar size="md" className=" bg-background-muted">
									<AvatarFallbackText className=" text-typography">
										Sunday
									</AvatarFallbackText>
								</Avatar>
								<Avatar size="md" className=" bg-background-muted">
									<AvatarFallbackText className=" text-typography">
										Monday
									</AvatarFallbackText>
								</Avatar>
							</AvatarGroup>
							<Pressable onPress={onDismiss}>
								<X size={30} color={'white'} />
							</Pressable>
						</View>
					</View>
					<View className="mt-16 gap-3">
						<Heading size="4xl" className=" text-gray-200">
							Hi {fullName(me)}
						</Heading>
						<Heading size="4xl" className=" text-white">
							How can we help?
						</Heading>
					</View>
					<View className=" mt-6 px-6 py-6 flex-row shadow justify-between items-center bg-background-info rounded-3xl">
						<View>
							<Text size="xl" className=" font-heading">
								Chat with us
							</Text>
							<Text size="lg" className="text-typography/70">
								We reply in few minutes
							</Text>
						</View>
						<Icon as={SendHorizonal} />
					</View>
					<View className=" mt-6 px-6 py-6 flex-row shadow justify-between items-center bg-background-info rounded-3xl">
						<View>
							<Text size="xl" className=" font-heading">
								Book a property tour
							</Text>
							<Text size="lg" className="text-typography/70">
								Explore our properties
							</Text>
						</View>
						<Icon as={NotebookPen} />
					</View>
					<View className=" mt-6 px-6 py-6 flex-row shadow justify-between items-center bg-background-info rounded-3xl">
						<View>
							<Text size="xl" className=" font-heading">
								Help
							</Text>
							<Text size="lg" className="text-typography/70">
								Search for help
							</Text>
						</View>
						<Icon as={CircleHelp} />
					</View>
				</View>
			</LinearGradient>
		</BottomSheet>
	);
}
