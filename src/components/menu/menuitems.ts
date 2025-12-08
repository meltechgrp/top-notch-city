import {
  Users,
  Film,
  Bookmark,
  MessageCircle,
  Share2,
  LucideIcon,
  ReceiptText,
  ChartBarStacked,
  Bath,
  MessageSquareWarning,
  Ban,
  ChartColumn,
  Clock,
} from "lucide-react-native";

type MenuProps = {
  label: string;
  icon: LucideIcon;
  link?: string;
  role?: "user" | "admin" | "agent" | "all";
  auth?: boolean;
  badge?: string;
  description?: string;
};

interface QuickMenuItemsProps {
  me: StoredAccount | undefined;
  isAgent: boolean;
  isAdmin: boolean;
}

export const getQuickMenuItems = ({
  me,
  isAdmin,
  isAgent,
}: QuickMenuItemsProps) => {
  const data: MenuProps[] = [
    // Users
    {
      label: "Find Agents",
      icon: Users,
      link: "/agents",
      role: "all",
      description: "Discover verified agents near you.",
    },
    {
      label: "Saved",
      icon: Bookmark,
      link: `/profile`,
      role: "user",
      description: "Access all your saved properties.",
    },
    {
      label: "Reels",
      icon: Film,
      link: "/reels",
      role: "all",
      description: "Explore short property videos.",
    },
    {
      label: "Invite Friends",
      icon: Share2,
      link: "/share",
      role: "all",
      description: "Share TopNotchCity and earn rewards.",
    },
    {
      label: "Messages",
      icon: MessageCircle,
      link: "/chats",
      role: "user",
      badge: "",
      description: "Chat with agents and property owners.",
    },
    {
      label: "Enquiry/Report",
      icon: ReceiptText,
      link: "/report",
      role: "all",
      description: "Send enquiries or report an issue.",
    },

    // Agent
    {
      label: "Analytics",
      icon: ChartColumn,
      link: `/agents/${me?.id}/analytics`,
      role: "agent",
      description: "Track your performance and insights.",
    },
    {
      label: "Bussiness hours",
      icon: Clock,
      link: "/profile",
      role: "agent",
      description: "Set up your bussiness opening hours",
    },
    {
      label: "Messages",
      icon: MessageCircle,
      link: "/chats",
      role: "agent",
      badge: "",
      description: "Respond to client and buyer messages.",
    },
    {
      label: "My Properties",
      icon: ReceiptText,
      link: `/agents/${me?.id}/properties`,
      role: "agent",
      description: "Manage all your listed properties.",
    },

    // Admin
    {
      label: "Analytics",
      icon: ChartColumn,
      link: "/admin/analytics",
      role: "admin",
      description: "View overall system performance.",
    },
    {
      label: "Categories",
      icon: ChartBarStacked,
      link: "/admin/categories",
      role: "admin",
      description: "Manage property categories and types.",
    },
    {
      label: "Amenities",
      icon: Bath,
      link: "/admin/amenities",
      role: "admin",
      description: "Configure available amenities.",
    },
    {
      label: "Enquires/Reports",
      icon: MessageSquareWarning,
      link: "/admin/reports",
      role: "admin",
      description: "Review enquiries and submitted reports.",
    },
    {
      label: "Block/Ban",
      icon: Ban,
      link: "/admin/users",
      role: "admin",
      description: "Manage blocked or banned users.",
    },
  ];

  if (isAgent) {
    return data.filter((m) => m.role === "agent");
  } else if (isAdmin) {
    return data.filter((m) => m.role === "admin");
  } else if (me) {
    return data.filter((m) => m.role === "all" || m.role === "user");
  } else {
    return data.filter((m) => m.role === "all");
  }
};
