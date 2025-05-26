import {
	Heading,
	Icon,
	Input,
	InputField,
	Radio,
	RadioGroup,
	Text,
	View,
} from '@/components/ui';
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableData,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable } from 'react-native';

const users = [
	{
		name: 'Divine Uche',
		email: 'divine@example.com',
		role: 'Admin',
		status: 'Active',
	},
	{
		name: 'Humphrey John',
		email: 'humphrey@example.com',
		role: 'Admin',
		status: 'Inactive',
	},
	{
		name: 'Tolu Adebayo',
		email: 'tolu@example.com',
		role: 'User',
		status: 'Active',
	},
	{
		name: 'Sarah Musa',
		email: 'sarah@example.com',
		role: 'Agent',
		status: 'Pending',
	},
	{
		name: 'James Okoro',
		email: 'james@example.com',
		role: 'Admin',
		status: 'Active',
	},
	{
		name: 'Ada Eze',
		email: 'ada@example.com',
		role: 'User',
		status: 'Suspended',
	},
	{
		name: 'Divine Uches',
		email: 'divine@example.com',
		role: 'Admin',
		status: 'Active',
	},
	{
		name: 'Humphrey Johns',
		email: 'humphrey@example.com',
		role: 'Admin',
		status: 'Inactive',
	},
	{
		name: 'Tolu Adebayos',
		email: 'tolu@example.com',
		role: 'User',
		status: 'Active',
	},
	{
		name: 'Sarah Musas',
		email: 'sarah@example.com',
		role: 'Agent',
		status: 'Pending',
	},
	{
		name: 'James Okoros',
		email: 'james@example.com',
		role: 'Admin',
		status: 'Active',
	},
	{
		name: 'Ada Ezes',
		email: 'ada@example.com',
		role: 'User',
		status: 'Suspended',
	},
];

const ITEMS_PER_PAGE = 10;

export default function UsersTable() {
	const [tab, setTab] = useState('user');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);

	const filteredUsers = useMemo(() => {
		let filtered = users;

		// Filter by role
		filtered = filtered.filter((u) => u.role.toLowerCase() === tab);

		// Search by name or email
		if (search.trim() !== '') {
			const regex = new RegExp(search.trim(), 'i');
			filtered = filtered.filter(
				(u) => regex.test(u.name) || regex.test(u.email)
			);
		}

		return filtered;
	}, [tab, search, users]);

	const paginatedUsers = useMemo(() => {
		const start = (page - 1) * ITEMS_PER_PAGE;
		return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredUsers, page]);

	const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
	const tabList = [
		{
			label: 'Clients',
			value: 'user',
		},
		{
			label: 'Agents',
			value: 'agent',
		},
		{
			label: 'Admins',
			value: 'admin',
		},
	];
	return (
		<View className="p-3 rounded-lg overflow-hidden">
			<View className="bg-background-muted p-4 gap-6 rounded-xl">
				<View className="flex-row justify-between gap-4 items-center">
					<Heading size="xl">Users</Heading>
					<Input className="rounded-xl bg-background px-2 h-11 w-[70%]">
						<InputField
							placeholder="Search by name or email..."
							value={search}
							onChangeText={(val) => {
								setSearch(val);
								setPage(1);
							}}
						/>
					</Input>
				</View>
				<View>
					<RadioGroup
						className="flex-row justify-between gap-0"
						value={tab}
						onChange={(val) => {
							setTab(val);
							setPage(1);
						}}>
						{tabList.map((item) => (
							<Radio
								key={item.label}
								className={cn(
									'p-3 px-4 border-b-2 border-outline flex-1 flex-row justify-center',
									tab == item.value && 'border-primary'
								)}
								value={item.value}>
								<Text
									size="lg"
									className={
										tab == item.value
											? 'font-bold'
											: 'font-medium text-typography/80'
									}>
									{item.label}
								</Text>
							</Radio>
						))}
					</RadioGroup>
				</View>
				<Table className="w-full">
					<TableHeader>
						<TableRow className="border-b-0 bg-background/80">
							<TableHead className="font-bold">Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedUsers.length === 0 ? (
							<TableRow>
								<TableData className="text-center text-muted-foreground">
									No users found.
								</TableData>
							</TableRow>
						) : (
							paginatedUsers.map((user, index) => (
								<TableRow
									key={index}
									className={
										index % 2 === 0 ? 'bg-background-info' : 'bg-background/80'
									}>
									<TableData className="px-3" numberOfLines={1}>
										{user.name}
									</TableData>
									<TableData className="px-1 pr-3" numberOfLines={1}>
										{user.email}
									</TableData>
									<TableData className="px-0">
										<View className="w-full flex-row justify-between">
											<Text>{user.role}</Text>
											<Icon as={ChevronRight} className="text-primary" />
										</View>
									</TableData>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>

				{/* Pagination */}
				<View className="flex-row justify-between items-center pt-4">
					{page > 1 && (
						<Pressable
							className=" gap-px flex-row"
							onPress={() => setPage((p) => p - 1)}>
							<Icon as={ChevronLeft} />
							<Text>Previous</Text>
						</Pressable>
					)}
					<Text className="text-md mx-auto text-muted-foreground">
						Page {page} of {totalPages}
					</Text>
					{page < totalPages && (
						<Pressable
							className=" gap-px flex-row"
							onPress={() => setPage((p) => p + 1)}>
							<Text>Next</Text>
							<Icon as={ChevronRight} />
						</Pressable>
					)}
				</View>
			</View>
		</View>
	);
}
