import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSnackbar } from '@/lib/utils';
import { setProfileImage, updateProfileField } from '@/actions/user';

// --- Hook ---
export const useProfileMutations = () => {
	const queryClient = useQueryClient();

	const invalidateUser = () =>
		queryClient.invalidateQueries({ queryKey: ['user'] });

	// Photo
	const updatePhotoMutation = useMutation({
		mutationFn: ({ image }: { image: string }) => setProfileImage(image),
		onSuccess: () => {
			showSnackbar({ message: 'Profile photo updated', type: 'success' });
			invalidateUser();
		},
		onError: () => {
			showSnackbar({
				message: 'Failed to update profile photo',
				type: 'error',
			});
		},
	});

	// Full Name
	const updateFullNameMutation = useMutation({
		mutationFn: (data: { first_name: string; last_name: string }) =>
			updateProfileField([
				{ field: 'first_name', value: data.first_name },
				{ field: 'last_name', value: data.last_name },
			]),
		onSuccess: () => {
			showSnackbar({ message: 'Name updated successfully', type: 'success' });
			invalidateUser();
		},
		onError: () => {
			showSnackbar({ message: 'Failed to update name', type: 'error' });
		},
	});

	// Email
	const updateEmailMutation = useMutation({
		mutationFn: (email: string) =>
			updateProfileField([{ field: 'email', value: email }]),
		onSuccess: () => {
			showSnackbar({ message: 'Email updated successfully', type: 'success' });
			invalidateUser();
		},
		onError: () => {
			showSnackbar({ message: 'Failed to update email', type: 'error' });
		},
	});

	// Phone
	const updatePhoneMutation = useMutation({
		mutationFn: (phone: string) =>
			updateProfileField([{ field: 'phone', value: phone }]),
		onSuccess: () => {
			showSnackbar({ message: 'Phone updated successfully', type: 'success' });
			invalidateUser();
		},
		onError: () => {
			showSnackbar({ message: 'Failed to update phone', type: 'error' });
		},
	});

	// Gender
	const updateGenderMutation = useMutation({
		mutationFn: (gender: string) =>
			updateProfileField([{ field: 'gender', value: gender }]),
		onSuccess: () => {
			showSnackbar({ message: 'Gender updated successfully', type: 'success' });
			invalidateUser();
		},
		onError: () => {
			showSnackbar({ message: 'Failed to update gender', type: 'error' });
		},
	});

	// Date of Birth
	const updateDobMutation = useMutation({
		mutationFn: (dob: string) =>
			updateProfileField([{ field: 'date_of_birth', value: dob }]),
		onSuccess: () => {
			showSnackbar({ message: 'Date of birth updated', type: 'success' });
			invalidateUser();
		},
		onError: () => {
			showSnackbar({
				message: 'Failed to update date of birth',
				type: 'error',
			});
		},
	});

	// Address
	const updateAddressMutation = useMutation({
		mutationFn: (address: { field: keyof Me['address']; value: string }[]) =>
			updateProfileField([...(address as any)]),
		onSuccess: () => {
			showSnackbar({
				message: 'Address updated successfully',
				type: 'success',
			});
			invalidateUser();
		},
		onError: () => {
			showSnackbar({ message: 'Failed to update address', type: 'error' });
		},
	});

	return {
		updatePhotoMutation,
		updateFullNameMutation,
		updateEmailMutation,
		updatePhoneMutation,
		updateGenderMutation,
		updateDobMutation,
		updateAddressMutation,
	};
};
