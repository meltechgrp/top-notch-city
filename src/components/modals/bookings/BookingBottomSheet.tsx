import BottomSheet from "@/components/shared/BottomSheet";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  Icon,
  Image,
  Text,
  View,
} from "@/components/ui";
import { generateMediaUrlSingle, getImageUrl } from "@/lib/api";
import { addDays, format } from "date-fns";
import {
  ImageViewerProvider,
  ProfileImageTrigger,
} from "@/components/custom/ImageViewerProvider";
import { Bed, MapPin, Users } from "lucide-react-native";
import { cn, composeFullAddress, formatMoney, fullName } from "@/lib/utils";

export type BookingBottomSheetProps = {
  visible: boolean;
  onDismiss: () => void;
  booking: Booking;
  isOwner: boolean;
};

export const BookingBottomSheet: React.FC<BookingBottomSheetProps> = ({
  visible,
  onDismiss,
  booking,
  isOwner,
}) => {
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["65%"]}
      title={
        booking.booking_type == "reservation"
          ? "Reservation Details"
          : "Inspection Details"
      }
      withHeader
      backdropVariant="xl"
      withScroll
      addBackground
    >
      <ImageViewerProvider>
        <View className="bg-background rounded-2xl p-4 mt-2">
          {booking.booking_type == "reservation" ? (
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
                <Text
                  numberOfLines={2}
                  className="text-sm flex-1 font-semibold "
                >
                  {booking.property.title}
                </Text>
                {booking.property.address ? (
                  <View className="flex-row gap-1 items-center">
                    <Icon as={MapPin} size="sm" className="text-info-100" />
                    <Text
                      numberOfLines={1}
                      className="text-sm text-typography/80 "
                    >
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
                      " ml-auto bg-primary/80",
                      booking.status == "completed" &&
                        "bg-background-success/80",
                      booking.status == "cancelled" && "bg-info-100/80"
                    )}
                  >
                    <Text className="text-sm capitalize">{booking.status}</Text>
                  </Badge>
                </View>
              </View>
            </View>
          ) : (
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
                <View className="h-24 w-28 rounded-2xl">
                  <Image
                    source={{
                      uri: generateMediaUrlSingle(booking.property.image),
                    }}
                    rounded
                  />
                </View>
              </ProfileImageTrigger>
              <View className="flex-1">
                {booking.property.address ? (
                  <View className=" flex-1 gap-1">
                    <Text className="text-sm text-typography/80">
                      Address:{" "}
                    </Text>
                    <Text numberOfLines={2} className="text-sm flex-1 ">
                      {composeFullAddress(booking.property.address)}
                    </Text>
                  </View>
                ) : null}
                <Badge
                  className={cn(
                    " bg-primary/80 ml-auto",
                    booking.status == "completed" && "bg-background-success/80",
                    booking.status == "cancelled" && "bg-info-100/80"
                  )}
                >
                  <Text className="text-sm capitalize">{booking.status}</Text>
                </Badge>
              </View>
            </View>
          )}
          {booking.booking_type == "reservation" && (
            <View className="flex-row items-center justify-between mt-3">
              <View>
                <Text className="text-xs text-typography/80">Check in</Text>
                <Text className="font-medium text-sm ">
                  {format(new Date(booking.scheduled_date), "dd-MMM  mm:hh a")}
                </Text>
              </View>

              {booking.duration && (
                <View className="items-center justify-center">
                  <Text className="font-medium text-sm">
                    {booking.duration}{" "}
                    {booking.duration > 1 ? "Nights" : "Night"}
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
          )}
          {booking.booking_type == "inspection" && (
            <View className="flex-row w-full justify-between items-center gap-4">
              <View>
                <Text className="text-sm text-typography/80">
                  Schedule date:
                </Text>
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
          )}

          {booking.booking_type == "reservation" && (
            <View className="flex-row items-center gap-1 justify-between mt-2">
              <Text className="font-medium text-typography/80">Total:</Text>
              <Text className="font-bold text-lg">
                {formatMoney(booking.property.price, "NGN", 0)}
              </Text>
            </View>
          )}
          {booking.additionalRequest?.length ? (
            <View className="mt-5 bg-background-muted p-4 border border-outline-100 rounded-xl">
              <Text className="text-sm font-medium text-typography/80 mb-1">
                Additional Requests
              </Text>
              <View className=" gap-1">
                {booking.additionalRequest.map((req, index) => (
                  <Text key={index} className="text-sm text-typography/80">
                    • {req}
                  </Text>
                ))}
              </View>
            </View>
          ) : null}

          {booking.notes ? (
            <View className="mt-5 bg-background-muted p-4 border border-outline-100 rounded-xl">
              <Text className="text-sm font-medium text-typography/80 mb-1">
                Notes:
              </Text>
              <Text className="text-sm">{booking.notes}</Text>
            </View>
          ) : null}

          {isOwner ? (
            <View className="mt-6 flex-row gap-4 border items-center border-info-100/50 rounded-xl p-4">
              <ProfileImageTrigger
                image={[
                  {
                    url: booking.customer.profile_image,
                    id: booking.customer.id,
                    mediaType: "IMAGE",
                  },
                ]}
              >
                <Avatar className="w-16 h-16 rounded-full">
                  <AvatarFallbackText>
                    {fullName(booking.customer)}
                  </AvatarFallbackText>
                  <AvatarImage
                    className="rounded-full"
                    source={getImageUrl(booking.customer.profile_image)}
                  />
                </Avatar>
              </ProfileImageTrigger>
              <View className="">
                <Text className="text-sm font-medium text-typography/80 mb-1">
                  Booked by:
                </Text>
                <Text className="text-base font-medium">
                  {booking.customer.first_name} {booking.customer.last_name}
                </Text>
              </View>
            </View>
          ) : (
            <View className="mt-6 flex-row gap-4 border items-center border-info-100/50 rounded-xl p-4">
              <ProfileImageTrigger
                image={[
                  {
                    url: booking.agent.profile_image,
                    id: booking.agent.id,
                    mediaType: "IMAGE",
                  },
                ]}
              >
                <Avatar className="w-16 h-16 rounded-full">
                  <AvatarFallbackText>
                    {fullName(booking.agent)}
                  </AvatarFallbackText>
                  <AvatarImage
                    className="rounded-full"
                    source={getImageUrl(booking.agent.profile_image)}
                  />
                </Avatar>
              </ProfileImageTrigger>
              <View className="">
                <Text className="text-sm font-medium text-typography/80 mb-1">
                  Listed by:
                </Text>
                <Text className="text-base font-medium">
                  {booking.agent.first_name} {booking.agent.last_name}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ImageViewerProvider>
    </BottomSheet>
  );
};
