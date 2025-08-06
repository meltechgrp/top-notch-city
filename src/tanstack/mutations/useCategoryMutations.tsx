import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCategory,
  editCategory,
  deleteCategory,
  addSubcategory,
  editSubcategory,
  deleteSubcategory,
} from "@/actions/property/category";
import { showErrorAlert } from "@/components/custom/CustomNotification";

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["allSubcategories"],
    });
    queryClient.invalidateQueries({
      queryKey: ["categories"],
    });
  };
  // Category Mutations
  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      showErrorAlert({
        title: "Category added successfully",
        alertType: "success",
      });
      invalidate();
    },
    onError: () => {
      showErrorAlert({ title: "Failed to add category", alertType: "error" });
    },
  });

  const editCategoryMutation = useMutation({
    mutationFn: editCategory,
    onSuccess: () => {
      showErrorAlert({
        title: "Category updated successfully",
        alertType: "success",
      });
      invalidate();
    },
    onError: () => {
      showErrorAlert({
        title: "Failed to update category",
        alertType: "error",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      showErrorAlert({
        title: "Category deleted successfully",
        alertType: "success",
      });
      invalidate();
    },
    onError: () => {
      showErrorAlert({
        title: "Failed to delete category",
        alertType: "error",
      });
    },
  });

  // Subcategory Mutations
  const addSubcategoryMutation = useMutation({
    mutationFn: addSubcategory,
    onSuccess: () => {
      showErrorAlert({
        title: "Subcategory added successfully",
        alertType: "success",
      });
      invalidate();
    },
    onError: () => {
      showErrorAlert({
        title: "Failed to add subcategory",
        alertType: "error",
      });
    },
  });

  const editSubcategoryMutation = useMutation({
    mutationFn: editSubcategory,
    onSuccess: () => {
      showErrorAlert({
        title: "Subcategory updated successfully",
        alertType: "success",
      });
      invalidate();
    },
    onError: () => {
      showErrorAlert({
        title: "Failed to update subcategory",
        alertType: "error",
      });
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: deleteSubcategory,
    onSuccess: () => {
      showErrorAlert({
        title: "Subcategory deleted successfully",
        alertType: "success",
      });
      invalidate();
    },
    onError: () => {
      showErrorAlert({
        title: "Failed to delete subcategory",
        alertType: "error",
      });
    },
  });

  return {
    // Category
    addCategoryMutation,
    editCategoryMutation,
    deleteCategoryMutation,

    // Subcategory
    addSubcategoryMutation,
    editSubcategoryMutation,
    deleteSubcategoryMutation,
  };
};
