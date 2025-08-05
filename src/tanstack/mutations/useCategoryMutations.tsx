import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCategory,
  editCategory,
  deleteCategory,
  addSubcategory,
  editSubcategory,
  deleteSubcategory,
} from "@/actions/property/category"; // Adjust path as needed
import { showSnackbar } from "@/lib/utils";

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
      showSnackbar({ message: "Category added successfully", type: "success" });
      invalidate();
    },
    onError: () => {
      showSnackbar({ message: "Failed to add category", type: "error" });
    },
  });

  const editCategoryMutation = useMutation({
    mutationFn: editCategory,
    onSuccess: () => {
      showSnackbar({
        message: "Category updated successfully",
        type: "success",
      });
      invalidate();
    },
    onError: () => {
      showSnackbar({ message: "Failed to update category", type: "error" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      showSnackbar({
        message: "Category deleted successfully",
        type: "success",
      });
      invalidate();
    },
    onError: () => {
      showSnackbar({ message: "Failed to delete category", type: "error" });
    },
  });

  // Subcategory Mutations
  const addSubcategoryMutation = useMutation({
    mutationFn: addSubcategory,
    onSuccess: () => {
      showSnackbar({
        message: "Subcategory added successfully",
        type: "success",
      });
      invalidate();
    },
    onError: () => {
      showSnackbar({ message: "Failed to add subcategory", type: "error" });
    },
  });

  const editSubcategoryMutation = useMutation({
    mutationFn: editSubcategory,
    onSuccess: () => {
      showSnackbar({
        message: "Subcategory updated successfully",
        type: "success",
      });
      invalidate();
    },
    onError: () => {
      showSnackbar({ message: "Failed to update subcategory", type: "error" });
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: deleteSubcategory,
    onSuccess: () => {
      showSnackbar({
        message: "Subcategory deleted successfully",
        type: "success",
      });
      invalidate();
    },
    onError: () => {
      showSnackbar({ message: "Failed to delete subcategory", type: "error" });
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
