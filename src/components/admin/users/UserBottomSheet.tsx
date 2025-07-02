import { View } from "react-native";
import { format } from "date-fns";
import { fullName, showSnackbar } from "@/lib/utils";
import BottomSheet from "@/components/shared/BottomSheet";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Heading,
  Icon,
  Pressable,
  Text,
} from "@/components/ui";
import { getImageUrl } from "@/lib/api";
import withRenderVisible from "@/components/shared/withRenderOpen";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { capitalize } from "lodash-es";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmail } from "@/actions/user";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

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
  const router = useRouter();
  return (
    <BottomSheet onDismiss={onDismiss} visible={visible} snapPoint={["60%"]}>
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
                        showSnackbar({
                          message: data.message,
                          type: "info",
                          backdrop: false,
                        });
                      }
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
        <View className="gap-4 flex-1 mt-4">
          <View className="flex-row gap-4">
            <Pressable className="flex-1 h-20 gap-2 justify-center items-center rounded-xl bg-background-muted">
              <Heading size="xl" className="text-primary">
                0
              </Heading>
              <Text className=" text-md">Uploaded</Text>
            </Pressable>
            <Pressable className="flex-1 h-20 gap-2 justify-center items-center rounded-xl bg-background-muted">
              <Heading size="xl" className="text-primary">
                0
              </Heading>
              <Text className=" text-md">Views</Text>
            </Pressable>
            <Pressable className="flex-1 h-20 gap-2 justify-center items-center rounded-xl bg-background-muted">
              <Heading size="xl" className="text-primary">
                0
              </Heading>
              <Text className=" text-md">Saved</Text>
            </Pressable>
          </View>
          <View className="flex-row gap-4">
            <Pressable className="flex-1 h-20 gap-2 justify-center items-center rounded-xl bg-background-muted">
              <Heading size="xl" className="text-primary">
                0
              </Heading>
              <Text className=" text-md">Sold</Text>
            </Pressable>
            <Pressable className="flex-1 h-20 gap-2 justify-center items-center rounded-xl bg-background-muted">
              <Heading size="xl" className="text-primary">
                0
              </Heading>
              <Text className=" text-md">Reports</Text>
            </Pressable>
            <Pressable className="flex-1 h-20 gap-2 justify-center items-center rounded-xl bg-background-muted">
              <Heading size="xl" className="text-primary">
                0
              </Heading>
              <Text className=" text-md">Messages</Text>
            </Pressable>
          </View>
        </View>
        <View>
          <Button
            className="h-12 gap-1"
            onPress={() =>
              router.push({
                pathname: "/profile/[user]",
                params: {
                  user: user.id,
                },
              })
            }
          >
            <ButtonText>View Profile</ButtonText>
            <Icon as={ChevronRight} color="white" />
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

export default withRenderVisible(UserDetailsBottomSheet);
