import { Text, View } from "@/components/ui";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { Pressable } from "react-native";
import { composeFullAddress, showSnackbar } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "@/actions/agent";

type Props = {
  request: AgentReview;
  onPress: (user: Props["request"]) => void;
};

export default function RequestListItem({ request, onPress }: Props) {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });
  return (
    <>
      <SwipeableWrapper
        leftAction={
          request.status === "pending"
            ? async () => {
                if (request.status !== "pending") return null;
                await mutateAsync(
                  {
                    application_id: request?.id,
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
              }
            : undefined
        }
      >
        <Pressable
          onPress={() => {
            onPress(request);
          }}
          className="bg-background-muted rounded-xl p-4 border border-outline"
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">
              {request.firstname} {request.lastname}
            </Text>
            <Text
              className={`text-xs px-2 py-1 rounded-full ${
                request.status === "pending"
                  ? "bg-primary text-white"
                  : request.status === "approved"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
              }`}
            >
              {request.status.toUpperCase()}
            </Text>
          </View>
          <Text className="text-sm text-typography">
            {composeFullAddress(request)}
          </Text>
        </Pressable>
      </SwipeableWrapper>
    </>
  );
}
