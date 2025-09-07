import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Text,
  View,
} from "@/components/ui";
import BottomSheet from "@/components/shared/BottomSheet";
import { generateMediaUrl } from "@/lib/api";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptApplication } from "@/actions/agent";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { showErrorAlert } from "@/components/custom/CustomNotification";

interface ApplicationBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  agent: AgentReview | null;
}

export default function ApplicationBottomSheet({
  visible,
  onDismiss,
  agent,
}: ApplicationBottomSheetProps) {
  if (!agent) return null;
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: acceptApplication,
  });
  return (
    <BottomSheet
      title="Agent Application"
      withHeader={true}
      snapPoint={"60%"}
      visible={visible}
      withScroll
      onDismiss={onDismiss}
    >
      <View className="flex-1 gap-4 p-4 pb-8 bg-background">
        <View className="flex-row gap-4 items-center">
          <Avatar>
            <AvatarFallbackText>
              {agent.firstname?.charAt(0)} {agent.lastname?.charAt(0)}
            </AvatarFallbackText>
            <AvatarImage
              source={generateMediaUrl({
                url: agent.photo,
                id: "",
                media_type: "IMAGE",
              })}
            />
          </Avatar>
          <Text className="text-xl font-bold mb-2">
            {agent.firstname} {agent.lastname}
          </Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">NIN:</Text>
          <Text className="text-base">{agent.nin}</Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">Phone:</Text>
          <Text className="text-base">{agent.phone}</Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">Birthdate:</Text>
          <Text className="text-base">{agent.birthdate}</Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">Location:</Text>
          <Text className="text-base">
            {agent.city}, {agent.state}, {agent.country}
          </Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">Status:</Text>
          <Text className="text-base capitalize">{agent.status}</Text>
        </View>

        {agent.rejection_reason ? (
          <View className="gap-2 flex-row justify-between items-center">
            <Text className="text-sm font-medium">Rejection Reason:</Text>
            <Text className="text-base">{agent.rejection_reason}</Text>
          </View>
        ) : null}

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">Reviewed By:</Text>
          {/* <Text className="text-base">{agent.reviewed_by}</Text> */}
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">Reviewed At:</Text>
          <Text className="text-base">
            {agent.reviewed_at &&
              format(new Date(agent.reviewed_at), "dd-MMM-yyyy")}
          </Text>
        </View>

        <View className="gap-2 flex-row justify-between items-center">
          <Text className="text-sm font-medium">Created At:</Text>
          <Text className="text-base">
            {agent.created_at &&
              format(new Date(agent.created_at), "dd-MMM-yyyy")}
          </Text>
        </View>
        {agent.status == "pending" && (
          <View className="flex-row gap-4 justify-between mt-5">
            <Button disabled size="xl" className="px-6" variant="outline">
              <ButtonText>Decline</ButtonText>
            </Button>
            <Button
              onPress={async () =>
                await mutateAsync(
                  {
                    application_id: agent.id,
                  },
                  {
                    onSuccess: () => {
                      query.invalidateQueries({
                        queryKey: ["agent-applications"],
                      });
                      showErrorAlert({
                        title: "Application reviewed and marked as approved.",
                        alertType: "success",
                      });
                      onDismiss();
                    },
                  }
                )
              }
              size="xl"
              className="px-6 "
            >
              {isPending && <SpinningLoader />}
              <ButtonText>Accept</ButtonText>
            </Button>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}
