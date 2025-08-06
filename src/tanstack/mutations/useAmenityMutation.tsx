import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAmenity,
  editAmenity,
  deleteAmenity,
} from "@/actions/property/amenity";
import { showErrorAlert } from "@/components/custom/CustomNotification";

export const useAmenityMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["amenities"],
    });
  };
  // Amenity Mutations
  const addAmenityMutation = useMutation({
    mutationFn: addAmenity,
    onSuccess: () => {
      showErrorAlert({
        title: "Amenity added successfully",
        alertType: "success",
      });
      invalidate();
    },
    onError: () => {
      showErrorAlert({ title: "Failed to add amenity", alertType: "error" });
    },
  });

  const editAmenityMutation = useMutation({
    mutationFn: editAmenity,
    onSuccess: () => {
      showErrorAlert({
        title: "Amenity updated successfully",
        alertType: "success",
      });
      invalidate();
    },
    onError: () => {
      showErrorAlert({ title: "Failed to update amenity", alertType: "error" });
    },
  });

  const deleteAmenityMutation = useMutation({
    mutationFn: deleteAmenity,
    onSuccess: () => {
      showErrorAlert({
        title: "Amenity deleted successfully",
        alertType: "success",
      });
      invalidate();
    },
    onError: () => {
      showErrorAlert({ title: "Failed to delete amenity", alertType: "error" });
    },
  });

  return {
    // Amenity
    addAmenityMutation,
    editAmenityMutation,
    deleteAmenityMutation,
  };
};
