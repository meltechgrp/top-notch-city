import { BadgeCheck, Ban, CheckCheck, CircleDashed } from "lucide-react-native";
import { Badge, BadgeIcon, BadgeText } from "../ui";

export function PropertyStatus({ status }: { status: Property["status"] }) {
  switch (status) {
    case "featured":
      return (
        <Badge size="lg" className=" bg-gray-500 rounded-xl px-3 py-1">
          <BadgeText className="text-white">Featured</BadgeText>
        </Badge>
      );
    case "pending":
      return (
        <Badge size="lg" variant="solid" action="error">
          <BadgeText>Pending</BadgeText>
          <BadgeIcon as={CircleDashed} className="ml-2" />
        </Badge>
      );
    case "rejected":
      return (
        <Badge size="lg" variant="solid" action="error">
          <BadgeText>Rejected</BadgeText>
          <BadgeIcon as={Ban} className="ml-2" />
        </Badge>
      );
    case "flagged":
      return (
        <Badge size="lg" variant="solid" action="error">
          <BadgeText>Flagged</BadgeText>
          <BadgeIcon as={Ban} className="ml-2" />
        </Badge>
      );
    case "expired":
      return (
        <Badge size="lg" variant="solid" action="error">
          <BadgeText>Expired</BadgeText>
          <BadgeIcon as={Ban} className="ml-2" />
        </Badge>
      );
    case "approved":
      return (
        <Badge size="lg" variant="solid" action="success">
          <BadgeText>Approved</BadgeText>
          <BadgeIcon as={CheckCheck} className="ml-2" />
        </Badge>
      );
    case "sold":
      return (
        <Badge size="lg" variant="solid" action="muted">
          <BadgeText>Sold</BadgeText>
          <BadgeIcon as={BadgeCheck} className="ml-2" />
        </Badge>
      );
    default:
      return <></>;
  }
}
