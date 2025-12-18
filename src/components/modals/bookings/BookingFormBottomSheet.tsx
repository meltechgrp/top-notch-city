import React, { useState, useMemo, useEffect } from "react";
import { View } from "react-native";
import BottomSheet from "../../shared/BottomSheet";
import { ButtonsInput, CustomInput } from "../../custom/CustomInput";
import { Button, ButtonText, Text, Image, Icon, Pressable } from "../../ui";
import { useMutation } from "@tanstack/react-query";
import { sendBooking } from "@/actions/bookings";
import { SpinningLoader } from "../../loaders/SpinningLoader";
import { useStore } from "@/store";
import { DateTimePickerSheet } from "./DateTimePickerSheet";
import { composeFullAddress } from "@/lib/utils";
import { generateMediaUrlSingle } from "@/lib/api";
import {
  setHours,
  setMinutes,
  addMinutes,
  isWithinInterval,
  parseISO,
  isAfter,
  format,
  isToday,
  addHours,
} from "date-fns";
import DatePicker from "@/components/custom/DatePicker";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import {
  ChevronLeft,
  CircleX,
  Clock,
  Mail,
  Plus,
  PlusCircle,
  Save,
  User,
} from "lucide-react-native";
import DropdownSelect from "@/components/custom/DropdownSelect";
import { ExternalLink } from "@/components/ExternalLink";
import ModalScreen from "@/components/shared/ModalScreen";

export type BookingFormProps = {
  visible: boolean;
  onDismiss?: () => void;
  booking_type: Bookingtype;
  property_id: string;
  agent_id: string;
  image: string;
  title: string;
  availableDates?: Availabilities[];
  address?: Property["address"];
};

