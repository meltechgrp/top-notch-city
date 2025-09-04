import { Fetch } from "../utills";

export const fetchAllAmenities = async (): Promise<AmenityLabel[]> => {
  try {
    const res = await Fetch(`/amenity-labels/`, {});
    return res as AmenityLabel[];
  } catch (error) {
    throw new Error("Failed to fetch amenity labels");
  }
};

export const addAmenity = async ({
  name,
  type,
  category,
}: {
  name: string;
  type: string;
  category: string;
}) => {
  try {
    const res = await Fetch(`/amenity-labels/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { name, type, category },
    });

    if (res?.detail) throw new Error("Failed to add amenity");
    return true;
  } catch (error) {
    throw error;
  }
};
export const editAmenity = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name: string;
    type: string;
    category: string;
  };
}) => {
  try {
    const res = await Fetch(`/amenity-labels/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });

    if (res?.detail) throw new Error("Failed to edit amenity");
    return true;
  } catch (error) {
    throw error;
  }
};
export const deleteAmenity = async ({ id }: { id: string }) => {
  try {
    const res = await Fetch(`/amenity-labels/${id}`, {
      method: "DELETE",
    });

    if (res?.detail) throw new Error("Failed to delete amenity");
    return true;
  } catch (error) {
    throw error;
  }
};
