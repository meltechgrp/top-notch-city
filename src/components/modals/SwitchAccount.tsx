import { showErrorAlert } from "@/components/custom/CustomNotification";
import DropdownSelect from "@/components/custom/DropdownSelect";
import BottomSheet from "@/components/shared/BottomSheet";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  Icon,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { useMultiAccount } from "@/hooks/useAccounts";
import { generateMediaUrlSingle } from "@/lib/api";
import { fullName } from "@/lib/utils";
import { router } from "expo-router";
import { BadgeCheck, MoreHorizontal, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";

export default function SwitchAccountSheet({
  visible,
  onDismiss,
}: AuthModalProps) {
  const { fetchAccounts, switchToAccount, getActive, removeAccId } =
    useMultiAccount();
  const [list, setList] = useState<StoredAccount[]>([]);
  const [active, setActive] = useState<StoredAccount | null>(null);

  useEffect(() => {
    fetchAccounts().then(setList);
    getActive().then(setActive);
  }, []);

  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={[450, 500]}
      enableDynamicSizing
      enableOverDrag
    >
      <Box className="flex-1 p-4 gap-6">
        <View className="border border-outline-100 bg-background-muted/70 overflow-hidden rounded-2xl">
          {list.map((acc) => (
            <Pressable
              key={acc.id}
              onPress={() => {
                if (acc.id == active?.id) return;
                switchToAccount(acc.id);
                onDismiss?.();
              }}
              className="flex-row justify-between items-center gap-4 border-b border-outline-100 p-4"
            >
              <Avatar>
                {acc?.profile_image && (
                  <AvatarImage
                    source={{ uri: generateMediaUrlSingle(acc.profile_image) }}
                  />
                )}
                {!acc?.profile_image && (
                  <AvatarFallbackText>{fullName(acc)}</AvatarFallbackText>
                )}
              </Avatar>
              <View className="flex-1">
                <Text className="font-medium">
                  {acc.first_name} {acc.last_name}
                </Text>
                <Text className="text-xs capitalize">{acc.role}</Text>
              </View>
              {acc.id == active?.id ? (
                <Icon size="xl" as={BadgeCheck} className="text-primary" />
              ) : (
                <DropdownSelect
                  value="Remove"
                  icon={MoreHorizontal}
                  className=" p-2 border-0 rounded-md"
                  onChange={async () => {
                    await removeAccId(acc.id);
                    showErrorAlert({
                      title: `${acc.first_name} Account Removed`,
                    });
                    onDismiss?.();
                  }}
                  options={["Remove"]}
                />
              )}
            </Pressable>
          ))}
          {list?.length < 3 && (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/signin",
                  params: {
                    redirect: "/profile",
                  },
                });
                onDismiss?.();
              }}
              className="flex-row justify-between items-center gap-4 p-4"
            >
              <View className="rounded-full p-2 bg-background border border-outline-100">
                <Icon size="xl" as={Plus} />
              </View>
              <View className="flex-1">
                <Text>Add a TopNotch Account</Text>
              </View>
            </Pressable>
          )}
        </View>
        <View className=" items-center mt-16">
          <Text className="text-base font-medium">TopNotch City</Text>
        </View>
      </Box>
    </BottomSheet>
  );
}
