import PropertyCards from '@/components/admin/properties/PropertyCards';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { Box, View } from '@/components/ui';
import { Stack, useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Icon, AddIcon } from '@/components/ui/icon';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';

export default function Properties() {
	const router = useRouter();
	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<View>
							<Menu
								placement="bottom"
								offset={5}
								className="bg-background-muted gap-2"
								trigger={({ ...triggerProps }) => {
									return (
										<Button
											variant="link"
											className="px-4 bg-transparent"
											{...triggerProps}>
											<Icon size="xl" as={MoreHorizontal} />
										</Button>
									);
								}}>
								<MenuItem
									className="bg-background rounded-xl"
									key="category"
									onPress={() => router.push('/admin/properties/categories')}
									textValue="category">
									<Icon as={AddIcon} size="md" className="mr-2" />
									<MenuItemLabel
										size="md"
										className="font-medium text-typography">
										Categories
									</MenuItemLabel>
									<View className="ml-auto">
										<Icon as={ChevronRight} />
									</View>
								</MenuItem>
								<MenuItem
									className="bg-background rounded-xl"
									key="Add property"
									onPress={() => router.replace('/sell')}
									textValue="Add property">
									<Icon as={AddIcon} size="md" className="mr-2" />
									<MenuItemLabel
										size="md"
										className="font-medium text-typography">
										Add Property
									</MenuItemLabel>
									<View className="ml-auto">
										<Icon as={ChevronRight} />
									</View>
								</MenuItem>
							</Menu>
						</View>
					),
				}}
			/>
			<Box className=" flex-1 pt-4">
				<BodyScrollView>
					<View className="gap-6 flex-1">
						<PropertyCards />
					</View>
				</BodyScrollView>
			</Box>
		</>
	);
}
