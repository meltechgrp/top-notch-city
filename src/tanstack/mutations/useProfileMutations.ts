import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileField } from "@/actions/user";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { getApiErrorMessage } from "@/actions/utills";
import { useMe } from "@/hooks/useMe";

type UpdatePayload = { field: keyof ProfileUpdate; value: any }[];

export const useProfileMutations = (userId: string, disableToast?: boolean) => {
  const queryClient = useQueryClient();
  const { me } = useMe();

  const invalidateUser = () =>
    queryClient.invalidateQueries({ queryKey: ["user", userId] });

  const mutation = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      const phone = payload.find((item) => item.field === "phone")?.value;
      if (
        phone &&
        me?.phone &&
        String(phone).trim() === String(me.phone).trim()
      ) {
        return { skipped: true };
      }
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

    onError: (error) => {
      const message = getApiErrorMessage(error, "Update failed");
      const friendly =
        /phone/i.test(message) &&
        /(exist|unique|already|another)/i.test(message)
          ? "This phone number is already linked to another account. Please use a different number."
          : message;
      showErrorAlert({
        title: friendly,
        alertType: "error",
      });
    },
  });

  return { mutation };
};
