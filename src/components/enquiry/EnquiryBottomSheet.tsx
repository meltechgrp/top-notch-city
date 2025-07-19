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
      title={enquiry.full_name}
      withHeader={true}
      snapPoint={"60%"}
      visible={visible}
      withScroll
      onDismiss={onDismiss}
    >
      <View className="flex-1 gap-4 p-4 pb-8 bg-background">
        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-base font-medium">Email:</Text>
          <Text className="text-base">{enquiry.email}</Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-base font-medium">Enquiry type:</Text>
          <View className=" p-2 px-4 bg-primary rounded-xl">
            <Text className="text-base capitalize">{enquiry.type}</Text>
          </View>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-base font-medium">Create at:</Text>
          <Text className="text-base capitalize">
            {format(new Date(enquiry.created_at), "dd MMMM yyyy")}
          </Text>
        </View>

        <View className="gap-2 bg-background-muted p-4 mt-4 rounded-xl">
          <Text className="text-xl font-medium">Message</Text>
          <View className=" ">
            <Text className="text-sm">{enquiry.message}</Text>
          </View>
        </View>
        <View className="gap-2 bg-background-muted p-4 rounded-xl">
          <Text className="text-xl font-medium">Address</Text>
          <View className=" ">
            <Text className="text-sm">{enquiry.address}</Text>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
