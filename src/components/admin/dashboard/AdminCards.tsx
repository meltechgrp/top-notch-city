import { LucideIcon } from 'lucide-react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { chunk } from 'lodash-es';
import { cn } from '@/lib/utils';
import { Pressable } from 'react-native';
import { Eye, House, MailQuestion, Users } from 'lucide-react-native';
import { Heading, Icon, Text, View } from '@/components/ui';
import { useRouter } from 'expo-router';

type Props = {
	data?: {
		title: string;
		icon: LucideIcon;
		total: number;
		rate: number;
		direction: boolean;
		updated: number;
	}[];
};

export default function AdminCards({}: Props) {
	const router = useRouter();
	const data = [
		{
			title: 'Users',
			icon: Users,
			total: 25,
			rate: 15,
			direction: true,
			route: '/admin/users',
		},
		{
			title: 'Properties',
			icon: House,
			total: 200,
			rate: 10,
			direction: true,
			route: '/admin/properties',
		},
		{
			title: 'Requests',
			icon: MailQuestion,
			total: 10,
			rate: 10,
			direction: false,
			route: '/admin/requests',
		},
		{
			title: 'Views',
			icon: Eye,
			total: 500,
			rate: 25,
			direction: true,
			route: '/admin/views',
		},
	];
	return (
		<View className="gap-4 px-4">
			<View className="flex-wrap gap-4">
				{chunk(data, 2).map((row, i) => (
					<View className={cn('flex-row gap-4')} key={i}>
						{row.map((item) => (
							<Pressable
								key={item.title}
								onPress={() => router.push(item.route as any)}
								className="flex-1 h-28 py-4 justify-between rounded-xl bg-background-muted">
								<View className=" gap-4 px-4 flex-row justify-between items-center">
									<View className=" p-1.5 self-start rounded-full bg-[#ffe7e3]">
										<Icon size="md" as={item.icon} className="text-primary" />
									</View>
									<Heading size="xl">{item.total}</Heading>
								</View>
								<View className="flex-row justify-between px-4 items-center">
									<Text className=" text-lg font-medium">{item.title}</Text>
									<View
										className={cn(
											'flex-row gap-2 p-1.5 py-px rounded-xl',
											item.direction ? 'bg-green-500' : 'bg-primary'
										)}>
										<FontAwesome
											name={item.direction ? 'caret-up' : 'caret-down'}
											size={14}
											color={'white'}
										/>
										<View className="flex-row items-center">
											<FontAwesome
												name={item.direction ? 'plus' : 'minus'}
												size={6}
												color={'white'}
											/>
											<Text className="text-white">{item.rate}%</Text>
										</View>
									</View>
								</View>
							</Pressable>
						))}
					</View>
				))}
			</View>
		</View>
	);
}
