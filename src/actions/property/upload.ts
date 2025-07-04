import { Listing, UploadedFile } from "@/store";
import { Fetch } from "../utills";
import { getAuthToken } from "@/lib/secureStore";
import config from "@/config";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export async function updatePropertyBasicInfo(
  propertyId: string,
  data: Partial<Listing>
) {
  try {
    const formData = new FormData();
    if (data.price) formData.append("price", data.price);
    if (data.purpose) formData.append("purpose", data.purpose);
    if (data.category) formData.append("property_category_name", data.category);
    if (data.subCategory)
      formData.append("property_subcategory_name", data.subCategory);
    if (data.currency) formData.append("currency", data.currency); // optional, if used

    const res = await Fetch(`/properties/${propertyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    if (res?.detail) {
      throw new Error("Failed to update property");
    }

    return res;
  } catch (error) {
    console.error("Property update failed:", error);
    throw error;
  }
}

export async function updatePropertyDescription(
  propertyId: string,
  description: string
) {
  try {
    const formData = new FormData();
    formData.append("description", description);

    const res = await Fetch(`/properties/${propertyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    if (res?.detail) throw new Error("Failed to update description");

    return res;
  } catch (error) {
    console.error("Update description failed:", error);
    throw error;
  }
}

export const updatePropertyLocation = async ({
  propertyId,
  location,
}: {
  propertyId: string;
  location: GooglePlace;
}) => {
  const token = getAuthToken();

  const body = {
    street: location?.addressComponents?.street || "",
    city: location?.addressComponents?.city || "",
    state: location?.addressComponents?.state || "",
    country: location?.addressComponents?.country || "",
    latitude: location?.location?.latitude,
    longitude: location?.location?.longitude,
  };

  const res = await axios.put(
    `${config.origin}/api/properties/${propertyId}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return res.data;
};

export async function updatePropertyMedia({
  propertyId,
  data,
}: {
  propertyId: string;
  data: UploadedFile[];
}) {
  const token = getAuthToken();
  const formData = new FormData();

  data.forEach((item, index) => {
    formData.append("media", {
      uri: item.uri,
      name: `property-photo-${index}.jpg`,
      type: "image/jpeg",
    } as any);
  });

  const res = await axios.put(
    `${config.origin}/api/properties/${propertyId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!res.data?.property_id) {
    throw new Error("Failed to update photos");
  }

  return res.data;
}
export async function updatePropertyFacilities({
  propertyId,
  data,
}: {
  propertyId: string;
  data: {
    label: string;
    icon: string;
    value: any;
  }[];
}) {
  const token = getAuthToken();
  const formData = new FormData();

  data?.forEach((fac) => {
    formData.append("amenity_names", fac.label);
    formData.append("amenity_values", fac.value.toString());
    formData.append("amenity_icons", fac.icon);
  });

  const res = await axios.put(
    `${config.origin}/api/properties/${propertyId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!res.data?.property_id) {
    throw new Error("Failed to update photos");
  }

  return res.data;
}

export function useUploadProperty() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (listing: Listing) => {
      const token = getAuthToken();
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
      } = listing;

      formData.append("title", "property");
      if (description) formData.append("description", description);
      if (price) formData.append("price", price);
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

      photos?.forEach((item) => {
        formData.append("media", {
          uri: item.uri,
          name: `image.jpg`,
          type: "image/jpeg",
        } as any);
      });

      videos?.forEach((item) => {
        formData.append("media", {
          uri: item.uri,
          name: `video.mp4`,
          type: "video/mp4",
        } as any);
      });

      facilities?.forEach((fac) => {
        formData.append("amenity_names", fac.label);
        formData.append("amenity_values", fac.value.toString());
        formData.append("amenity_icons", fac.icon);
      });

      const res = await axios.post(
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

      const result = res.data;

      if (result?.detail) {
        throw new Error("Please verify your property details");
      }

      if (result?.property_id) {
        return result;
      }

      throw new Error("Something went wrong, please try again");
    },
    onSuccess: () => {
      // Invalidate `properties` query so it's refetched
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
