import { Avatar, AvatarImage, Text, View } from "@/components/ui";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { Pressable } from "react-native";
import { composeFullAddress, fullName } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "@/actions/agent";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { generateMediaUrlSingle } from "@/lib/api";
import { router } from "expo-router";

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
                    application_id: request.application_id,
                  },
                  {
                    onSettled: () =>
                      showErrorAlert({
                        title: "Applcation deleted successfully",
                        alertType: "success",
                      }),
                    onError: () =>
                      showErrorAlert({
                        title: "Error occuried, try again!",
                        alertType: "error",
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
          className="bg-background-muted flex-row gap-4 items-center rounded-xl p-4 border border-outline"
        >
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/admin/users/[userId]",
                params: {
                  userId: request.user.id,
                },
              })
            }
          >
            <Avatar>
              <AvatarImage
                source={{
                  uri: generateMediaUrlSingle(request.user.profile_image),
                }}
              />
            </Avatar>
          </Pressable>
          <View className=" flex-1">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">
                {fullName(request.user)}
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
              {request.user.email}
            </Text>
          </View>
        </Pressable>
      </SwipeableWrapper>
    </>
  );
}