export const BookingFormBottomSheet = ({
  visible,
  onDismiss,
  booking_type,
  property_id,
  agent_id,
  image,
  address,
  title,
  availableDates,
}: BookingFormProps) => {
  const { me } = useStore();
  const [dateSheetVisible, setDateSheetVisible] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendBooking,
    onSuccess: () =>
      showErrorAlert({
        title: "Message sent successfully",
        alertType: "success",
      }),
    onError: (e) => {
      console.log(e);
      showErrorAlert({
        title: e?.message || "Something went wrong, try again!",
        alertType: "error",
      });
    },
  });

  const [formData, setFormData] = useState<BookingForm>({
    booking_type,
    property_id,
    agent_id,
    scheduled_date: null,
    duration_days: booking_type == "inspection" ? undefined : "",
    guest: booking_type == "inspection" ? undefined : "",
    additional_request: booking_type == "inspection" ? undefined : [],
    no_of_beds: booking_type == "inspection" ? undefined : "",
    notes:
      booking_type == "inspection"
        ? `I am interested in your property at ${composeFullAddress(address || {})}`
        : "",
  });
  const isReservation = booking_type == "reservation";
  const updateField = (key: keyof BookingForm, value: any) =>
    setFormData((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!formData.scheduled_date)
      return showErrorAlert({
        title: "Please select date & time",
        alertType: "warn",
      });
    if (booking_type === "reservation" && !formData.duration_days)
      return showErrorAlert({
        title: "Please add duration",
        alertType: "warn",
      });
    if (booking_type === "reservation" && !formData.guest)
      return showErrorAlert({
        title: "Please add number of guests",
        alertType: "warn",
      });

    await mutateAsync({ form: formData });
    onDismiss?.();
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
  } | null>(null);

  const validReservationDates = useMemo(() => {
    if (!isReservation) return null;

    return availableDates?.flatMap((range) => {
      const start = parseISO(range.start);
      const end = parseISO(range.end);

      const days: Date[] = [];
      let current = new Date(start);

      while (isAfter(end, current) || +end === +current) {
        days.push(new Date(current));
        current = addMinutes(current, 1440);
      }
      return days;
    });
  }, [availableDates, isReservation]);

  const isDateAllowedForReservation = (date: Date) => {
    return availableDates?.some((range) => {
      const start = parseISO(range.start);
      const end = parseISO(range.end);
      return isWithinInterval(date, { start, end });
    });
  };

  const isTimeAllowedForInspection = (hour: number) => {
    return hour >= 8 && hour <= 18;
  };
  useEffect(() => {
    setSelectedDate(null);
  }, []);
  const date = new Date();
  return (
    <>
      <ModalScreen
        visible={visible}
        disableSwipe
        onDismiss={onDismiss!}
        title={
          booking_type === "inspection"
            ? "Schedule a visit"
            : "Book a reservation"
        }
        withScroll
        rightComponent={
          <Button
            size="md"
            className="rounded-full px-6"
            onPress={handleSubmit}
          >
            <ButtonText>Book</ButtonText>
            {isPending ? <SpinningLoader /> : <Icon as={Save} />}
          </Button>
        }
      >
        <View className="flex-1 bg-background p-4">
          <View className="flex-1">
            <View className="w-full h-48 rounded-2xl mb-3">
              <Image source={{ uri: generateMediaUrlSingle(image) }} rounded />
            </View>
            {booking_type === "inspection" && (
              <View>
                <Text className="text-xs text-typography/80 mt-1">
                  An experienced agent will guide you through a private tour of{" "}
                  {address && (
                    <Text className="text-xs text-typography/90 font-medium">
                      {composeFullAddress(address, true)}
                    </Text>
                  )}{" "}
                  to help you assess the space and ask any questions you may
                  have.
                </Text>
              </View>
            )}
            {booking_type === "reservation" && (
              <View>
                <Text className="text-sm mt-1 text-typography/80">
                  Secure your stay at{" "}
                  {address && (
                    <Text className="text-sm text-typography/90 font-medium">
                      {composeFullAddress(address, true)}
                    </Text>
                  )}
                  . Your booking guarantees availability for your selected date
                  and time.
                </Text>
              </View>
            )}

            <Text className="text-sm mt-8 text-typography/80">
              Select Date:
            </Text>
            <View className="mb-4 mt-2">
              <DatePicker
                label="Select Date"
                placeholder="Day / Month / Year"
                value={selectedDate}
                className="bg-background"
                onChange={(val) => {
                  const date = new Date(val);
                  if (isReservation && !isDateAllowedForReservation(date)) {
                    setSelectedDate(null);
                    return;
                  }
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                mode="date"
                minimumDate={new Date()}
                startDate={
                  isReservation
                    ? (validReservationDates?.[0] ?? new Date())
                    : new Date()
                }
                maximumDate={
                  isReservation
                    ? validReservationDates?.[validReservationDates.length - 1]
                    : undefined
                }
              />
            </View>

            <View className="mb-8">
              <DatePicker
                label="Select Time"
                placeholder="HH : MM"
                formatPattern="hh:mm"
                className="bg-background"
                disabled={!selectedDate}
                value={
                  formData.scheduled_date && selectedDate
                    ? new Date(formData.scheduled_date)
                    : null
                }
                onChange={(val) => {
                  const d = new Date(val);
                  const hour = d.getHours();
                  const minute = d.getMinutes();
                  if (!selectedDate) return;
                  if (!isReservation && !isTimeAllowedForInspection(hour)) {
                    showErrorAlert({
                      title: "Inspection is between 8am to 5:30pm",
                      alertType: "warn",
                    });
                    setSelectedTime(null);
                    return;
                  }
                  const finalDate = setMinutes(
                    setHours(selectedDate, hour),
                    minute
                  );
                  setFormData((p) => ({ ...p, scheduled_date: finalDate }));
                }}
                minuteInterval={5}
                mode="time"
                minimumDate={
                  selectedDate && isToday(selectedDate)
                    ? date
                    : isReservation
                      ? new Date(addHours(date, 1))
                      : new Date(date.setHours(8, 0, 0))
                }
                startDate={date}
                maximumDate={
                  selectedDate && isToday(selectedDate)
                    ? date
                    : isReservation
                      ? undefined
                      : new Date(date.setHours(17, 30, 0))
                }
              />
            </View>
          </View>
          <View className="flex-1 mt-4">
            {booking_type === "inspection" && (
              <View className="gap-3 mb-6 flex-1">
                <Text className="font-medium text-sm">Your Information</Text>
                <View className="flex-row gap-2 items-center bg-background-muted border border-outline-100 text-center rounded-xl px-4 h-16">
                  <View className="p-2 border border-outline-100 rounded-full">
                    <Icon as={User} className="text-primary" />
                  </View>
                  <Text className="text-base">
                    {me?.first_name} {me?.last_name}
                  </Text>
                </View>
                <View className="flex-row gap-2 items-center bg-background-muted border border-outline-100 text-center rounded-xl px-4 h-16">
                  <View className="p-2 border border-outline-100 rounded-full">
                    <Icon as={Mail} className="text-primary" />
                  </View>
                  <Text className="text-base">{me?.email}</Text>
                </View>
                <View className="flex-1">
                  <CustomInput
                    value={formData.notes}
                    onUpdate={(v) => updateField("notes", v)}
                    title="Message"
                    placeholder="enter a message"
                    multiline
                  />
                </View>
              </View>
            )}
            {booking_type === "reservation" && (
              <View className="gap-5">
                <ButtonsInput
                  title="Duration (days)"
                  value={formData.duration_days?.toString()}
                  onUpdate={(v) => updateField("duration_days", v)}
                />
                <ButtonsInput
                  title="Guests"
                  value={formData.guest?.toString()}
                  onUpdate={(v) => updateField("guest", v)}
                />

                <ButtonsInput
                  title="Beds (optional)"
                  value={formData.no_of_beds?.toString()}
                  onUpdate={(v) => updateField("no_of_beds", v)}
                />

                <View className="gap-1">
                  <Text className="text-sm text-typography/80 font-medium pl-2">
                    Additional Request (optional)
                  </Text>
                  <View className="flex-row justify-between bg-background-muted rounded-xl border border-outline-100 px-4 py-2 items-center">
                    {Array.isArray(formData.additional_request) &&
                    formData.additional_request?.length > 0 ? (
                      <Text className="flex-1 text-typography/80">
                        <Text className="font-medium">
                          {formData.additional_request.length}
                        </Text>{" "}
                        additional requests
                      </Text>
                    ) : (
                      <Text className="text-typography/80 text-sm">
                        Special request?
                      </Text>
                    )}
                    <DropdownSelect
                      icon={Plus}
                      value={formData.additional_request}
                      multiple
                      options={[
                        "fully serviced apartment",
                        "extra charges",
                        "24/7 light or backup power",
                        "wifi availability",
                        "equipped kitchen",
                        "parking space",
                        "secure environment",
                        "visitors allowed",
                        "smoking allowed",
                        "pets allowed",
                        "security personnel",
                        "swimming pool",
                        "gym access",
                        "air conditioning",
                        "hot water availability",
                        "parties allowed",
                        "daily housekeeping",
                        "refundable caution deposit",
                      ]}
                      onChange={(v) => updateField("additional_request", v)}
                      className="p-1.5 border border-primary bg-background rounded-full"
                    />
                  </View>
                </View>
              </View>
            )}
            <Text className="text-xs mt-6 border border-info-100/50 rounded-xl p-4 leading-relaxed text-typography/80">
              By pressing Submit, you agree that TopNotch City and its
              affiliates may call/ text you about your schedule/booking, which
              may involve use of automated means and prerecorded/artificial
              voices. You also agree to our{" "}
              <ExternalLink href={"https://topnotchcity.com/privacy"}>
                <Text className="text-blue-600 text-sm">Terms of Use.</Text>
              </ExternalLink>
            </Text>
          </View>
        </View>
      </ModalScreen>

      <DateTimePickerSheet
        visible={dateSheetVisible}
        onDismiss={() => setDateSheetVisible(false)}
        availableDates={availableDates}
        isReservation={booking_type == "reservation"}
        onSelect={(d) => {
          updateField("scheduled_date", d);
          setDateSheetVisible(false);
        }}
      />
    </>
  );
};
