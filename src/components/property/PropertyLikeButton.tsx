import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pressable } from '../ui';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { likeProperty } from '@/actions/property';
import { Colors } from '@/constants/Colors';
import { cn } from '@/lib/utils';

interface Props {
	property: Property;
	className?: string;
}

export function PropertyLikeButton({ property, className }: Props) {
	const client = useQueryClient();
	const { mutate, isSuccess } = useMutation({
		mutationFn: () => likeProperty({ id: property.id }),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['properties', property.id] });
			client.invalidateQueries({ queryKey: ['properties'] });
		},
	});

	function hnadleLike() {
		mutate();
	}
	return (
		<Pressable both onPress={hnadleLike} className={cn('px-2', className)}>
			<FontAwesome
				name={property?.owner_interaction?.liked ? 'heart' : 'heart-o'}
				size={24}
				color={property?.owner_interaction?.liked ? Colors.primary : 'white'}
			/>
		</Pressable>
	);
}
