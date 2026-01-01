import React, { useMemo, useState } from "react";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  Icon,
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
} from "lucide-react-native";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { BookingBottomSheet } from "@/components/modals/bookings/BookingBottomSheet";
import { useMe } from "@/hooks/useMe";
import { format } from "date-fns";
import SwipeableWrapper, {
  SwipeAction,
} from "@/components/shared/SwipeableWrapper";
import { openBookingModal } from "@/components/globals/AuthModals";
import { CancelationReasonBottomSheet } from "@/components/modals/bookings/CancelationReasonBottomSheet";
import { useBooking } from "@/hooks/useBooking";

type Props = {
  booking: Booking;
};

export function BookingCard({ booking }: Props) {
  const { me } = useMe();
  const [bookingBottomSheet, setBoookingBottomSheet] = useState(false);
  const [openActions, setOpenActions] = useState(false);

  const { handleInvalidate, mutation } = useBooking();
  const isOwner = useMemo(() => me?.id == booking.agent.id, [booking, me]);

  function handleRebook() {
    openBookingModal({
      visible: true,
      property_id: booking.property.id,
      agent_id: booking.agent?.id,
      booking_type: booking.booking_type,
      image: booking.property.image,
      address: composeFullAddress(booking.property.address),
      onDismiss: handleInvalidate,
    });
  }
  const LeftActions = useMemo(
    () =>
      [
        ...[
          isOwner && booking.status == "pending"
            ? {
                type: "success",
                component: (
                  <View className="bg-success-100 flex-1 items-center justify-center">
                    <Icon as={CircleCheckBig} className="text-white" />
                    <Text className="text-white text-sm">
                      {isOwner ? "Comfirm" : "Completed"}
                    </Text>
                  </View>
                ),
                onPress: () =>
                  mutation.updateStatus(
                    booking.id,
                    isOwner ? "confirmed" : "completed"
                  ),
              }
            : null,
        ],
        ...[
          !isOwner && booking.status == "confirmed"
            ? {
                type: "success",
                component: (
                  <View className="bg-success-100 flex-1 items-center justify-center">
                    <Icon as={CircleCheckBig} className="text-white" />
                    <Text className="text-white text-sm">
                      {isOwner ? "Comfirm" : "Completed"}
                    </Text>
                  </View>
                ),
                onPress: () =>
                  mutation.updateStatus(
                    booking.id,
                    isOwner ? "confirmed" : "completed"
                  ),
              }
            : null,
        ],
        ...[
          !isOwner
            ? {
                type: "success",
                component: (
                  <View className="bg-gray-600 flex-1 items-center justify-center">
                    <Icon as={BookCheck} className="text-white text-sm" />
                    <Text className="text-white">Re-book</Text>
                  </View>
                ),
                onPress: handleRebook,
              }
            : null,
        ],
      ].filter((a) => a != null) as SwipeAction[],
    [isOwner, booking]
  );
  return (
    <>
      <SwipeableWrapper
        leftActions={LeftActions}
        rightActions={
          booking.status != "cancelled"
            ? [
                {
                  component: (
                    <View className="bg-primary flex-1 items-center justify-center">
                      <Icon as={Ban} className="text-white" />
                      <Text className="text-white">Cancel</Text>
                    </View>
                  ),
                  onPress: () => setOpenActions(true),
                },
              ]
            : undefined
        }
      >
        <Pressable
          onPress={() => setBoookingBottomSheet(true)}
          className=" h-[70px] flex-1 bg-background"
        >
          <View className="flex-1 mt-1 gap-4 pl-4 w-full flex-row">
            <ProfileImageTrigger
              image={[
                {
                  url: isOwner
                    ? booking.customer.profile_image
                    : booking.property.image,
                  id: isOwner ? booking.customer.id : booking.property.id,
                  media_type: "IMAGE",
                },
              ]}
            >
              <Avatar className="bg-gray-500 w-16 h-16">
                <AvatarFallbackText className="text-typography text-xl">
                  {fullName(booking.customer)}
                </AvatarFallbackText>
                {(booking.customer.profile_image ||
                  booking.agent.profile_image) && (
                  <AvatarImage
                    source={{
                      uri: generateMediaUrlSingle(
                        isOwner
                          ? booking.customer.profile_image
                          : booking.property.image
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
                    {isOwner
                      ? fullName(booking.customer)
                      : booking.booking_type == "reservation"
                        ? booking.property.title
                        : "Address"}
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
                  <View className="flex-row gap-1 items-center">
                    <Icon as={Calendar} size="xs" className="text-gray-400" />
                    <Text className="font-semibold text-xs text-typography/80">
                      {format(
                        new Date(booking.scheduled_date),
                        "dd MMMM, hh:mm a"
                      )}
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
        isPending={mutation.isPending}
        handleRebook={handleRebook}
        handleUpdate={mutation.updateStatus}
      />

      <CancelationReasonBottomSheet
        visible={openActions}
        onCancel={async (reason) =>
          await mutation.updateStatus(booking.id, "cancelled", reason)
        }
        onDismiss={() => setOpenActions(false)}
      />
    </>
  );
}
