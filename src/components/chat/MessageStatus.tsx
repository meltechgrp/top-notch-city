import { Icon } from "@/components/ui";
import {
  Check,
  CheckCheck,
  CircleAlert,
  Clock,
  Eye,
} from "lucide-react-native";
import { View } from "react-native";

export function MessageStatusIcon({ status }: { status: Message["status"] }) {
  switch (status) {
    case "pending":
      return <Clock size={14} color="gray" />;
    case "error":
      return <CircleAlert size={14} color="red" />;
    case "sent":
      return <Check size={14} color="gray" />;
    case "delivered":
      return <CheckCheck size={14} color="gray" />;
    case "seen":
      return <Icon as={CheckCheck} size="sm" className="ml-1 text-primary" />;
    default:
      return <View />;
  }
}
