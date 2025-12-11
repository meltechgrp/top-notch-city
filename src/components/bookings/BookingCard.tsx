import React, { useState } from "react";
import { Image, Pressable, Text, View } from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import { composeFullAddress } from "@/lib/utils";
import { format } from "date-fns";

type Props = {
  booking: Booking;
};

export function BookingCard({ booking }: Props) {
  const [bookingBottomSheet, setBoookingBottomSheet] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => setBoookingBottomSheet(true)}
        className="bg-background-muted rounded-xl p-4 my-3 shadow-md"
      >
        <View className="h-36 mb-3">
          <Image
            source={{ uri: generateMediaUrlSingle(booking.property.image) }}
          />
        </View>

        <View>
          <Text className="text-lg font-semibold ">
            {booking.property.title}
          </Text>
          {booking.property.address ? (
            <Text className="text-sm text-typography/80 mt-1">
              {composeFullAddress(booking.property.address)}
            </Text>
          ) : null}
          {booking.bedType ? (
            <Text className="text-sm mt-1">{booking.bedType}</Text>
          ) : null}

          <View className="flex-row justify-between mt-3">
            <View>
              <Text className="text-xs text-gray-400">Check in</Text>
              <Text className="font-semibold text-sm ">
                {format(new Date(booking.scheduled_date), "dd-MMM")}
              </Text>
            </View>

            {booking.duration && (
              <View className="items-center justify-center">
                <Text className="font-semibold text-sm text-success-100">
                  {booking.duration} Nights
                </Text>
              </View>
            )}

            <View>
              <Text className="text-xs text-typography/80">Check out</Text>
              <Text className="font-semibold text-sm ">
                {format(new Date(booking.scheduled_date), "dd-MMM")}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-3">
            <Text className="font-medium">Total</Text>
            <Text className="font-bold text-lg text-info-100">
              ${booking.property.price}
            </Text>
          </View>

          <View className="flex-row justify-between mt-4">
            <Pressable className="bg-gray-100 py-2 px-5 rounded-lg">
              <Text className="font-semibold">Re-Book</Text>
            </Pressable>

            <Pressable className="bg-info-100 py-2 px-5 rounded-lg">
              <Text className="text-white font-semibold">Add Review</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
      {/* <BoookingBottomSheet
              visible={bookingBottomSheet}
              onDismiss={() => setBoookingBottomSheet(false)}
              agent={booking}
            /> */}
    </>
  );
}
