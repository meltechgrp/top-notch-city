import {
	updatePropertyBasicInfo,
	updatePropertyDescription,
	updatePropertyFacilities,
	updatePropertyLocation,
	updatePropertyMedia,
} from '@/actions/property/upload';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function usePropertyDataMutations() {
	const queryClient = useQueryClient();
	function invalidate(propertyId: string) {
		queryClient.invalidateQueries({ queryKey: ['properties'] });
		queryClient.invalidateQueries({
			queryKey: ['properties', propertyId],
		});
	}
	const updatePropertyMutation = useMutation({
		mutationFn: ({ propertyId, data }: { propertyId: string; data: any }) =>
			updatePropertyBasicInfo(propertyId, data),
		onSuccess: (_data, { propertyId }) => invalidate(propertyId),
	});
	const updateDescriptionMutation = useMutation({
		mutationFn: ({
			propertyId,
			description,
		}: {
			propertyId: string;
			description: string;
		}) => updatePropertyDescription(propertyId, description),
		onSuccess: (_data, { propertyId }) => invalidate(propertyId),
	});
	const updatePropertyLocationMutation = useMutation({
		mutationFn: updatePropertyLocation,
		onSuccess: (_data, { propertyId }) => invalidate(propertyId),
	});
	const updatePropertyMediaMutation = useMutation({
		mutationFn: updatePropertyMedia,
		onSuccess: (_data, { propertyId }) => invalidate(propertyId),
	});
	const updatePropertyAmenitiesMutation = useMutation({
		mutationFn: updatePropertyFacilities,
		onSuccess: (_data, { propertyId }) => invalidate(propertyId),
	});
	return {
		updatePropertyMutation,
		updateDescriptionMutation,
		updatePropertyLocationMutation,
		updatePropertyMediaMutation,
		updatePropertyAmenitiesMutation,
	};
}
