import React, { useState } from "react";
import { View } from "react-native";
import BottomSheet from "../../shared/BottomSheet";
import { ButtonsInput, CustomInput } from "../../custom/CustomInput";
import { Button, ButtonText, Text, Image, Icon, Pressable } from "../../ui";
import { useMutation } from "@tanstack/react-query";
import { sendBooking } from "@/actions/bookings";
import { SpinningLoader } from "../../loaders/SpinningLoader";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useStore } from "@/store";
import { DateTimePickerSheet } from "./DateTimePickerSheet";
import { composeFullAddress } from "@/lib/utils";
import { generateMediaUrlSingle } from "@/lib/api";
import { format } from "date-fns";
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
  const [step, setStep] = useState<1 | 2>(1);
  const [dateSheetVisible, setDateSheetVisible] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendBooking,
    onSuccess: () =>
      showErrorAlert({
        title: "Message sent successfully",
        alertType: "success",
      }),
    onError: () =>
      showErrorAlert({
        title: "Something went wrong, try again!",
        alertType: "error",
      }),
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

  return (
    <>
      <BottomSheet
        visible={visible}
        onDismiss={onDismiss}
        snapPoint={["80%"]}
        title={
          booking_type === "inspection"
            ? "Schedule a visit"
            : "Book a reservation"
        }
        withHeader
        addBackground
        enableDynamicSizing
      >
        <View className="flex-1 bg-background p-4">
          {step === 1 && (
            <View className="flex-1">
              <View className="w-full h-48 rounded-2xl mb-3">
                <Image
                  source={{ uri: generateMediaUrlSingle(image) }}
                  rounded
                />
              </View>
              {booking_type === "inspection" && (
                <View>
                  <Text className="text-xs text-typography/80 mt-1">
                    An experienced agent will guide you through a private tour
                    of{" "}
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
                    . Your booking guarantees availability for your selected
                    date and time.
                  </Text>
                </View>
              )}

              <Text className="text-sm mt-8 text-typography/80">
                Selected Date:
              </Text>
              <Pressable
                onPress={() => setDateSheetVisible(true)}
                className="mt-1 h-14 p-4 bg-background-muted rounded-xl"
              >
                {formData.scheduled_date ? (
                  <View className="flex-row items-center gap-2">
                    <Icon as={Clock} size="md" className="text-info-100" />
                    <Text className="font-bold">
                      {format(new Date(formData.scheduled_date), "EEE, dd-MMM")}{" "}
                      at {""}
                      {format(new Date(formData.scheduled_date), "hh:mm a")}
                    </Text>
                    <Icon as={CircleX} className="text-primary ml-auto" />
                  </View>
                ) : (
                  <View className="flex-row justify-between">
                    <Text className="text-typography/80 text-sm">
                      Select Date & Time
                    </Text>
                    <Icon as={PlusCircle} className="text-primary" />
                  </View>
                )}
              </Pressable>

              <Button
                size="xl"
                className="mt-auto"
                disabled={!formData.scheduled_date}
                isDisabled={!formData.scheduled_date}
                onPress={() => setStep(2)}
              >
                <ButtonText>Continue</ButtonText>
              </Button>
            </View>
          )}
          {step === 2 && (
            <View className="flex-1">
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
                    label="days"
                    placeholder="Add duration"
                    value={formData.duration_days?.toString()}
                    onUpdate={(v) => updateField("duration_days", v)}
                  />
                  <ButtonsInput
                    title="Guests"
                    label="guests"
                    placeholder="Number of guests"
                    value={formData.guest?.toString()}
                    onUpdate={(v) => updateField("guest", v)}
                  />

                  <ButtonsInput
                    title="Beds (optional)"
                    placeholder="Number of beds"
                    label="bed"
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
              <View className="flex-row gap-4 mt-8">
                <Button
                  size="xl"
                  className="flex-1 bg-background-muted"
                  disabled={!formData.scheduled_date}
                  isDisabled={!formData.scheduled_date}
                  onPress={() => setStep(1)}
                >
                  <Icon as={ChevronLeft} />
                  <ButtonText>Back</ButtonText>
                </Button>
                <Button size="xl" className="flex-1" onPress={handleSubmit}>
                  {isPending ? <SpinningLoader /> : <Icon as={Save} />}
                  <ButtonText>Submit</ButtonText>
                </Button>
              </View>
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
          )}
        </View>
      </BottomSheet>

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
