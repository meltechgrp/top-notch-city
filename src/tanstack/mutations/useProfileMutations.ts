import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileField, setProfileImage } from "@/actions/user";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type UpdatePayload = { field: keyof Me; value: any }[] | { image: string };

export const useProfileMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUser = () =>
    queryClient.invalidateQueries({ queryKey: ["user"] });

  const mutation = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      if ("image" in (payload as any)) {
        return setProfileImage((payload as any).image);
      }
      return updateProfileField(payload as any);
    },

    onSuccess: (_, payload) => {
      const isImage = "image" in (payload as any);

      showErrorAlert({
        title: isImage
          ? "Profile photo updated"
          : "Profile updated successfully",
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
