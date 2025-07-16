import { Text, View } from "@/components/ui";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { Pressable } from "react-native";
import { showSnackbar } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEnquiry } from "@/actions/equiry";

type Props = {
  enquiry: EnquiryList;
  onPress: (user: Props["enquiry"]) => void;
};

export default function EnquiryListItem({ enquiry, onPress }: Props) {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteEnquiry,
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["reports"],
      });
    },
  });
  return (
    <>
      <SwipeableWrapper
        leftAction={async () => {
          await mutateAsync(
            {
              enquiry_id: enquiry?.id,
            },
            {
              onSettled: () =>
                showSnackbar({
                  message: "Applcation deleted successfully",
                  type: "success",
                }),
              onError: () =>
                showSnackbar({
                  message: "Error occuried, try again!",
                  type: "error",
                }),
            }
          );
        }}
      >
        <Pressable
          onPress={() => {
            onPress(enquiry);
          }}
          className="bg-background-muted rounded-xl p-4 border border-outline"
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">{enquiry.full_name}</Text>
          </View>
          <Text numberOfLines={1} className="text-sm text-typography">
            {enquiry.message}
          </Text>
        </Pressable>
      </SwipeableWrapper>
    </>
  );
}
