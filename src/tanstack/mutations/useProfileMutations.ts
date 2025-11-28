import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileField } from "@/actions/user";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type UpdatePayload = { field: keyof ProfileUpdate; value: any }[];

export const useProfileMutations = (userId: string, disableToast?: boolean) => {
  const queryClient = useQueryClient();

  const invalidateUser = () =>
    queryClient.invalidateQueries({ queryKey: ["user", userId] });

  const mutation = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      return updateProfileField(payload);
    },

    onSuccess: () => {
      if (!disableToast) {
        showErrorAlert({
          title: "Profile updated successfully",
          alertType: "success",
        });
      }
      invalidateUser();
    },

    onError: () => {
      showErrorAlert({
        title: "Update failed",
        alertType: "error",
      });
    },
  });

  return { mutation };
};
