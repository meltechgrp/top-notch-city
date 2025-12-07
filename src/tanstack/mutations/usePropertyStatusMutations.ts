import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updatePropertyStatus,
  deleteProperty,
  softDeleteProperty,
} from "@/actions/property/actions";
import { showErrorAlert } from "@/components/custom/CustomNotification";

export function usePropertyStatusMutations() {
  const queryClient = useQueryClient();

  const invalidate = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["properties", id] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    queryClient.invalidateQueries({ queryKey: ["admins-properties"] });
    queryClient.invalidateQueries({ queryKey: ["pending-properties"] });
  };

  const createStatusMutation = (action: string) =>
    useMutation({
      mutationFn: ({
        propertyId,
        reason,
      }: {
        propertyId: string;
        reason?: string;
      }) => updatePropertyStatus(propertyId, action, reason),
      onSuccess: (_, { propertyId }) => {
        showErrorAlert({
          title: `Property marked as ${action}`,
          alertType: "success",
          duration: 3000,
        });
        invalidate(propertyId);
      },
      onError: () =>
        showErrorAlert({
          title: `Failed to ${action} property`,
          alertType: "error",
          duration: 3000,
        }),
    });

  const deleteMutation = useMutation({
    mutationFn: ({ propertyId }: { propertyId: string }) =>
      deleteProperty(propertyId),
    onSuccess: ({ propertyId }) => {
      showErrorAlert({
        title: "Property deleted",
        alertType: "success",
        duration: 3000,
      });
      invalidate(propertyId);
    },
    onError: () =>
      showErrorAlert({
        title: "Failed to delete property",
        alertType: "error",
      }),
  });

  const softDeleteMutation = useMutation({
    mutationFn: ({ propertyId }: { propertyId: string }) =>
      softDeleteProperty(propertyId),
    onSuccess: ({ propertyId }) => {
      showErrorAlert({
        title: "Property deleted successfully",
        alertType: "success",
        duration: 3000,
      });
      invalidate(propertyId);
    },
    onError: () =>
      showErrorAlert({
        title: "Failed to delete property",
        alertType: "error",
        duration: 3000,
      }),
  });

  return {
    approveMutation: createStatusMutation("approve"),
    rejectMutation: createStatusMutation("reject"),
    sellMutation: createStatusMutation("sell"),
    expireMutation: createStatusMutation("expire"),
    flagMutation: createStatusMutation("flag"),
    pendingMutation: createStatusMutation("reset-to-pending"),
    deleteMutation,
    softDeleteMutation,
  };
}
