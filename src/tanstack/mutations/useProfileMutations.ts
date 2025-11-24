import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileField, setProfileImage } from "@/actions/user";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type UpdatePayload = { field: keyof ProfileUpdate; value: any }[];

export const useProfileMutations = (userId: string) => {
  const queryClient = useQueryClient();

  const invalidateUser = () =>
    queryClient.invalidateQueries({ queryKey: ["user", userId] });

  const mutation = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      if ("image" in (payload as any)) {
        return setProfileImage((payload as any).image);
      }
      return updateProfileField(payload);
    },

    onSuccess: () => {
      showErrorAlert({
        title: "Profile updated successfully",
        alertType: "success",
      });
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
