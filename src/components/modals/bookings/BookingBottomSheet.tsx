import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Badge,
  Button,
  Icon,
  Image,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { generateMediaUrlSingle, getImageUrl } from "@/lib/api";
import { format } from "date-fns";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import {
  Bed,
  Calendar,
  ChevronRight,
  Clock,
  ClockFading,
  MapPin,
  UsersIcon,
} from "lucide-react-native";
import { cn, composeFullAddress, formatMoney, fullName } from "@/lib/utils";
import ModalScreen from "@/components/shared/ModalScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback } from "react";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

export type BookingBottomSheetProps = {
  visible: boolean;
  onDismiss: () => void;
  setOpenActions: () => void;
  handleRebook: () => void;
  handleUpdate(status: BookingStatus, note?: string): Promise<void>;
  booking: Booking;
  isOwner: boolean;
  isPending: boolean;
};

export const BookingBottomSheet: React.FC<BookingBottomSheetProps> = ({
  visible,
  onDismiss,
  booking,
  handleRebook,
  handleUpdate,
  isOwner,
  setOpenActions,
  isPending,
}) => {
  const ActionsButtons = useCallback(() => {
    if (booking.status == "pending" && isOwner) {
      return (
        <Button
          disabled={isPending}
          onPress={() => handleUpdate("confirmed", undefined)}
          className="items-center h-12 flex-1 bg-info-100 rounded-xl"
        >
          {isPending && <SpinningLoader />}
          <Text className="text-white font-semibold">Confirm</Text>
        </Button>
      );
    } else if (booking.status == "pending" && !isOwner) {
      return (
        <Button onPress={setOpenActions} className="flex-1 h-12">
          {isPending && <SpinningLoader />}
          <Text className="font-semibold">Cancel</Text>
        </Button>
      );
    } else if (booking.status == "confirmed" && !isOwner) {
      return (
        <Button
          disabled={isPending}
          onPress={() => handleUpdate("completed", undefined)}
          className="items-center h-12 flex-1 bg-success-100 rounded-xl"
        >
          {isPending && <SpinningLoader />}
          <Text className="font-semibold">Mark as Completed</Text>
        </Button>
      );
    } else if (
      (booking.status == "cancelled" || booking.status == "completed") &&
      !isOwner
    ) {
      return (
        <Button
          onPress={handleRebook}
          className="items-center h-12 flex-1 bg-gray-500 rounded-xl"
        >
          {isPending && <SpinningLoader />}
          <Text className="font-semibold">Re-Book</Text>
        </Button>
      );
    } else {
      return <></>;
    }
  }, [booking, isOwner]);
  return (
    <>
      <ModalScreen
        title={"Details"}
        visible={visible}
        onDismiss={onDismiss}
        withScroll
        rightComponent={
          <Badge
            className={cn(
              "bg-primary/80 rounded-full px-4 py-2",
              booking.status == "completed" && "bg-background-success/80",
              booking.status == "cancelled" && "bg-info-100/80"
            )}
          >
            <Text className="text-sm font-medium capitalize">
              {booking.status}
            </Text>
          </Badge>
        }
        bottomComponent={
          <View>
            <View className=" bg-background border-t border-t-outline-100 h-20 p-4">
              <View className="flex-row gap-4">
                {booking.status == "pending" && isOwner ? (
                  <Button onPress={setOpenActions} className="flex-1 h-12">
                    {isPending && <SpinningLoader />}
                    <Text className="font-semibold">Cancel</Text>
                  </Button>
                ) : null}

                <ActionsButtons />
              </View>
            </View>
          </View>
        }
      >
        <View className="bg-background rounded-2xl px-4 pt-2 pb-8">
          <View className=" gap-4 mb-3">
            <ProfileImageTrigger
              image={[
                {
                  url: booking.property.image,
                  id: booking.id,
                  media_type: "IMAGE",
                },
              ]}
            >
              <View className="h-48 rounded-2xl">
                <Image
                  source={{
                    uri: generateMediaUrlSingle(booking.property.image),
                    cacheKey: booking.id,
                  }}
                  rounded
                />
              </View>
            </ProfileImageTrigger>

            <View className="bg-background-muted p-4 rounded-2xl border border-outline-100 gap-1">
              <View className="flex-row justify-between gap-4">
                <Text className="text-lg flex-1 font-semibold ">
                  {booking.booking_type == "reservation"
                    ? booking.property.title
                    : "Address:"}
                </Text>
                <Button size="xs" className="bg-gray-500 rounded-xl">
                  <Text>View</Text>
                  <Icon as={ChevronRight} />
                </Button>
              </View>
              {booking.property.address ? (
                <View className="flex-row flex-1 gap-1 items-center">
                  <Icon as={MapPin} size="sm" />
                  <Text
                    numberOfLines={2}
                    className="text-sm text-typography/80 "
                  >
                    {composeFullAddress(booking.property.address)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View className="items-center justify-between mt-3 bg-background-muted p-4 gap-2 rounded-2xl border border-outline-100">
            <View className=" bg-background px-4 py-3 rounded-2xl flex-row gap-2 items-center">
              <View className="bg-background-muted rounded-xl border border-outline-100 p-2">
                <Icon as={Calendar} size="sm" />
              </View>
              <Text className="text-sm flex-1 text-typography/80">
                Scheduled Date
              </Text>
              <Text className="font-medium text-sm ">
                {format(new Date(booking.scheduled_date), "MMMM dd, yyyy")}
              </Text>
            </View>
            <View className=" bg-background px-4 py-3 rounded-xl flex-row gap-2 items-center">
              <View className="bg-background-muted rounded-xl border border-outline-100 p-2">
                <Icon as={Clock} size="sm" />
              </View>
              <Text className="text-sm flex-1 text-typography/80">
                Scheduled Time
              </Text>
              <Text className="font-medium text-sm ">
                {format(new Date(booking.scheduled_date), "hh:mm a")}
              </Text>
            </View>
            <View className="flex-row justify-between gap-4">
              {booking.duration && booking.booking_type == "reservation" && (
                <View className="flex-1 bg-background px-4 py-3 rounded-2xl flex-row gap-2 items-center">
                  <View className="bg-background-muted rounded-xl border border-outline-100 p-2">
                    <Icon as={ClockFading} size="sm" />
                  </View>
                  <Text className="text-sm flex-1 text-typography/80">
                    Duration
                  </Text>
                  <Text className="font-medium text-sm ">
                    {booking.duration}{" "}
                    {booking.duration > 1 ? "Nights" : "Night"}
                  </Text>
                </View>
              )}
              {booking.guest && booking.booking_type == "reservation" && (
                <View className=" bg-background px-4 py-3 rounded-xl flex-row gap-2 items-center">
                  <View className="bg-background-muted rounded-xl border border-outline-100 p-2">
                    <Icon as={UsersIcon} size="sm" />
                  </View>
                  <Text className="font-medium text-sm ">
                    {booking.guest} {booking.guest > 1 ? "Guests" : "Guest"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {booking.booking_type == "reservation" && (
            <View className="bg-background-muted p-4 rounded-2xl border border-outline-100 items-center gap-1 justify-between mt-4">
              <Text className="font-medium text-typography/80">
                Total Amount
              </Text>
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
                    media_type: "IMAGE",
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
                    media_type: "IMAGE",
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
      </ModalScreen>
    </>
  );
};
