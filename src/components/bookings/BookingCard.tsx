import React, { useMemo, useState } from "react";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  Icon,
  Image,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import {
  cn,
  composeFullAddress,
  formatMessageTime,
  fullName,
} from "@/lib/utils";
import {
  Ban,
  BookCheck,
  Calendar,
  CircleCheckBig,
  MapPin,
  Users,
} from "lucide-react-native";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { BookingBottomSheet } from "@/components/modals/bookings/BookingBottomSheet";
import { useMe } from "@/hooks/useMe";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "@/actions/bookings";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { openBookingModal } from "@/components/globals/AuthModals";
import { CancelationReasonBottomSheet } from "@/components/modals/bookings/CancelationReasonBottomSheet";

type Props = {
  booking: Booking;
};

export function BookingCard({ booking }: Props) {
  const query = useQueryClient();
  const { me } = useMe();
  const [bookingBottomSheet, setBoookingBottomSheet] = useState(false);
  const [openActions, setOpenActions] = useState(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateBookingStatus,
    mutationKey: ["booking", "status"],
    onSettled: () => {
      showErrorAlert({
        title: "Booking updated successfully",
        alertType: "success",
      });
      query.invalidateQueries({
        queryKey: ["bookings"],
      });
      setBoookingBottomSheet(false);
    },
    onError: () => {
      showErrorAlert({
        title: "Something went wrong!",
        alertType: "error",
      });
    },
  });

  const isOwner = useMemo(() => me?.id == booking.agent.id, [booking, me]);
  async function handleUpdate(status: BookingStatus, note?: string) {
    await mutateAsync({
      booking_id: booking.id,
      status,
      note,
    });
  }
  function handleRebook() {
    openBookingModal({
      visible: true,
      property_id: booking.property.id,
      agent_id: booking.agent?.id,
      booking_type: booking.booking_type,
      image: booking.property.image,
      title: booking.property.title,
      address: composeFullAddress(booking.property.address),
      onDismiss: () =>
        query.invalidateQueries({
          queryKey: ["bookings"],
        }),
    });
  }
  return (
    <>
      <SwipeableWrapper
        leftActions={[
          {
            type: "success",
            component: (
              <View className="bg-success-100 flex-1 items-center justify-center">
                <Icon as={CircleCheckBig} className="text-white" />
                <Text className="text-white">
                  {isOwner ? "Comfirm" : "Completed"}
                </Text>
              </View>
            ),
            onPress: () => handleUpdate(isOwner ? "confirmed" : "completed"),
          },
          {
            type: "success",
            component: (
              <View className="bg-gray-600 flex-1 items-center justify-center">
                <Icon as={BookCheck} className="text-white" />
                <Text className="text-white">Re-book</Text>
              </View>
            ),
            onPress: handleRebook,
          },
        ]}
        rightActions={[
          {
            component: (
              <View className="bg-primary flex-1 items-center justify-center">
                <Icon as={Ban} className="text-white" />
                <Text className="text-white">Cancel</Text>
              </View>
            ),
            onPress: () => setOpenActions(true),
          },
        ]}
      >
        <Pressable
          onPress={() => setBoookingBottomSheet(true)}
          className=" h-[70px] flex-1 bg-background"
        >
          <View className="flex-1 mt-1 gap-4 pl-4 w-full flex-row">
            <ProfileImageTrigger
              image={[
                {
                  url: booking.property.image,
                  id: booking.id,
                  media_type: "IMAGE",
                },
              ]}
            >
              <Avatar className="bg-gray-500 w-16 h-16">
                <AvatarFallbackText className="text-typography text-xl">
                  {fullName(booking.customer)}
                </AvatarFallbackText>
                {booking.customer.profile_image && (
                  <AvatarImage
                    source={{
                      uri: generateMediaUrlSingle(
                        booking.customer.profile_image
                      ),
                      cache: "force-cache",
                    }}
                  />
                )}
              </Avatar>
            </ProfileImageTrigger>
            <View className="flex-1 pr-4 border-b border-outline">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1  pr-4">
                  <Text numberOfLines={1} className=" text-base font-medium">
                    {fullName(booking.customer)}
                  </Text>
                </View>
                <Text className="text-typography/60 text-xs">
                  {formatMessageTime(new Date(booking.created_at), {
                    hideTimeForFullDate: true,
                  })}
                </Text>
              </View>

              <View className="flex-1 flex-row gap-4">
                <View className="flex-1 gap-1">
                  <View className="flex-row gap-1 items-center">
                    <Icon as={Calendar} size="xs" className="text-gray-400" />
                    <Text className="font-semibold text-xs text-typography/80">
                      {format(
                        new Date(booking.scheduled_date),
                        "dd MMMM, hh:mm a"
                      )}
                    </Text>
                  </View>
                  <View className=" flex-row gap-1 items-center">
                    <Icon as={MapPin} className="text-primary" size="xs" />
                    <Text
                      className="text-typography/80 flex-1 text-sm"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {composeFullAddress(booking.property.address)}
                    </Text>
                  </View>
                </View>
                <Badge
                  className={cn(
                    " ml-auto bg-primary rounded-full self-center py-1.5 px-3",
                    booking.status == "completed" && "bg-background-success/80",
                    booking.status == "confirmed" && "bg-primary/80",
                    booking.status == "cancelled" && "bg-info-100/80"
                  )}
                >
                  <Text className="text-xs">{booking.status}</Text>
                </Badge>
              </View>
            </View>
          </View>
        </Pressable>
      </SwipeableWrapper>
      <BookingBottomSheet
        visible={bookingBottomSheet}
        onDismiss={() => setBoookingBottomSheet(false)}
        booking={booking}
        setOpenActions={() => {
          setOpenActions(true);
          setBoookingBottomSheet(false);
        }}
        isOwner={isOwner}
        isPending={isPending}
        handleRebook={handleRebook}
        handleUpdate={handleUpdate}
      />

      <CancelationReasonBottomSheet
        visible={openActions}
        onCancel={async (reason) => await handleUpdate("cancelled", reason)}
        onDismiss={() => setOpenActions(false)}
      />
    </>
  );
}
