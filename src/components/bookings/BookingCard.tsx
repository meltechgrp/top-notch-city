import React, { useMemo, useState } from "react";
import { Badge, Icon, Image, Pressable, Text, View } from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import { cn, composeFullAddress } from "@/lib/utils";
import { MapPin, Users } from "lucide-react-native";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { BookingBottomSheet } from "@/components/modals/bookings/BookingBottomSheet";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useMe } from "@/hooks/useMe";

type Props = {
  booking: Booking;
};

export function BookingCard({ booking }: Props) {
  const { me } = useMe();
  const [bookingBottomSheet, setBoookingBottomSheet] = useState(false);
  const isOwner = useMemo(() => me?.id == booking.agent.id, [booking, me]);
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
                media_type: "IMAGE",
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
            <Text numberOfLines={1} className="text-sm font-semibold ">
              {booking.property.title}
            </Text>
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
      </Pressable>
      <BookingBottomSheet
        visible={bookingBottomSheet}
        onDismiss={() => setBoookingBottomSheet(false)}
        booking={booking}
        isOwner={isOwner}
      />
    </>
  );
}
