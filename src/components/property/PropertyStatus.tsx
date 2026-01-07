import { Property } from "@/db/models/properties";
import { Badge, Text } from "../ui";

export function PropertyStatus({ status }: { status: Property["status"] }) {
  switch (status) {
    case "featured":
      return (
        <Badge size="lg" className=" bg-gray-500 rounded-full px-3 py-1">
          <Text className="text-white">Featured</Text>
        </Badge>
      );
    case "pending":
      return (
        <Badge
          size="lg"
          className="rounded-full"
          variant="solid"
          action="error"
        >
          <Text className="text-white">Pending</Text>
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          size="lg"
          variant="solid"
          className="rounded-full"
          action="error"
        >
          <Text className="text-white">Rejected</Text>
        </Badge>
      );
    case "flagged":
      return (
        <Badge
          size="lg"
          variant="solid"
          className="rounded-full"
          action="error"
        >
          <Text className="text-white">Flagged</Text>
        </Badge>
      );
    case "expired":
      return (
        <Badge
          size="lg"
          variant="solid"
          className="rounded-full"
          action="error"
        >
          <Text className="text-white">Expired</Text>
        </Badge>
      );
    case "approved":
      return (
        <Badge
          size="lg"
          variant="solid"
          className="rounded-full"
          action="success"
        >
          <Text className="text-white">Approved</Text>
        </Badge>
      );
    case "sold":
      return (
        <Badge
          size="lg"
          variant="solid"
          className="rounded-full"
          action="muted"
        >
          <Text className="text-white">Sold</Text>
        </Badge>
      );
    default:
      return <></>;
  }
}
