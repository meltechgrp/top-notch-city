import { Property } from "@/db/models/properties";
import { useMe } from "@/hooks/useMe";
import { usePropertyStatusMutations } from "@/tanstack/mutations/usePropertyStatusMutations";
import { useMemo } from "react";

export function usePropertyActions({ property }: { property: Property }) {
  const { me: user, isAdmin, isAgent } = useMe();
  const {
    approveMutation,
    rejectMutation,
    deleteMutation,
    expireMutation,
    flagMutation,
    pendingMutation,
    sellMutation,
    featuredMutation,
    softDeleteMutation,
  } = usePropertyStatusMutations();
  const { mutateAsync: approve } = approveMutation;
  const { mutateAsync: reject } = rejectMutation;
  const { mutateAsync: permanentDelete } = deleteMutation;
  const { mutateAsync: expire } = expireMutation;
  const { mutateAsync: flag } = flagMutation;
  const { mutateAsync: pending } = pendingMutation;
  const { mutateAsync: sell } = sellMutation;
  const { mutateAsync: featured } = featuredMutation;
  const { mutateAsync: softDelete } = softDeleteMutation;

  const isOwner = useMemo(
    () => property?.server_user_id === user?.id,
    [property, user],
  );

  const actions: ConfirmationActionConfig[] = [
    {
      visible: isAdmin && property.status !== "approved",
      header: "Mark as Approved",
      actionText: "Approve",
      description: "This will approve the property. Proceed?",
      onConfirm: approve,
    },
    {
      visible: isAdmin && property.status === "pending",
      header: "Mark as Rejected",
      actionText: "Reject",
      description: "This will reject the property. A valid reason is required.",
      requireReason: true,
      onConfirm: reject,
    },
    {
      visible: isAdmin && property.status !== "pending",
      header: "Mark as Flagged",
      actionText: "Flag",
      description:
        "This will flag this property. Please provide a valid reason.",
      requireReason: true,
      onConfirm: flag,
    },
    {
      visible: isAdmin && property.status !== "pending",
      header: "Mark as Expired",
      actionText: "Expire",
      description:
        "This will expire the property. Provide a reason to proceed.",
      requireReason: true,
      onConfirm: expire,
    },
    {
      visible:
        isAdmin && property.status !== "sold" && property.status !== "pending",
      header: "Mark as Pending",
      actionText: "Pending",
      description: "This will mark the property as pending again.",
      onConfirm: pending,
    },
    {
      visible:
        isAdmin && property.status !== "sold" && property.status !== "pending",
      header: property.is_featured ? "Remove from Featured" : "Set as Featured",
      actionText: "Featured",
      description: property.is_featured
        ? "This will remove the property from featured listings."
        : "This will mark the property as a featured property.",
      payload: {
        is_featured: !property.is_featured,
      },
      onConfirm: ({ propertyId, is_featured }) =>
        featured({
          propertyId,
          is_featured: Boolean(is_featured),
        }),
    },
    {
      visible: isOwner && property.status === "approved",
      header: "Mark As Sold",
      actionText: "Mark Sold",
      description: "Are you sure you want to mark this property as sold?",
      onConfirm: sell,
    },
    {
      visible: !isAdmin && isOwner,
      header: "Delete Property",
      actionText: "Delete Property",
      description: "This will delete your property. Are you sure?",
      onConfirm: softDelete,
      className: "text-primary",
      iconClassName: "text-primary",
    },
    {
      visible: isAdmin,
      header: "Permanent Delete",
      actionText: "Delete",
      description:
        "This action is irreversible. Are you sure you want to permanently delete this property?",
      onConfirm: permanentDelete,
      className: "text-primary",
      iconClassName: "text-primary",
    },
    {
      visible: !isAdmin || !isOwner,
      header: "Report Property",
      actionText: "Report",
      description:
        "This will flag this property. Please provide a valid reason.",
      onConfirm: flag,
      requireReason: true,
      className: "text-primary",
      iconClassName: "text-primary",
    },
  ];
  return { actions, isAdmin, isOwner, isAgent };
}
