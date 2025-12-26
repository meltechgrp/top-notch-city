import { startChat } from "@/actions/message";
import { Fetch } from "@/actions/utills";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Pressable,
  Text,
  useResolvedTheme,
} from "@/components/ui";
import { Divider } from "@/components/ui/divider";
import { LinearGradient } from "expo-linear-gradient";
import { generateMediaUrlSingle } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronRight, Headset } from "lucide-react-native";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import ChatsStateWrapper from "@/components/chat/ChatsStateWrapper";
const h = Dimensions.get("screen").height;

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

export default function Staffs() {
  const theme = useResolvedTheme();
  const { mutateAsync } = useMutation({
    mutationFn: startChat,
  });
  const { data, refetch, error, isLoading, isFetching } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
  });
  return (
    <LinearGradient
      colors={theme == "dark" ? ["#161819", "#1b1b1f"] : ["#d6d6d7", "#d3d3d4"]}
      locations={[0.2, 0.4]}
      style={{
        flex: 1,
        height: h,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingVertical: 24,
        paddingTop: 30,
      }}
    >
      <ChatsStateWrapper loading={isLoading || isFetching}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <Pressable
              className="flex-row justify-between gap-4"
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
                      router.dismissAll();
                      router.dismissTo({
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
              <Avatar className="w-16 h-16">
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
              <View className="flex-row gap-4 flex-1 border-b border-b-outline-100">
                <View className="flex-1 gap-1">
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text
                    style={{
                      color: item.status === "online" ? "green" : "gray",
                    }}
                  >
                    {item.status}
                  </Text>
                </View>
                <View className="mt-1">
                  <Icon as={ChevronRight} className="text-primary" />
                </View>
              </View>
            </Pressable>
          )}
          ListFooterComponent={() =>
            isLoading ? (
              <View className=" flex-1 justify-center items-center">
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
              </View>
            ) : null
          }
          ListEmptyComponent={() => (
            <View className="items-center w-full">
              <MiniEmptyState
                icon={Headset}
                title="No staff found"
                description="Available staffs will be displayed here"
                loading={isLoading}
                onPress={refetch}
                buttonLabel="Reload"
              />
            </View>
          )}
          ItemSeparatorComponent={() => <Divider />}
        />
      </ChatsStateWrapper>
    </LinearGradient>
  );
}
