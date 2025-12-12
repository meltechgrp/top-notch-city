import { startChat } from "@/actions/message";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import {
  openAccessModal,
  openBookingModal,
} from "@/components/globals/AuthModals";
import { Icon, Pressable, Text, View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { BookCheck, MessageCircle } from "lucide-react-native";
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
    <View
      className={cn(
        " absolute bottom-0 hidden bg-background border-t border-outline-100 w-full left-0 ",
        property.status == "approved" && "flex"
      )}
    >
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-transparent">
        <View className="flex-row gap-4 px-4 pt-2 pb-0 flex-1">
          <Pressable
            both
            onPress={() => {
              openBookingModal({
                visible: true,
                property_id: property.id,
                agent_id: property.owner?.id,
                availableDates: property.availabilities,
                image:
                  property.media.find((i) => i.media_type == "IMAGE")?.url ||
                  "",
                title: property.title,
                address: property.address,
                booking_type:
                  property.category.name == "Shortlet"
                    ? "reservation"
                    : "inspection",
              });
            }}
            className="flex-row flex-1 bg-gray-600 gap-2 p-4  rounded-xl items-center justify-center"
          >
            <Icon size="xl" as={BookCheck} className="text-primary" />
            <Text size="md" className=" font-medium text-white">
              {property.category.name == "Shortlet" ? "Book" : "Book a visit"}
            </Text>
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
            className="flex-row flex-1 gap-2 bg-primary p-4  rounded-xl items-center justify-center"
          >
            <Icon size="xl" as={MessageCircle} className="text-white" />
            <Text size="md" className=" font-medium text-white">
              Chat Agent
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
