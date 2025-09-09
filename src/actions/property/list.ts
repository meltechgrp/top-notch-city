import { Fetch } from "../utills";

// 🏠 Fetch all properties (paginated)
export async function fetchProperties({
  pageParam,
  perPage,
}: {
  pageParam: number;
  perPage?: number;
}) {
  try {
    const res = await Fetch(
      `/properties?page=${pageParam}&per_page=${perPage}`,
      {}
    );
    if (res?.detail) throw new Error("Failed to fetch properties");
    return res as Result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch properties");
  }
}
export async function fetchReels({
  pageParam,
  perPage = 10,
}: {
  pageParam: number;
  perPage?: number;
}) {
  try {
    const res = await Fetch(
      `/properties/videos?page=${pageParam}&per_page=${perPage}`,
      {}
    );
    if (res?.detail) throw new Error("Failed to fetch properties");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch properties");
  }
}
export async function fetchLands({
  pageParam,
  perPage = 10,
}: {
  pageParam: number;
  perPage?: number;
}) {
  try {
    const res = await Fetch(
      `/properties/land?page=${pageParam}&per_page=${perPage}`,
      {}
    );
    if (res?.detail) throw new Error("Failed to fetch properties");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch properties");
  }
}
export async function fetchPendingProperties({
  pageParam,
}: {
  pageParam: number;
}) {
  try {
    const res = await Fetch(`/admin/pending/properties?page=${pageParam}`, {});
    if (res?.detail) throw new Error("Failed to fetch properties");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch properties");
  }
}

// 👤 Fetch user properties (paginated)
export async function fetchUserProperties({
  userId,
  pageParam,
}: {
  userId?: string;
  pageParam: number;
}) {
  try {
    const res = await Fetch(`/user/${userId}?page=${pageParam}`, {});
    if (res?.detail) throw new Error("Failed to fetch user properties");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch user properties");
  }
}

// 👨‍💼 Fetch admin properties (paginated)
export async function fetchAdminProperties({
  pageParam,
}: {
  pageParam: number;
}) {
  try {
    const res = await Fetch(`/admin/properties?page=${pageParam}`, {});
    if (res?.detail) throw new Error("Failed to fetch admin properties");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch admin properties");
  }
}
