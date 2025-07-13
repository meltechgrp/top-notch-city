import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updatePropertyStatus,
  deleteProperty,
  softDeleteProperty,
} from "@/actions/property/actions";
import { showSnackbar } from "@/lib/utils";

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
        showSnackbar({
          message: `Property marked as ${action}`,
          type: "success",
          duration: 3000,
          backdrop: false,
        });
        invalidate(propertyId);
      },
      onError: () =>
        showSnackbar({
          message: `Failed to ${action} property`,
          type: "error",
          duration: 3000,
          backdrop: false,
        }),
    });

  const deleteMutation = useMutation({
    mutationFn: ({ propertyId }: { propertyId: string }) =>
      deleteProperty(propertyId),
    onSuccess: ({ propertyId }) => {
      showSnackbar({
        message: "Property permanently deleted",
        type: "success",
        duration: 3000,
        backdrop: false,
      });
      invalidate(propertyId);
    },
    onError: () =>
      showSnackbar({ message: "Failed to delete property", type: "error" }),
  });

  const softDeleteMutation = useMutation({
    mutationFn: ({ propertyId }: { propertyId: string }) =>
      softDeleteProperty(propertyId),
    onSuccess: ({ propertyId }) => {
      showSnackbar({
        message: "Property soft deleted",
        type: "success",
        duration: 3000,
        backdrop: false,
      });
      invalidate(propertyId);
    },
    onError: () =>
      showSnackbar({
        message: "Failed to soft delete",
        type: "error",
        duration: 3000,
        backdrop: false,
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
