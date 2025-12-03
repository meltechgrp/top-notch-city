import { Listing } from "@/store";
import { getActiveToken } from "@/lib/secureStore";
import config from "@/config";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadProperty(type: "edit" | "add", propertyId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (listing: Listing) => {
      const token = getActiveToken();
      const formData = new FormData();

      const {
        photos,
        description,
        price,
        videos,
        category,
        subCategory,
        facilities,
        purpose,
        address,
        duration,
        title,
        availabilityPeriod,
        currency,
      } = listing;

      if (title) formData.append("title", title);
      if (description) formData.append("description", description);
      if (currency) formData.append("currency_code", currency);
      if (price) formData.append("price", price);
      if (duration) formData.append("duration", duration);
      if (category) formData.append("property_category_name", category);
      if (subCategory)
        formData.append("property_subcategory_name", subCategory);
      if (purpose) formData.append("purpose", purpose);

      if (address) {
        formData.append("latitude", address.location.latitude.toString());
        formData.append("longitude", address.location.longitude.toString());
        const comps = address.addressComponents;
        if (comps.city) formData.append("city", comps.city);
        if (comps.state) formData.append("state", comps.state);
        if (comps.country) formData.append("country", comps.country);
        if (comps.street) formData.append("street", comps.street);
        if (address.placeId) formData.append("place_id", address.placeId);
      }
      if (availabilityPeriod) {
        formData.append("availability", JSON.stringify(availabilityPeriod));
      }
      photos?.forEach((item) => {
        formData.append("property_image_ids", item.id);
      });

      videos?.forEach((item) => {
        formData.append("property_image_ids", item.id);
      });

      facilities?.forEach((fac) => {
        formData.append("amenity_names", fac.label);
        formData.append("amenity_values", fac.value.toString());
      });

      try {
        if (type == "edit") {
          return await axios.put(
            `${config.origin}/api/properties/${propertyId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
              },
            }
          );
        } else {
          return await axios.post(
            `${config.origin}/api/properties/`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
              },
            }
          );
        }
      } catch (error: any) {
        throw Error(error?.message || "Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  return {
    uploading: mutation.isPending,
    error: mutation.error?.message ?? null,
    success: mutation.isSuccess,
    uploadProperty: mutation.mutateAsync,
  };
}
