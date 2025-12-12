import React, { useCallback, useMemo, useState } from "react";
import { Badge, Icon, Image, Pressable, Text, View } from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import { cn, composeFullAddress, formatMoney } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { updateBookingStatus } from "@/actions/bookings";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { openBookingModal } from "@/components/globals/AuthModals";
import { CancelationReasonBottomSheet } from "@/components/modals/bookings/CancelationReasonBottomSheet";
import { BookingBottomSheet } from "@/components/modals/bookings/BookingBottomSheet";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";

type Props = {
  booking: Booking;
};

export function VisitCard({ booking }: Props) {
  const query = useQueryClient();
  const { me } = useStore(useShallow((s) => s.getCurrentUser()));
  const [bookingBottomSheet, setBoookingBottomSheet] = useState(false);
  const [openActions, setOpenActions] = useState(false);
  const isOwner = useMemo(() => me?.id == booking.agent.id, [booking, me]);
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
    },
    onError: () => {
      showErrorAlert({
        title: "Something went wrong!",
        alertType: "error",
      });
    },
  });
  async function handleUpdate(status: BookingStatus, note?: string) {
    await mutateAsync({
      booking_id: booking.id,
      status,
      note,
    });
  }
  const ActionsButtons = useCallback(() => {
    if (booking.status == "pending" && isOwner) {
      return (
        <View className="flex-row justify-between gap-4 my-1">
          <Pressable
            onPress={() => setOpenActions(true)}
            className="items-center flex-1 bg-primary py-2 px-5 rounded-lg"
          >
            <Text className="font-semibold">Cancel</Text>
          </Pressable>

          <Pressable
            disabled={isPending}
            onPress={() => handleUpdate("confirmed", undefined)}
            className="items-center flex-1 bg-info-100 py-2 px-5 rounded-lg"
          >
            <Text className="text-white font-semibold">Confirm</Text>
          </Pressable>
        </View>
      );
    } else if (booking.status == "pending" && !isOwner) {
      return (
        <View className=" mt-4">
          <Pressable
            onPress={() => setOpenActions(true)}
            className="items-center flex-1 bg-primary py-2 px-5 rounded-lg"
          >
            <Text className="font-semibold">Cancel</Text>
          </Pressable>
        </View>
      );
    } else if (booking.status == "cancelled" && !isOwner) {
      return (
        <View className=" mt-4">
          <Pressable
            onPress={() => {
              openBookingModal({
                visible: true,
                property_id: booking.property.id,
                agent_id: booking.agent?.id,
                booking_type: booking.booking_type,
                image: booking.property.image,
                title: booking.property.title,
                address: booking.property.address as any,
                onDismiss: () =>
                  query.invalidateQueries({
                    queryKey: ["bookings"],
                  }),
              });
            }}
            className="items-center flex-1 bg-gray-500 py-2 px-5 rounded-lg"
          >
            <Text className="font-semibold">Re-Book</Text>
          </Pressable>
        </View>
      );
    } else if (booking.status == "confirmed" && !isOwner) {
      return (
        <View className=" mt-4">
          <Pressable
            disabled={isPending}
            onPress={() => handleUpdate("completed", undefined)}
            className="items-center flex-1 bg-success-100 py-2 px-5 rounded-lg"
          >
            <Text className="font-semibold">Mark as Completed</Text>
          </Pressable>
        </View>
      );
    } else if (booking.status == "completed" && !isOwner) {
      return (
        <View className="flex-row gap-4 justify-between mt-4">
          <Pressable
            onPress={() => {
              openBookingModal({
                visible: true,
                property_id: booking.property.id,
                agent_id: booking.agent?.id,
                booking_type: booking.booking_type,
                image: booking.property.image,
                title: booking.property.title,
                address: booking.property.address as any,
                onDismiss: () =>
                  query.invalidateQueries({
                    queryKey: ["bookings"],
                  }),
              });
            }}
            className="items-center flex-1 bg-gray-500 py-2 px-5 rounded-lg"
          >
            <Text className="font-semibold">Re-Book</Text>
          </Pressable>

          <Pressable className="items-center flex-1 bg-success-100 py-2 px-5 rounded-lg">
            <Text className="text-white font-semibold">Add Review</Text>
          </Pressable>
        </View>
      );
    } else {
      return <></>;
    }
  }, [booking, isOwner]);
  return (
    <>
      <Pressable
        onPress={() => setBoookingBottomSheet(true)}
        className="bg-background-muted border border-outline-100 rounded-xl p-4 my-2 shadow-md"
      >
        <View className="flex-row gap-4 mb-3">
          <ProfileImageTrigger
            image={[
              {
                url: booking.property.image,
                id: booking.id,
                media_type: "IMAGE",
              },
            ]}
          >
            <View className="h-24 w-28 rounded-2xl">
              <Image
                source={{ uri: generateMediaUrlSingle(booking.property.image) }}
                rounded
              />
            </View>
          </ProfileImageTrigger>
          <View className="flex-1">
            {booking.property.address ? (
              <View className=" flex-1 gap-1">
                <Text className="text-sm text-typography/80">Address: </Text>
                <Text numberOfLines={2} className="text-sm flex-1 ">
                  {composeFullAddress(booking.property.address)}
                </Text>
              </View>
            ) : null}
            <Badge
              className={cn(
                " bg-primary/80 ml-auto",
                booking.status == "completed" && "bg-background-success/80",
                booking.status == "confirmed" && "bg-primary/80",
                booking.status == "cancelled" && "bg-info-100/80"
              )}
            >
              <Text className="text-sm capitalize">{booking.status}</Text>
            </Badge>
          </View>
        </View>
        <View className="flex-row w-full justify-between items-center gap-4">
          <View>
            <Text className="text-sm text-typography/80">Schedule date:</Text>
            <Text className="font-semibold text-sm ">
              {format(new Date(booking.scheduled_date), "dd-MMM mm:hh a")}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 justify-between mt-2">
            <Text className="font-medium text-typography/80">Total:</Text>
            <Text className="font-bold text-lg">
              {formatMoney(booking.property.price, "NGN", 0)}
            </Text>
          </View>
        </View>
        <ActionsButtons />
      </Pressable>
      <BookingBottomSheet
        visible={bookingBottomSheet}
        onDismiss={() => setBoookingBottomSheet(false)}
        booking={booking}
        isOwner={isOwner}
      />
      <CancelationReasonBottomSheet
        visible={openActions}
        title="Cancel Inspection"
        onCancel={async (reason) => await handleUpdate("cancelled", reason)}
        onDismiss={() => setOpenActions(false)}
      />
    </>
  );
}
