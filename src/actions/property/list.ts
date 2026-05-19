import { Fetch } from "../utills";

// Fetch all properties (paginated)
export async function fetchProperties({
  pageParam,
  perPage,
  category,
  search,
  status,
}: {
  pageParam: number;
  perPage?: number;
  category?: string;
  search?: string;
  status?: string;
}) {
  try {
    const query = new URLSearchParams();
    query.append("page", String(pageParam));
    query.append("per_page", String(perPage));
    if (category) query.append("category", category);
    if (search) query.append("search", search);
    if (status) query.append("status", status);

    const res = await Fetch(`/properties?${query.toString()}`, {});
    if (res?.detail) throw new Error("Failed to fetch properties");
    return res as Result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch properties");
  }
}
// Fetch all featured properties (paginated)
export async function fetchFeaturedProperties({
  pageParam,
  perPage,
}: {
  pageParam: number;
  perPage?: number;
}) {
  try {
    const res = await Fetch(
      `/properties/featured?page=${pageParam}&per_page=${perPage}`,
      {},
    );
    if (res?.detail) throw new Error("Failed to fetch properties");
    return res as Result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch properties");
  }
}
// Fetch all Shortlet properties (paginated)
export async function fetchShortletProperties({
  pageParam,
  perPage,
}: {
  pageParam: number;
  perPage?: number;
}) {
  try {
    const res = await Fetch(
      `/properties/shortlet-hotel?page=${pageParam}&per_page=${perPage}`,
      {},
    );
    if (res?.detail) throw new Error("Failed to fetch properties");
    return res as Result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch properties");
  }
}
// Fetch all trending properties (paginated)
export async function fetchTrendingLandsProperties({
  pageParam,
  perPage,
}: {
  pageParam: number;
  perPage?: number;
}) {
  try {
    const res = await Fetch(
      `/properties/home/land?page=${pageParam}&per_page=${perPage}`,
      {},
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
      {},
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
      {},
    );
    if (res?.detail) throw new Error("Failed to fetch properties");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch properties");
  }
}
export async function fetchPendingProperties({
  pageParam,
  perPage = 20,
  search,
}: {
  pageParam: number;
  perPage?: number;
  search?: string;
}) {
  try {
    const query = new URLSearchParams();
    query.append("page", String(pageParam));
    query.append("per_page", String(perPage));
    if (search) query.append("search", search);
    const res = await Fetch(
      `/admin/pending/properties?${query.toString()}`,
      {},
    );
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
  perPage = 20,
  status,
  search,
}: {
  userId?: string;
  pageParam: number;
  perPage?: number;
  status?: string;
  search?: string;
}) {
  try {
    const query = new URLSearchParams();
    query.append("page", String(pageParam));
    query.append("per_page", String(perPage));
    if (status && status !== "all") query.append("status", status);
    if (search) query.append("search", search);

    const res = await Fetch(`/user/${userId}?${query.toString()}`, {});
    if (res?.detail) throw new Error("Failed to fetch user properties");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch user properties");
  }
}
// 👤 Fetch agent properties (paginated)
export async function fetchAgentProperties({
  pageParam = 1,
  perPage = 10,
  agentId,
  status,
  search,
}: {
  pageParam: number;
  perPage?: number;
  agentId?: string;
  status?: string;
  search?: string;
  updated_after?: number;
}) {
  try {
    const query = new URLSearchParams();
    query.append("page", String(pageParam));
    query.append("per_page", String(perPage));
    if (agentId) query.append("agent_id", agentId);
    if (status && status !== "all") query.append("status", status);
    if (search) query.append("search", search);

    const path = agentId
      ? `/properties?${query.toString()}`
      : `/agent/my-properties?${query.toString()}`;
    const res = await Fetch(path, {});
    if (res?.detail) throw new Error("Failed to fetch user properties");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch user properties");
  }
}

// 👨‍💼 Fetch admin properties (paginated)
export async function fetchAdminProperties({
  pageParam,
  perPage = 10,
  status,
  search,
  agentId,
}: {
  pageParam: number;
  perPage?: number;
  status?: string;
  search?: string;
  agentId?: string;
  updated_after?: number;
}) {
  try {
    const query = new URLSearchParams();
    query.append("page", String(pageParam));
    query.append("per_page", String(perPage));
    if (status && status !== "all") query.append("status", status);
    if (search) query.append("search", search);
    if (agentId) query.append("agent_id", agentId);

    const res = await Fetch(`/admin/properties?${query.toString()}`, {});
    if (res?.detail) throw new Error("Failed to fetch admin properties");
    return res as Result;
  } catch (error) {
    throw new Error("Failed to fetch admin properties");
  }
}
