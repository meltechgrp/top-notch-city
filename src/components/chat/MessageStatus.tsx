import { Icon } from "@/components/ui";
import { Check, CheckCheck, CircleAlert, Clock } from "lucide-react-native";
import { View } from "react-native";

export function MessageStatusIcon({ status }: { status: Message["status"] }) {
  switch (status) {
    case "pending":
      return <Icon as={Clock} size="md" className="text-gray-400" />;
    case "failed":
      return <Icon as={CircleAlert} size={"md"} className="text-info-100" />;
    case "sent":
      return <Icon as={Check} size="md" className="text-gray-400" />;
    case "delivered":
      return <Icon as={CheckCheck} size="md" className="text-gray-400" />;
    case "seen":
      return <Icon as={CheckCheck} size="md" className=" text-primary" />;
    default:
      return <View />;
  }
}
