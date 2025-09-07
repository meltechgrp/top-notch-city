import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setProfileImage, updateProfileField } from "@/actions/user";
import { showErrorAlert } from "@/components/custom/CustomNotification";

// --- Hook ---
export const useProfileMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUser = () =>
    queryClient.invalidateQueries({ queryKey: ["user"] });

  // Photo
  const updatePhotoMutation = useMutation({
    mutationFn: ({ image }: { image: string }) => setProfileImage(image),
    onSuccess: () => {
      showErrorAlert({ title: "Profile photo updated", alertType: "success" });
      invalidateUser();
    },
    onError: () => {
      showErrorAlert({
        title: "Failed to update profile photo",
        alertType: "error",
      });
    },
  });

  // Full Name
  const updateFullNameMutation = useMutation({
    mutationFn: (data: { first_name: string; last_name: string }) =>
      updateProfileField([
        { field: "first_name", value: data.first_name },
        { field: "last_name", value: data.last_name },
      ]),
    onSuccess: () => {
      showErrorAlert({
        title: "Name updated successfully",
        alertType: "success",
      });
      invalidateUser();
    },
    onError: () => {
      showErrorAlert({ title: "Failed to update name", alertType: "error" });
    },
  });

  // Email
  const updateEmailMutation = useMutation({
    mutationFn: (email: string) =>
      updateProfileField([{ field: "email", value: email }]),
    onSuccess: () => {
      showErrorAlert({
        title: "Email updated successfully",
        alertType: "success",
      });
      invalidateUser();
    },
    onError: () => {
      showErrorAlert({ title: "Failed to update email", alertType: "error" });
    },
  });

  // Phone
  const updatePhoneMutation = useMutation({
    mutationFn: (phone: string) =>
      updateProfileField([{ field: "phone", value: phone }]),
    onSuccess: () => {
      showErrorAlert({
        title: "Phone updated successfully",
        alertType: "success",
      });
      invalidateUser();
    },
    onError: () => {
      showErrorAlert({ title: "Failed to update phone", alertType: "error" });
    },
  });

  // Gender
  const updateGenderMutation = useMutation({
    mutationFn: (gender: string) =>
      updateProfileField([{ field: "gender", value: gender }]),
    onSuccess: () => {
      showErrorAlert({
        title: "Gender updated successfully",
        alertType: "success",
      });
      invalidateUser();
    },
    onError: () => {
      showErrorAlert({ title: "Failed to update gender", alertType: "error" });
    },
  });

  // Date of Birth
  const updateDobMutation = useMutation({
    mutationFn: (dob: string) =>
      updateProfileField([{ field: "date_of_birth", value: dob }]),
    onSuccess: () => {
      showErrorAlert({ title: "Date of birth updated", alertType: "success" });
      invalidateUser();
    },
    onError: () => {
      showErrorAlert({
        title: "Failed to update date of birth",
        alertType: "error",
      });
    },
  });

  // Address
  const updateAddressMutation = useMutation({
    mutationFn: (address: { field: keyof Me["address"]; value: string }[]) =>
      updateProfileField([...(address as any)]),
    onSuccess: () => {
      showErrorAlert({
        title: "Address updated successfully",
        alertType: "success",
      });
      invalidateUser();
    },
    onError: () => {
      showErrorAlert({ title: "Failed to update address", alertType: "error" });
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
