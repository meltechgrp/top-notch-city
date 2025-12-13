import { Listing } from "@/store";
import { getActiveToken } from "@/lib/secureStore";
import config from "@/config";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadProperty(type: "edit" | "add", propertyId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (listing: Listing) => {
      const token = await getActiveToken();
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
        viewType,
        bathroom,
        bedType,
        bedroom,
        discount,
        landarea,
        guests,
        plots,
        owner_type,
        listing_role,
        ownership_document_ids,
        companies,
        caution_fee,
      } = listing;
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);
      if (currency) formData.append("currency_code", currency.code);
      if (price) formData.append("price", price);
      if (viewType) formData.append("viewType", viewType);
      if (bathroom) formData.append("bathroom", bathroom);
      if (bedroom) formData.append("bedroom", bedroom);
      if (bedType) formData.append("bedType", bedType);
      if (discount) formData.append("discount", discount);
      if (landarea) formData.append("landarea", landarea);
      if (guests) formData.append("guests", guests);
      if (plots) formData.append("plots", plots);
      if (caution_fee) formData.append("caution_fee", caution_fee);
      if (ownership_document_ids)
        formData.append("ownership_document_ids", ownership_document_ids);
      if (companies) formData.append("companies", JSON.stringify(companies));
      if (owner_type) formData.append("owner_type", owner_type);
      if (listing_role) formData.append("listing_role", listing_role);
      if (duration) formData.append("duration", duration);
      if (category) formData.append("property_category_name", category);
      if (subCategory)
        formData.append("property_subcategory_name", subCategory);
      if (purpose) formData.append("purpose", purpose);

      if (address) {
        formData.append("latitude", address?.location.latitude.toString());
        formData.append("longitude", address?.location.longitude.toString());
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
        formData.append("amenity_names", fac);
        formData.append("amenity_values", "true");
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
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
              },
            }
          );
        }
      } catch (error: any) {
        console.log(error);
        throw Error(error?.message || "Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      if (propertyId) {
        queryClient.invalidateQueries({ queryKey: ["properties", propertyId] });
      }
    },
    onError: (e) => console.log(e),
  });

  return {
    uploading: mutation.isPending,
    error: mutation.error?.message ?? null,
    success: mutation.isSuccess,
    uploadProperty: mutation.mutateAsync,
  };
}
