import {
	LucideIcon,
	UserCheck2,
	UserRoundCog,
	UserRoundPen,
} from 'lucide-react-native';
import { chunk } from 'lodash-es';
import { cn } from '@/lib/utils';
import { Pressable } from 'react-native';
import { Users } from 'lucide-react-native';
import { Heading, Icon, Text, View } from '@/components/ui';

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

export default function UsersCards({}: Props) {
	const data = [
		{
			title: 'Sign up',
			icon: Users,
			total: 25,
			color: 'primary',
		},
		{
			title: 'Verified',
			icon: UserCheck2,
			total: 200,
			color: 'green',
		},
		{
			title: 'Agents',
			icon: UserRoundPen,
			total: 10,
			color: 'yellow',
		},
		{
			title: 'Admins',
			icon: UserRoundCog,
			total: 500,
			color: 'orange',
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
								className="flex-1 h-28 py-4 justify-between rounded-xl bg-background-muted">
								<View className=" gap-4 px-4 justify-between flex-row">
									<Text className=" text-xl font-medium">{item.title}</Text>
									<Heading size="2xl">{item.total}</Heading>
								</View>
								<View
									className={cn(
										' p-2.5 mx-3 self-start bg-[#ffe7e3] rounded-full',
										item.color == 'green' && 'bg-green-100',
										item.color == 'orange' && 'bg-red-100',
										item.color == 'yellow' && 'bg-yellow-100'
									)}>
									<Icon
										size="md"
										as={item.icon}
										className={cn(
											'text-primary',
											item.color == 'green' && 'text-green-500',
											item.color == 'orange' && 'text-red-500',
											item.color == 'yellow' && 'text-yellow-600'
										)}
									/>
								</View>
							</Pressable>
						))}
					</View>
				))}
			</View>
		</View>
	);
}
