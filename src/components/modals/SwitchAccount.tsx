import { showErrorAlert } from "@/components/custom/CustomNotification";
import DropdownSelect from "@/components/custom/DropdownSelect";
import BottomSheet from "@/components/shared/BottomSheet";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Icon,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { useAccounts } from "@/hooks/useAccounts";
import { useMe } from "@/hooks/useMe";
import { generateMediaUrlSingle } from "@/lib/api";
import { fullName } from "@/lib/utils";
import { mainStore } from "@/store";
import { router } from "expo-router";
import { BadgeCheck, MoreHorizontal, Plus } from "lucide-react-native";

export default function SwitchAccountSheet({
  visible,
  onDismiss,
}: AuthModalProps) {
  const { me } = useMe();
  const { accounts, switchAccount, removeAccount } = useAccounts();
  const list = Object.values(accounts).map((a) => a.user);
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={[320]}
      enableDynamicSizing
      enableOverDrag
    >
      <Box className="flex-1 p-4 gap-6">
        <View className="border border-outline-100 bg-background-muted/70 overflow-hidden rounded-2xl">
          {list?.map((acc) => (
            <Pressable
              key={acc.id}
              onPress={async () => {
                if (acc.id == me?.id) return;
                switchAccount(acc.id);
                mainStore.propertyLastSyncAt.set(0);
                onDismiss?.();
              }}
              className="flex-row justify-between items-center gap-4 border-b border-outline-100 p-4"
            >
              <Avatar>
                {acc?.profile_image && (
                  <AvatarImage
                    source={{
                      uri: generateMediaUrlSingle(acc.profile_image),
                      cache: "force-cache",
                    }}
                  />
                )}
                {!acc?.profile_image && (
                  <AvatarFallbackText>{fullName(acc)}</AvatarFallbackText>
                )}
              </Avatar>
              <View className="flex-1">
                <Text className=" text-sm font-medium">{fullName(acc)}</Text>
                <Text className="text-xs capitalize">{acc.role}</Text>
              </View>
              {acc.id == me?.id ? (
                <Icon size="xl" as={BadgeCheck} className="text-primary" />
              ) : (
                <DropdownSelect
                  value="Remove"
                  showSearch={false}
                  icon={MoreHorizontal}
                  className=" p-2 border-0 rounded-md"
                  onChange={async () => {
                    onDismiss?.();
                    await removeAccount(acc.id);
                    showErrorAlert({
                      title: `Account Removed`,
                    });
                  }}
                  options={["Remove"]}
                />
              )}
            </Pressable>
          ))}
          {list && list?.length < 3 && (
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
      </Box>
    </BottomSheet>
  );
}
