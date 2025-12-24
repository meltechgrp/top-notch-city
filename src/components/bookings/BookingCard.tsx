import React, { useCallback, useMemo, useState } from "react";
import { Badge, Icon, Image, Pressable, Text, View } from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import { cn, composeFullAddress, formatMoney } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { Bed, MapPin, Users } from "lucide-react-native";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";
import { openBookingModal } from "@/components/globals/AuthModals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { BookingBottomSheet } from "@/components/modals/bookings/BookingBottomSheet";
import { updateBookingStatus } from "@/actions/bookings";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { CancelationReasonBottomSheet } from "@/components/modals/bookings/CancelationReasonBottomSheet";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

type Props = {
  booking: Booking;
};

export function BookingCard({ booking }: Props) {
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
        <View className="flex-row justify-between gap-4 mt-4">
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
                address: composeFullAddress(booking.property.address),
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
        className="bg-background-muted border border-outline-100 rounded-xl p-4 my-1 shadow-md"
      >
        <View className="flex-row gap-4 mb-3">
          <ProfileImageTrigger
            image={[
              {
                url: booking.property.image,
                id: booking.id,
                mediaType: "IMAGE",
              },
            ]}
          >
            <View className="h-24 w-24 rounded-2xl">
              <Image
                source={{
                  uri: generateMediaUrlSingle(booking.property.image),
                  cacheKey: booking.id,
                }}
                rounded
              />
            </View>
          </ProfileImageTrigger>

          <View className="flex-1">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/property/[propertyId]",
                  params: {
                    propertyId: booking.property.id,
                  },
                })
              }
              className="flex-1"
            >
              <Text numberOfLines={2} className="text-sm flex-1 font-semibold ">
                {booking.property.title}
              </Text>
            </TouchableOpacity>
            {booking.property.address ? (
              <View className="flex-row gap-1 items-center">
                <Icon as={MapPin} size="sm" className="text-info-100" />
                <Text numberOfLines={1} className="text-sm text-typography/80 ">
                  {composeFullAddress(booking.property.address)}
                </Text>
              </View>
            ) : null}
            <View className="flex-row mt-1 justify-between items-center gap-4">
              {booking.guest ? (
                <View className="flex-row gap-1 items-center">
                  <Icon as={Users} size="sm" className="text-info-100" />
                  <Text className="text-sm">{booking.guest} Guests</Text>
                </View>
              ) : null}
              <Badge
                className={cn(
                  " ml-auto bg-primary",
                  booking.status == "completed" && "bg-background-success/80",
                  booking.status == "confirmed" && "bg-primary/80",
                  booking.status == "cancelled" && "bg-info-100/80"
                )}
              >
                <Text className="text-sm capitalize">{booking.status}</Text>
              </Badge>
            </View>
          </View>
        </View>

        <View>
          <View className="flex-row items-center justify-between mt-1">
            <View>
              <Text className="text-xs text-typography/80">Check in</Text>
              <Text className="font-medium text-sm ">
                {format(new Date(booking.scheduled_date), "dd-MMM  mm:hh a")}
              </Text>
            </View>

            {booking.duration && (
              <View className="items-center justify-center">
                <Text className="font-medium text-sm">
                  {booking.duration} {booking.duration > 1 ? "Nights" : "Night"}
                </Text>
              </View>
            )}

            <View>
              <Text className="text-xs text-typography/80">Check out</Text>
              <Text className="font-medium text-sm ">
                {format(
                  addDays(
                    new Date(booking.scheduled_date),
                    booking.duration || 1
                  ),
                  "dd-MMM  mm:hh a"
                )}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-3">
            <Text className="font-medium text-typography/80">Total</Text>
            <Text className="font-bold text-lg">
              {formatMoney(booking.property.price, "NGN", 0)}
            </Text>
          </View>

          <ActionsButtons />
        </View>
      </Pressable>
      <BookingBottomSheet
        visible={bookingBottomSheet}
        onDismiss={() => setBoookingBottomSheet(false)}
        booking={booking}
        isOwner={isOwner}
      />
      <CancelationReasonBottomSheet
        visible={openActions}
        onCancel={async (reason) => await handleUpdate("cancelled", reason)}
        onDismiss={() => setOpenActions(false)}
      />
    </>
  );
}
