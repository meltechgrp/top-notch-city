import { Alert, View } from "react-native";
import { Button, ButtonText, Icon, Text } from "@/components/ui";
import { TriangleAlert } from "lucide-react-native";
import { useStore } from "@/store";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "@/actions/user";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { useMultiAccount } from "@/hooks/useAccounts";
import { useMe } from "@/hooks/useMe";

export default function DeleteAccount() {
  const { me } = useMe();
  const router = useRouter();
  const { removeAccount } = useMultiAccount();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      showErrorAlert({
        title: "Account deleted successfully",
        alertType: "success",
      });

      await removeAccount(me?.id!);
      router.dismissTo("/home");
    },
    onError: () => {
      showErrorAlert({
        title: "Failed to delete account.. try again",
        alertType: "error",
      });
    },
  });
  async function onDelete() {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!me) {
              return showErrorAlert({
                title: "Account not found",
                alertType: "warn",
              });
            }
            await mutateAsync({
              user_id: me?.id,
            });
          },
        },
      ],
      {}
    );
  }
  return (
    <View className="flex-1 gap-8 p-4 pb-8 bg-background">
      <View className=" gap-4 flex-row">
        <Icon as={TriangleAlert} className="text-primary w-8 h-8" />
        <View className="gap-2">
          <Text size="xl" className="font-medium">
            Deleting your account will:
          </Text>
          <View className="gap-1">
            <View className="flex-row gap-1 items-center">
              <Text>•</Text>
              <Text>Delete your account info and profile photo</Text>
            </View>
            <View className="flex-row gap-1 items-center">
              <Text>•</Text>
              <Text>Delete your uploaded properties</Text>
            </View>
            <View className="flex-row gap-1 items-center">
              <Text>•</Text>
              <Text>Delete your message history on this phone</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex-row gap-4">
        <Button disabled={!me} className="h-11 flex-1" onPress={onDelete}>
          {isPending && <SpinningLoader />}
          <ButtonText className=" text-white">Delete</ButtonText>
        </Button>
      </View>
      <View className="flex-row gap-4">
        <Button
          className="h-11 flex-1 bg-background-muted"
          onPress={() => router.back()}
        >
          <ButtonText className=" text-white">Cancel</ButtonText>
        </Button>
      </View>
    </View>
  );
}
