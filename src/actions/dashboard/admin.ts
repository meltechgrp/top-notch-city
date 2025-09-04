import { Fetch } from "../utills";

export const fetchAdminDashboardStats = async () => {
  try {
    const res = await Fetch(`/dashboard/admin/summary`, {});
    return res as AdminDashboardStats;
  } catch (error) {
    throw new Error("Failed to fetch subcategories");
  }
};
export const fetchAgentDashboardStats = async () => {
  try {
    const res = await Fetch(`/dashboard/agent/summary`, {});
    return res as AgentDashboardStats;
  } catch (error) {
    throw new Error("Failed to fetch subcategories");
  }
};
