import { startChat } from "@/actions/message";
import { Fetch } from "@/actions/utills";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import BottomSheet from "@/components/shared/BottomSheet";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Text,
} from "@/components/ui";
import { Divider } from "@/components/ui/divider";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { generateMediaUrlSingle } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  status: string;
  last_seen: string;
}

async function fetchStaff(): Promise<Staff[]> {
  const res = await Fetch("/users/staff");
  return res?.results || [];
}

export default function CustomerCareBottomSheet({
  visible,
  onDismiss,
}: AuthModalProps) {
  const { mutateAsync } = useMutation({
    mutationFn: startChat,
  });
  const { data, refetch, error, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
  });
  if (__DEV__) {
  }
  useRefreshOnFocus(refetch);
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["50%"]}
      title="Customer Care"
      withHeader
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row justify-between items-center gap-4"
            onPress={async () => {
              await mutateAsync(
                {
                  member_id: item?.id!,
                },
                {
                  onError: (e) => {
                    showErrorAlert({
                      title: "Unable to start chat",
                      alertType: "error",
                    });
                  },
                  onSuccess: (data) => {
                    router.replace({
                      pathname: "/chats/[chatId]",
                      params: {
                        chatId: data,
                      },
                    });
                  },
                }
              );
            }}
          >
            <Avatar size="lg">
              {item.profile_image && (
                <AvatarImage
                  source={{
                    uri: generateMediaUrlSingle(item.profile_image),
                    cache: "force-cache",
                  }}
                />
              )}
              <AvatarFallbackText>
                {item.first_name} {item.last_name}
              </AvatarFallbackText>
              {item.status === "online" && <AvatarBadge />}
            </Avatar>
            <View className="flex-1 gap-1">
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item.first_name} {item.last_name}
              </Text>
              <Text
                style={{ color: item.status === "online" ? "green" : "gray" }}
              >
                {item.status}
              </Text>
            </View>
            <View>
              <Icon as={ChevronRight} className="text-primary" />
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() =>
          isLoading ? (
            <View className=" flex-1 justify-center items-center">
              <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            </View>
          ) : undefined
        }
        ItemSeparatorComponent={() => <Divider />}
      />
    </BottomSheet>
  );
}
