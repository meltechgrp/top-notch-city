import { View } from "react-native";
import { format } from "date-fns";
import { fullName } from "@/lib/utils";
import BottomSheet from "@/components/shared/BottomSheet";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  Heading,
  Text,
} from "@/components/ui";
import { getImageUrl } from "@/lib/api";
import withRenderVisible from "@/components/shared/withRenderOpen";
import { capitalize } from "lodash-es";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmail } from "@/actions/user";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type UserDetailsBottomSheetProps = {
  visible: boolean;
  user: Me;
  onDismiss: () => void;
};

function UserDetailsBottomSheet(props: UserDetailsBottomSheetProps) {
  const { visible, user, onDismiss } = props;
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: verifyEmail,
  });
  return (
    <BottomSheet onDismiss={onDismiss} visible={visible} snapPoint={["44%"]}>
      <View className="flex-1 gap-y-2 pb-8 px-4">
        <View className="flex-row gap-4 pb-2 justify-between items-center">
          <Avatar className=" w-14 h-14">
            <AvatarFallbackText>{fullName(user)}</AvatarFallbackText>
            <AvatarImage source={getImageUrl(user?.profile_image)} />
          </Avatar>
          <View className="flex-1 gap-1">
            <Heading className="text-base capitalize">{fullName(user)}</Heading>
            <Text className="text-gray-400 text-xs">
              {capitalize(user.email)}
            </Text>
          </View>
          {!user.verified && (
            <Button
              onPress={async () => {
                await mutateAsync(
                  {
                    user_id: user.id,
                  },
                  {
                    onSuccess(data) {
                      if (data?.message) {
                        onDismiss();
                        queryClient.invalidateQueries({ queryKey: ["users"] });
                        showErrorAlert({
                          title: data.message,
                          alertType: "success",
                        });
                      }
                    },
                    onError: () => {
                      showErrorAlert({
                        title: "Something went wrong. Try again!",
                        alertType: "error",
                      });
                    },
                  }
                );
              }}
            >
              {isPending && <SpinningLoader />}
              <Text>Verify Account</Text>
            </Button>
          )}
        </View>
        <View className="w-full h-[1px] bg-outline" />
        <View className=" mt-2 pb-2 gap-y-4 ">
          <View className="flex-row justify-between items-center">
            <Text className="">Joined at:</Text>
            <Text className="">
              {format(new Date(user.created_at), "dd MMM yyyy")}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="">Phone Number:</Text>
            <Text className="">{user.phone ?? "N/A"}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="">Gender:</Text>
            <Text className="">{user.gender ?? "N/A"}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="">Role:</Text>
            <Text className=" capitalize">{user.role}</Text>
          </View>
        </View>
        <View className="w-full h-[1px] bg-outline" />
      </View>
    </BottomSheet>
  );
}

export default withRenderVisible(UserDetailsBottomSheet);
