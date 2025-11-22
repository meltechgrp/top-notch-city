import { useUser } from "@/hooks/useUser";
import {
  Users,
  Film,
  Bookmark,
  MessageCircle,
  LayoutDashboard,
  Share2,
  LucideIcon,
  ReceiptText,
  ChartBarStacked,
  Bath,
  MessageSquareWarning,
  Ban,
  ChartColumn,
} from "lucide-react-native";

export const getQuickMenuItems = () => {
  const { me, isAdmin, isAgent } = useUser();
  const data: MenuProps[] = [
    // Users
    { label: "Find Agents", icon: Users, link: "/agents", role: "all" },
    { label: "Saved", icon: Bookmark, link: `/profile`, role: "user" },
    { label: "Reels", icon: Film, link: "/reels", role: "all" },
    { label: "Invite Friends", icon: Share2, link: "/invite", role: "all" },
    {
      label: "Messages",
      icon: MessageCircle,
      link: "/chats",
      role: "user",
      badge: "",
    },
    {
      label: "Enquiry/Report",
      icon: ReceiptText,
      link: "/enquiry",
      role: "all",
    },
    // Agent
    {
      label: "Analytics",
      icon: ChartColumn,
      link: "/agent/analytics",
      role: "agent",
    },
    { label: "Invite Friends", icon: Share2, link: "/invite", role: "agent" },
    {
      label: "Messages",
      icon: MessageCircle,
      link: "/chats",
      role: "agent",
      badge: "",
    },
    {
      label: "My Properties",
      icon: ReceiptText,
      link: "/agent/properties",
      role: "agent",
    },
    // Admin
    {
      label: "Analytics",
      icon: ChartColumn,
      link: "/admin/analytics",
      role: "admin",
    },
    {
      label: "Categories",
      icon: ChartBarStacked,
      link: "/admin/properties",
      role: "admin",
    },
    {
      label: "Amenities",
      icon: Bath,
      link: "/admin/dashboard",
      role: "admin",
    },
    {
      label: "Enquires/Reports",
      icon: MessageSquareWarning,
      link: "/admin/properties",
      role: "admin",
    },
    {
      label: "Block/Ban",
      icon: Ban,
      link: "/admin/properties",
      role: "admin",
    },
  ];
  if (isAgent) {
    return data.filter((m) => m.role == "agent");
  } else if (isAdmin) {
    return data.filter((m) => m.role == "admin");
  } else if (me) {
    return data.filter((m) => m.role == "all" || m.role == "user");
  } else {
    return data.filter((m) => m.role == "all");
  }
};

type MenuProps = {
  label: string;
  icon: LucideIcon;
  link?: string;
  role?: "user" | "admin" | "agent" | "all";
  auth?: boolean;
  badge?: string;
};
