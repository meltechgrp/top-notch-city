import { getActiveToken } from "@/lib/secureStore";
import config from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fetch } from "@/actions/utills";
import { Listing } from "@/store/listing";

export const parseApiError = (data: any, status: number) => {
  if (data?.detail) {
    if (typeof data?.detail == "string") {
      const parts = data?.detail?.split(":");
      return parts[2]?.trim() || data.detail;
    } else if (Array.isArray(data?.detail)) {
      data?.detail.forEach((e: any) => {
        console.log(e);
      });
      return `Please fill all non optional fields`;
    }
  }
  return `Request failed (${status})`;
};

const buildPropertyFormData = (listing: Listing) => {
  const fd = new FormData();
  if (listing?.title) fd.append("title", listing.title);
  if (listing?.description) fd.append("description", listing.description);
  if (listing?.price) fd.append("price", listing.price);
  if (listing?.discount) fd.append("discount", listing.discount);
  if (listing?.bathroom) fd.append("bathroom", listing.bathroom);
  if (listing?.bedroom) fd.append("bedroom", listing.bedroom);
  if (listing?.bedType) fd.append("bedType", listing.bedType);
  if (listing?.landarea) fd.append("landarea", listing.landarea);
  if (listing?.guests) fd.append("guests", listing.guests);
  if (listing?.plots) fd.append("plots", listing.plots);
  if (listing?.duration) fd.append("duration", listing.duration);
  if (listing?.purpose) fd.append("purpose", listing.purpose);
  if (listing?.viewType) fd.append("viewType", listing.viewType);
  if (listing?.owner_type) fd.append("owner_type", listing.owner_type);
  if (listing?.listing_role) fd.append("listing_role", listing.listing_role);
  if (listing?.caution_fee) fd.append("caution_fee", listing.caution_fee);

  if (listing.currency) fd.append("currency_code", listing.currency);

  if (listing.category) fd.append("property_category_name", listing.category);

  if (listing.subCategory)
    fd.append("property_subcategory_name", listing.subCategory);

  if (listing.address) {
    const { location, addressComponents, placeId, displayName } =
      listing.address;

    if (location?.latitude)
      fd.append("latitude", location?.latitude.toString());
    if (location?.longitude)
      fd.append("longitude", location?.longitude.toString());

    if (addressComponents.city) fd.append("city", addressComponents.city);
    if (displayName) fd.append("display_address", displayName);
    if (addressComponents.state) fd.append("state", addressComponents.state);
    if (addressComponents.country)
      fd.append("country", addressComponents.country);
    if (addressComponents.street) fd.append("street", addressComponents.street);
    if (placeId) fd.append("place_id", placeId);
  }

  if (listing.availabilityPeriod) {
    fd.append("availability", JSON.stringify(listing.availabilityPeriod));
  }

  listing.facilities?.forEach((fac) => {
    fd.append("amenity_names", fac);
  });

  listing.photos?.forEach((img) => {
    fd.append("property_image_ids", img.id);
  });

  listing.videos?.forEach((vid) => {
    fd.append("property_image_ids", vid.id);
  });

  listing.ownership_documents?.forEach((doc) => {
    fd.append("ownership_document_ids", doc.id);
  });

  if (listing.companies?.length) {
    const company = listing.companies[0];
    fd.append("companies", JSON.stringify(company));
  }

  return fd;
};

const uploadPropertyRequest = async (
  listing: Listing,
  type: "add" | "edit",
  propertyId?: string,
) => {
  const token = await getActiveToken();
  const form = buildPropertyFormData(listing);

  const url =
    type === "edit"
      ? `${config.origin}/api/properties/${propertyId}`
      : `${config.origin}/api/properties/`;

  const data = await Fetch(url, {
    method: type === "edit" ? "PUT" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: form,
  });

  if (data?.detail) {
    throw new Error(parseApiError(data, 400));
  }

  return data;
};
export function useUploadProperty(type: "edit" | "add", propertyId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (listing: Listing) =>
      uploadPropertyRequest(listing, type, propertyId),

    onSuccess: (_, __, ___) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["pending-properties"] });

      if (propertyId) {
        queryClient.invalidateQueries({
          queryKey: ["properties", propertyId],
        });
      }
    },
  });

  return {
    uploadProperty: mutation.mutateAsync,
    uploading: mutation.isPending,
    success: mutation.isSuccess,
    error: mutation.error?.message ?? null,
  };
}
