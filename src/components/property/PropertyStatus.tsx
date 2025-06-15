import { BadgeCheck, CheckCheck, CircleDashed } from 'lucide-react-native';
import { Badge, BadgeIcon, BadgeText } from '../ui';

export function PropertyStatus({ status }: { status: Property['status'] }) {
	switch (status) {
		case 'pending':
			return (
				<Badge size="lg" variant="solid" action="error">
					<BadgeText>Pending</BadgeText>
					<BadgeIcon as={CircleDashed} className="ml-2" />
				</Badge>
			);
		case 'approve':
			return (
				<Badge size="lg" variant="solid" action="success">
					<BadgeText>Approved</BadgeText>
					<BadgeIcon as={CheckCheck} className="ml-2" />
				</Badge>
			);
		case 'sold':
			return (
				<Badge size="lg" variant="solid" action="muted">
					<BadgeText>Sold</BadgeText>
					<BadgeIcon as={BadgeCheck} className="ml-2" />
				</Badge>
			);
		default:
			return <></>;
	}
}
