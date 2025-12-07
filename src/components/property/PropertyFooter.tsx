import { startChat } from "@/actions/message";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import {
  openAccessModal,
  openEnquiryModal,
} from "@/components/globals/AuthModals";
import { Icon, Pressable, Text, View } from "@/components/ui";
import { useStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { BookCheck, ChevronRight, MessageCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PropertyFooterProps {
  property: Property;
}

export function PropertyFooter({ property }: PropertyFooterProps) {
  const { me } = useStore();
  const { mutateAsync } = useMutation({
    mutationFn: startChat,
  });
  return (
    <View className=" absolute bottom-0 bg-background border-t border-outline-100 w-full left-0 ">
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-transparent">
        <View className="flex-row gap-4 px-4 pt-2 pb-0 flex-1">
          <Pressable
            both
            onPress={() => {
              openEnquiryModal({
                visible: true,
                id: property?.id,
              });
            }}
            className="flex-row flex-1 bg-gray-600 gap-2 p-4  rounded-xl items-center justify-between"
          >
            <Icon size="xl" as={BookCheck} className="text-primary" />
            <Text size="md" className=" mr-auto text-white">
              Book a visit
            </Text>
            <Icon as={ChevronRight} color="white" />
          </Pressable>
          <Pressable
            both
            disabled={me?.id == property?.owner.id}
            onPress={async () => {
              if (!me) {
                return openAccessModal({ visible: true });
              }
              await mutateAsync(
                {
                  property_id: property?.id!,
                  member_id: property?.owner.id!,
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
            className="flex-row flex-1 gap-2 bg-primary p-4  rounded-xl items-center justify-between"
          >
            <Icon size="xl" as={MessageCircle} className="text-white" />
            <Text size="md" className=" mr-auto text-white">
              Chat Agent
            </Text>
            <Icon as={ChevronRight} color="white" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
