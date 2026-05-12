import { useMutation } from "@tanstack/react-query";
import {
  updatePropertyStatus,
  deleteProperty,
  softDeleteProperty,
  featuedProperty,
} from "@/actions/property/actions";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { patchLocalProperty } from "@/db/helpers";
import { syncPropertyById } from "@/db/queries/syncPropertyData";
import eventBus from "@/lib/eventBus";
import { router } from "expo-router";

export function usePropertyStatusMutations() {
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
    await patchLocalProperty(propertyId, {
      status,
      is_featured,
      updated_at: Date.now(),
    });

    try {
      await syncPropertyById(propertyId, { forceFreshUpdatedAt: true });
    } catch (error) {
      console.log("Failed to resync property after mutation", error);
    }

    eventBus.dispatchEvent("REFRESH_DASHBOARD", null);
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
    onSuccess: ({ propertyId }) => {
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
    onSuccess: ({ propertyId }) => {
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
