import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ButtonsInput, CustomInput } from "../../custom/CustomInput";
import { Button, ButtonText, Text, Image, Icon } from "../../ui";
import { useMutation } from "@tanstack/react-query";
import { sendBooking } from "@/actions/bookings";
import { SpinningLoader } from "../../loaders/SpinningLoader";
import { generateMediaUrlSingle } from "@/lib/api";
import {
  setHours,
  setMinutes,
  isWithinInterval,
  parseISO,
  format,
  isSunday,
} from "date-fns";
import DatePicker from "@/components/custom/DatePicker";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { Mail, Plus, Save, User } from "lucide-react-native";
import DropdownSelect from "@/components/custom/DropdownSelect";
import { ExternalLink } from "@/components/ExternalLink";
import ModalScreen from "@/components/shared/ModalScreen";
import { useMe } from "@/hooks/useMe";
import { propertyAvailabilityCollection } from "@/db/collections";
import { Q } from "@nozbe/watermelondb";
import { cn, showSnackbar } from "@/lib/utils";

export type BookingFormProps = {
  visible: boolean;
  onDismiss?: () => void;
  booking_type: Bookingtype;
  property_id: string;
  agent_id: string;
  image: string;
  address?: string;
};

export const BookingFormBottomSheet = ({
  visible,
  onDismiss,
  booking_type,
  property_id,
  agent_id,
  image,
  address,
}: BookingFormProps) => {
  const { me } = useMe();
  const [availableDates, setAvailableDates] = useState<Availabilities[]>([]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendBooking,
    onSuccess: () =>
      showErrorAlert({
        title: "Message sent successfully",
        alertType: "success",
      }),
    onError: (e) => {
      console.log(e);
      showSnackbar({
        message: e?.message || "Something went wrong, try again!",
        type: "error",
      });
    },
  });
  const [error, setError] = useState(false);
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
        ? `I am interested in your property at ${address}`
        : "",
  });
  const isReservation = booking_type == "reservation";
  const updateField = (key: keyof BookingForm, value: any) =>
    setFormData((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!formData.scheduled_date) {
      return showSnackbar({
        message: "Select date and time",
        type: "warning",
      });
    }

    if (isReservation) {
      if (
        !Number(formData.duration_days) ||
        Number(formData.duration_days) <= 0
      ) {
        return showSnackbar({
          message: "Enter valid duration",
          type: "warning",
        });
      }

      if (!Number(formData.guest) || Number(formData.guest) <= 0) {
        return showSnackbar({
          message: "Enter number of guests",
          type: "warning",
        });
      }
    }

    await mutateAsync({
      form: {
        ...formData,
        duration_days: formData.duration_days,
        guest: formData.guest,
      },
    });

    onDismiss?.();
  };

  const isReservationDateAllowed = (date: Date) => {
    if (!availableDates?.length) return true;
    return availableDates.some((range) => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      return (
        isSameDay(date, start) ||
        isSameDay(date, end) ||
        isWithinInterval(date, {
          start: setHours(start, 0),
          end: setHours(end, 23),
        })
      );
    });
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isInspectionDateAllowed = (date: Date) => {
    return !isSunday(date);
  };

  const INSPECTION_START_HOUR = 8;
  const INSPECTION_END_HOUR = 17;
  const INSPECTION_END_MINUTE = 30;

  const clampInspectionTime = (date: Date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    if (h < INSPECTION_START_HOUR)
      return setHours(setMinutes(date, 0), INSPECTION_START_HOUR);
    if (
      h > INSPECTION_END_HOUR ||
      (h === INSPECTION_END_HOUR && m > INSPECTION_END_MINUTE)
    )
      return setHours(setMinutes(date, INSPECTION_END_MINUTE), INSPECTION_END_HOUR);
    return date;
  };

  const isTimeAllowedForInspection = (hour: number, minute: number) => {
    if (hour < INSPECTION_START_HOUR) return false;
    if (hour > INSPECTION_END_HOUR) return false;
    if (hour === INSPECTION_END_HOUR && minute > INSPECTION_END_MINUTE)
      return false;
    return true;
  };

  useEffect(() => {
    async function getDates() {
      const dates = await propertyAvailabilityCollection
        .query(Q.where("property_server_id", property_id))
        .fetch();
      const available = dates?.map((a) => ({
        start: new Date(a.start).toISOString(),
        end: new Date(a.end).toISOString(),
        id: property_id,
      }));
      setAvailableDates(available);
    }
    getDates();
  }, [property_id]);

  return (
    <>
      <ModalScreen
        visible={visible}
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
                      {address}
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
                      {address}
                    </Text>
                  )}
                  . Your booking guarantees availability for your selected date
                  and time.
                </Text>
              </View>
            )}
            <View className="mt-4">
              {booking_type === "reservation" ? (
                <ReservationDatesInfo availableDates={availableDates} />
              ) : (
                <View className="border border-primary/50 px-4 py-4 rounded-xl ">
                  <Text className="text-sm text-typography/90">
                    Inspection is between 8am to 5:30pm, every day except Sunday
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-sm mt-8 text-typography/80">
              Select Date:
            </Text>
            <View className="mb-4 mt-2">
              <DatePicker
                label="Select Date"
                value={formData.scheduled_date}
                mode="date"
                placeholder="dd/mm/yyyy"
                formatPattern="dd MMMM, yyyy"
                minimumDate={new Date()}
                onChange={(val) => {
                  let next = new Date(val);

                  if (!isReservation && !isInspectionDateAllowed(next)) {
                    showErrorAlert({
                      title: "Inspections are not available on Sundays",
                      alertType: "warn",
                    });
                    return;
                  }

                  if (isReservation && !isReservationDateAllowed(next)) {
                    showErrorAlert({
                      title: "Date not available",
                      alertType: "warn",
                    });
                    return;
                  }

                  setFormData((p) => ({
                    ...p,
                    scheduled_date: next.toISOString(),
                  }));
                }}
                maximumDate={undefined}
              />
            </View>

            <View className="mb-8">
              <DatePicker
                label="Select Time"
                mode="time"
                disabled={!formData.scheduled_date}
                placeholder="hh:mm"
                formatPattern="hh:mm a"
                className={cn(error && "border-primary")}
                value={formData.scheduled_date}
                minimumDate={undefined}
                maximumDate={
                  isReservation
                    ? undefined
                    : new Date(new Date().setHours(INSPECTION_END_HOUR, INSPECTION_END_MINUTE))
                }
                onChange={(val) => {
                  if (!formData.scheduled_date) return;

                  const picked = new Date(val);
                  if (
                    !isReservation &&
                    !isTimeAllowedForInspection(
                      picked.getHours(),
                      picked.getMinutes()
                    )
                  ) {
                    setError(true);
                    showErrorAlert({
                      title: "Inspection hours are 8:00 AM to 5:30 PM",
                      alertType: "warn",
                    });
                    return;
                  }

                  setError(false);
                  let base = new Date(formData.scheduled_date);
                  let next = setHours(base, picked.getHours());
                  next = setMinutes(next, picked.getMinutes());

                  if (booking_type === "inspection") {
                    next = clampInspectionTime(next);
                  }

                  setFormData((p) => ({
                    ...p,
                    scheduled_date: next.toISOString(),
                  }));
                }}
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
    </>
  );
};

type Props = {
  availableDates?: Availabilities[];
};

export function ReservationDatesInfo({ availableDates }: Props) {
  if (!availableDates || availableDates.length === 0) return null;

  return (
    <View className="mb-4 p-3 rounded-xl bg-background-muted border border-outline-100">
      <Text className="text-sm font-medium mb-2">
        Available Reservation Dates
      </Text>

      {availableDates.map((range, index) => {
        const start = format(new Date(range.start), "MMM dd, yyyy");
        const end = format(new Date(range.end), "MMM dd, yyyy");

        return (
          <View
            key={index}
            className="flex-row justify-between items-center py-1"
          >
            <Text className="text-xs text-typography/80">{start}</Text>
            <Text className="text-xs text-typography/60">→</Text>
            <Text className="text-xs text-typography/80">{end}</Text>
          </View>
        );
      })}

      <Text className="text-[11px] text-typography/60 mt-2">
        You can only book within these date ranges
      </Text>
    </View>
  );
}
