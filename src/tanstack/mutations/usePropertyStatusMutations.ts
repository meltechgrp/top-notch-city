import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updatePropertyStatus,
  deleteProperty,
  softDeleteProperty,
  featuedProperty,
} from "@/actions/property/actions";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import eventBus from "@/lib/eventBus";
import { router } from "expo-router";

export function usePropertyStatusMutations() {
  const queryClient = useQueryClient();
  const invalidateProperties = async (propertyId?: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["property"] }),
      queryClient.invalidateQueries({ queryKey: ["properties"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] }),
      queryClient.invalidateQueries({ queryKey: ["agent-properties"] }),
      queryClient.invalidateQueries({ queryKey: ["pending-properties"] }),
      queryClient.invalidateQueries({ queryKey: ["featured"] }),
      queryClient.invalidateQueries({ queryKey: ["latest"] }),
      queryClient.invalidateQueries({ queryKey: ["shortlet"] }),
      queryClient.invalidateQueries({ queryKey: ["trending-lands"] }),
    ]);
    eventBus.dispatchEvent("REFRESH_DASHBOARD", null);
  };
  const getStatusFromAction = (action: string) => {
    switch (action) {
      case "approve":
        return "approved";
      case "reject":
        return "rejected";
      case "sell":
        return "sold";
      case "expire":
        return "expired";
      case "flag":
        return "flagged";
      case "reset-to-pending":
        return "pending";
      default:
        return undefined;
    }
  };

  const refreshPropertyAfterMutation = async ({
    propertyId,
    status,
    is_featured,
  }: {
    propertyId: string;
    status?: string;
    is_featured?: boolean;
  }) => {
    await invalidateProperties(propertyId);
  };

  const useStatusMutation = (action: string) =>
    useMutation({
      mutationFn: ({
        propertyId,
        reason,
      }: {
        propertyId: string;
        reason?: string;
      }) => updatePropertyStatus(propertyId, action, reason),
      onSuccess: async (_, { propertyId }) => {
        await refreshPropertyAfterMutation({
          propertyId,
          status: getStatusFromAction(action),
        });

        showErrorAlert({
          title: `Property marked as ${action}`,
          alertType: "success",
          duration: 3000,
        });
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
    onSuccess: async (_, { propertyId }) => {
      await invalidateProperties(propertyId);
      showErrorAlert({
        title: "Property deleted",
        alertType: "success",
        duration: 3000,
      });

      router.back();
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
    onSuccess: async (_, { propertyId }) => {
      await invalidateProperties(propertyId);
      showErrorAlert({
        title: "Property deleted successfully",
        alertType: "success",
        duration: 3000,
      });

      router.back();
    },
    onError: () =>
      showErrorAlert({
        title: "Failed to delete property",
        alertType: "error",
        duration: 3000,
      }),
  });
  const featuredMutation = useMutation({
    mutationFn: ({
      propertyId,
      is_featured,
    }: {
      propertyId: string;
      is_featured: boolean;
    }) => featuedProperty(propertyId, is_featured),
    onSuccess: async (_, { propertyId, is_featured }) => {
      await refreshPropertyAfterMutation({
        propertyId,
        is_featured,
      });

      showErrorAlert({
        title: "Property updated successfully",
        alertType: "success",
        duration: 3000,
      });

      router.back();
    },
    onError: () =>
      showErrorAlert({
        title: "Failed to update property",
        alertType: "error",
        duration: 3000,
      }),
  });

  return {
    approveMutation: useStatusMutation("approve"),
    rejectMutation: useStatusMutation("reject"),
    sellMutation: useStatusMutation("sell"),
    expireMutation: useStatusMutation("expire"),
    flagMutation: useStatusMutation("flag"),
    pendingMutation: useStatusMutation("reset-to-pending"),
    deleteMutation,
    softDeleteMutation,
    featuredMutation,
  };
}
