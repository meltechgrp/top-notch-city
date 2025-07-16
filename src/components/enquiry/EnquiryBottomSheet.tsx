import { Text, View } from "@/components/ui";
import BottomSheet from "@/components/shared/BottomSheet";
import { format } from "date-fns";

interface EnquiryBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  enquiry: EnquiryList | null;
}

export default function EnquiryBottomSheet({
  visible,
  onDismiss,
  enquiry,
}: EnquiryBottomSheetProps) {
  if (!enquiry) return null;
  return (
    <BottomSheet
      title="Enquiry"
      withHeader={true}
      snapPoint={"60%"}
      visible={visible}
      withScroll
      onDismiss={onDismiss}
    >
      <View className="flex-1 gap-4 p-4 pb-8 bg-background">
        <View className="flex-row gap-4 items-center">
          <Text className="text-xl font-bold mb-2">{enquiry.full_name}</Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">Email:</Text>
          <Text className="text-base">{enquiry.email}</Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">type:</Text>
          <Text className="text-base">{enquiry.type}</Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">message:</Text>
          <Text className="text-base">{enquiry.message}</Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">address:</Text>
          <Text className="text-base">{enquiry.address}</Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">Create at:</Text>
          <Text className="text-base capitalize">
            {format(new Date(enquiry.created_at), "dd-MMM-yyyy")}
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
}
