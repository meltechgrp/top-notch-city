import { deletePropertyMedia } from "@/actions/property/actions";
import {
  updatePropertyBasicInfo,
  updatePropertyDescription,
  updatePropertyFacilities,
  updatePropertyLocation,
  updatePropertyMedia,
} from "@/actions/property/upload";
import { useStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function usePropertyDataMutations() {
  const queryClient = useQueryClient();
  const { me } = useStore();
  function invalidate(propertyId: string) {
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    queryClient.invalidateQueries({
      queryKey: ["properties", propertyId],
    });
    queryClient.invalidateQueries({
      queryKey: ["properties", me?.id],
    });
  }
  const updatePropertyMutation = useMutation({
    mutationFn: ({ propertyId, data }: { propertyId: string; data: any }) =>
      updatePropertyBasicInfo(propertyId, data),
    onSuccess: (_data, { propertyId }) => invalidate(propertyId),
  });
  const updateDescriptionMutation = useMutation({
    mutationFn: ({
      propertyId,
      description,
    }: {
      propertyId: string;
      description: string;
    }) => updatePropertyDescription(propertyId, description),
    onSuccess: (_data, { propertyId }) => invalidate(propertyId),
  });
  const updatePropertyLocationMutation = useMutation({
    mutationFn: updatePropertyLocation,
    onSuccess: (_data, { propertyId }) => invalidate(propertyId),
  });
  const updatePropertyMediaMutation = useMutation({
    mutationFn: updatePropertyMedia,
    onSuccess: (_data, { propertyId }) => invalidate(propertyId),
  });
  const updatePropertyAmenitiesMutation = useMutation({
    mutationFn: updatePropertyFacilities,
    onSuccess: (_data, { propertyId }) => invalidate(propertyId),
  });
  const deletePropertyMediaMutation = useMutation({
    mutationFn: ({
      propertyId,
      mediaId,
    }: {
      propertyId: string;
      mediaId: any;
    }) => deletePropertyMedia(mediaId, propertyId),
    onSuccess: (_data, { propertyId }) => invalidate(propertyId),
  });
  return {
    updatePropertyMutation,
    updateDescriptionMutation,
    updatePropertyLocationMutation,
    updatePropertyMediaMutation,
    updatePropertyAmenitiesMutation,
    deletePropertyMediaMutation,
  };
}
