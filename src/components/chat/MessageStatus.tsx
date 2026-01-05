import { Icon } from "@/components/ui";
import { Message } from "@/db/models/messages";
import { Check, CheckCheck, CircleAlert, Clock } from "lucide-react-native";
import { View } from "react-native";

export function MessageStatusIcon({ status }: { status: Message["status"] }) {
  switch (status) {
    case "pending":
      return <Icon as={Clock} size="sm" className="text-gray-400" />;
    case "failed":
      return <Icon as={CircleAlert} size={"sm"} className="text-info-100" />;
    case "sent":
      return <Icon as={Check} size="sm" className="text-gray-400" />;
    case "delivered":
      return <Icon as={CheckCheck} size="sm" className="text-gray-400" />;
    case "seen":
      return <Icon as={CheckCheck} size="sm" className=" text-primary" />;
    default:
      return <View />;
  }
}
