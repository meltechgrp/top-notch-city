import React, { useState } from "react";
import { View, Alert } from "react-native";
import BottomSheet from "@/components/shared/BottomSheet";
import { Button, Icon, Text } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, updateRole, verifyEmail } from "@/actions/user";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { Ban, Check, ChevronDown, Trash, User } from "lucide-react-native";
import UserRolesBottomSheet from "@/components/admin/users/UserRolesBottomSheet";
import { router } from "expo-router";

type UserActionsBottomSheetProps = {
  visible: boolean;
  user: Me;
  onDismiss: () => void;
};

export function UserActionsBottomSheet({
  visible,
  user,
  onDismiss,
}: UserActionsBottomSheetProps) {
  const queryClient = useQueryClient();
  const [showRoles, setShowRoles] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: verifyEmail,
  });
  const { mutateAsync: mutateDelete, isPending: deleting } = useMutation({
    mutationFn: deleteUser,
  });
  const { mutateAsync: mutateSuspend, isPending: suspending } = useMutation({
    mutationFn: verifyEmail,
  });

  const { mutateAsync: mutateRole, isPending: roling } = useMutation({
    mutationFn: updateRole,
  });
  const handleVerify = () => {
    Alert.alert(
      "Confirm Verification",
      "Are you sure you want to verify this account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Verify",
          style: "default",
          onPress: async () => {
            await mutateAsync(
              { user_id: user.id },
              {
                onSuccess(data) {
                  if (data?.message) {
                    queryClient.invalidateQueries({
                      queryKey: ["user", user.id],
                    });
                    showErrorAlert({
                      title: data.message,
                      alertType: "success",
                    });
                    onDismiss();
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
          },
        },
      ]
    );
  };

  const handleSuspend = () => {
    Alert.alert(
      "Confirm Suspension",
      "Are you sure you want to suspend this account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Suspend",
          style: "destructive",
          onPress: async () => {
            await mutateSuspend(
              { user_id: user.id },
              {
                onSuccess(data) {
                  if (data?.message) {
                    onDismiss();
                    queryClient.invalidateQueries({
                      queryKey: ["user", user.id],
                    });
                    showErrorAlert({
                      title: "Account suspended successfully",
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
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "This action cannot be undone. Delete account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await mutateDelete(
              { user_id: user.id },
              {
                onSuccess(data) {
                  if (data?.message) {
                    queryClient.invalidateQueries({
                      queryKey: ["user", user.id],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["users"],
                    });
                    showErrorAlert({
                      title: "Account deleted successfully",
                      alertType: "success",
                    });
                    onDismiss();
                    router.back();
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
          },
        },
      ]
    );
  };

  async function handleRole(val: Me["role"]) {
    Alert.alert(
      "Confirm User Role",
      "Are you sure you want to change this user role?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Change",
          style: "default",
          onPress: async () => {
            console.log(val);
            await mutateRole(
              { user_id: user.id, role: val },
              {
                onSuccess(data) {
                  if (data) {
                    onDismiss();
                    queryClient.invalidateQueries({
                      queryKey: ["user", user.id],
                    });
                    showErrorAlert({
                      title: data,
                      alertType: "success",
                    });
                  }
                },
                onError: (e) => {
                  console.log(e);
                  showErrorAlert({
                    title: "Something went wrong. Try again!",
                    alertType: "error",
                  });
                },
              }
            );
          },
        },
      ]
    );
  }
  return (
    <>
      <BottomSheet
        title="Admin Actions"
        withHeader={true}
        onDismiss={onDismiss}
        visible={visible}
        snapPoint={["40%"]}
      >
        <View className="flex-1 gap-y-4 pb-8 mt-4 px-4">
          {!user.verified && (
            <Button
              size={"xl"}
              className="bg-background-muted justify-between"
              onPress={handleVerify}
            >
              <Text>Verify</Text>
              {isPending ? <Icon as={SpinningLoader} /> : <Icon as={Check} />}
            </Button>
          )}

          <Button
            size={"xl"}
            className="bg-background-muted justify-between"
            onPress={() => setShowRoles(true)}
          >
            <Text>User Role</Text>
            {roling ? <Icon as={SpinningLoader} /> : <Icon as={ChevronDown} />}
          </Button>
          <Button
            size={"xl"}
            className="bg-background-muted justify-between"
            onPress={handleSuspend}
          >
            <Text>Suspend</Text>
            {suspending ? <Icon as={SpinningLoader} /> : <Icon as={Ban} />}
          </Button>

          <Button
            size={"xl"}
            className=" justify-between"
            variant="destructive"
            onPress={handleDelete}
          >
            <Text>Delete</Text>
            {deleting ? <Icon as={SpinningLoader} /> : <Icon as={Trash} />}
          </Button>
        </View>
      </BottomSheet>
      <UserRolesBottomSheet
        role={user.role}
        visible={showRoles}
        handleRole={handleRole}
        onDismiss={() => setShowRoles(false)}
      />
    </>
  );
}
