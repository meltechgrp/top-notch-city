import { Fetch } from "../utills";

export const fetchAllAmenities = async (): Promise<AmenityLabel[]> => {
  try {
    const res = await Fetch(`/amenity-labels/`, {});
    return res as AmenityLabel[];
  } catch (error) {
    throw new Error("Failed to fetch amenity labels");
  }
};

export const addAmenity = async (name: string) => {
  try {
    const res = await Fetch(`/amenity-labels/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { name },
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
  data: string;
}) => {
  try {
    const res = await Fetch(`/amenity-labels/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: { name: data },
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

export const fetchAllViewTypes = async (): Promise<ViewType[]> => {
  try {
    const res = await Fetch(`/list/all/viewtypes?page=1&per_page=50`, {});
    return res as ViewType[];
  } catch (error) {
    throw new Error("Failed to fetch view types labels");
  }
};
export const fetchAllBedTypes = async (): Promise<BedType[]> => {
  try {
    const res = await Fetch(`/list/all/bedtypes?page=1&per_page=50`, {});
    return res as BedType[];
  } catch (error) {
    throw new Error("Failed to fetch view types labels");
  }
};

export const fetchAllAgentCompanies = async (): Promise<Company[]> => {
  try {
    const res = await Fetch(`/agent/companies`, {});
    return res as Company[];
  } catch (error) {
    throw new Error("Failed to fetch view types labels");
  }
};
