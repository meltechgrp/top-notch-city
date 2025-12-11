import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { CustomInput } from "../custom/CustomInput";
import { Button, ButtonText, Pressable, Text } from "../ui";
import { useMutation } from "@tanstack/react-query";
import { sendBooking } from "@/actions/bookings";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  addDays,
  format,
  isToday,
  isTomorrow,
  setHours,
  setMinutes,
} from "date-fns";

export type BookingFormProps = {
  visible: boolean;
  onDismiss?: () => void;
  booking_type: Bookingtype;
  property_id: string;
  agent_id: string;
};

export const BookingFormBottomSheet: React.FC<BookingFormProps> = ({
  visible,
  onDismiss,
  booking_type,
  property_id,
  agent_id,
}) => {
  const { me } = useStore((s) => s);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendBooking,
    onSuccess: () =>
      showErrorAlert({
        title: "Message sent successfully",
        alertType: "success",
      }),
    onError: (err) =>
      showErrorAlert({
        title: "Something went wrong, try again!",
        alertType: "error",
      }),
  });
  const [formData, setFormData] = useState<BookingForm>({
    notes: "",
    booking_type,
    property_id,
    agent_id,
    scheduled_date: null,
    scheduled_time: null,
    duration_days: "1",
  });

  const handleUpdate = (field: keyof typeof formData) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.scheduled_date ||
      !formData.property_id ||
      !formData.agent_id ||
      !formData.booking_type
    )
      return showErrorAlert({
        title: "Please select date and time",
        alertType: "warn",
      });
    await mutateAsync({ form: formData });
    onDismiss?.();
  };

  const days = useMemo(() => {
    const daysArray = Array.from({ length: 30 }, (_, index) =>
      addDays(new Date(), index)
    );
    return daysArray;
  }, []);
  const hoursOfDay = useMemo(generateBookingTimes, []);

  useEffect(() => {
    if (!(formData.scheduled_time && formData.scheduled_date)) return;

    if (
      !isTimeValid(
        formData.scheduled_time.hour,
        formData.scheduled_date || new Date()
      )
    ) {
      handleUpdate("scheduled_time")(null);
    }
  }, [formData.scheduled_time, formData.scheduled_date, handleUpdate]);

  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={[booking_type == "inspection" ? "60%" : "75%"]}
      title={
        booking_type == "inspection" ? "Schedule a visit" : "Book a reservation"
      }
      withHeader
      backdropVariant="xl"
      withScroll
      enableOverDrag={false}
      enablePanDownToClose={false}
      addBackground
    >
      <View className="flex-1 bg-background p-4 gap-4">
        <ScrollView className="flex-1">
          <View className="gap-y-5 mt-2">
            <View className="gap-y-6 pb-10">
              {booking_type == "reservation" && (
                <View className="px-4 ">
                  <CustomInput
                    title="Duration"
                    placeholder="Choose duration days"
                    value={formData.duration_days}
                    onUpdate={handleUpdate("duration_days")}
                    keyboardType="decimal-pad"
                  />
                </View>
              )}
              <View className="gap-y-3">
                <Text className="px-4 text-sm">Select date and time</Text>
                <ScrollView
                  horizontal
                  contentContainerClassName="gap-4 px-4"
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={238 + 4}
                  snapToAlignment="center"
                  decelerationRate="fast"
                >
                  {days.map((d, i) => {
                    return (
                      <DateSelectCard
                        selected={formData.scheduled_date}
                        onChange={handleUpdate("scheduled_date")}
                        date={d}
                        key={i}
                      />
                    );
                  })}
                </ScrollView>
              </View>
              <View className="px-4 h-[1px] bg-outline-100 w-full" />
              <ScrollView
                horizontal
                contentContainerClassName="px-4 flex-row w-[62rem] flex-wrap px-4 gap-6"
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={238 + 4}
                snapToAlignment="center"
                decelerationRate="fast"
              >
                {hoursOfDay.map((t, i) => {
                  return (
                    <TimeSelectCard
                      onChange={handleUpdate("scheduled_time")}
                      selected={formData.scheduled_time}
                      time={t}
                      key={i}
                      selectedDate={formData.scheduled_date}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </View>
          <Button size="xl" className="mt-4" onPress={handleSubmit}>
            {isPending && <SpinningLoader />}
            <ButtonText>Submit</ButtonText>
          </Button>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

interface DateCardProps {
  date: Date;
  selected: Date | null;
  onChange: (value: any) => void;
}

function DateSelectCard({ date, selected, onChange }: DateCardProps) {
  const label = useMemo(() => {
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "EEEE");
    }
  }, []);
  const serialize = (t: Date) => format(t, "dd-MM-yy");
  const isSelected = selected ? serialize(selected) === serialize(date) : false;
  return (
    <Pressable onPress={() => date && onChange(date)}>
      <View
        className={cn(
          " h-16 min-w-24 px-4 py-2 gap-2 border  bg-background-muted rounded-lg justify-center items-start",
          isSelected ? "border-primary" : "border-outline-100"
        )}
      >
        <Text className="text-sm">{label}</Text>
        <Text className="text-sm text-typography/80">
          {format(date, "MMM d")}
        </Text>
      </View>
    </Pressable>
  );
}

interface TimeCardProps {
  time: { hour: number; minute: number };
  selected: { hour: number; minute: number } | null;
  onChange: (value: { hour: number; minute: number }) => void;
  selectedDate: Date | null;
}

function TimeSelectCard({
  time,
  selected,
  onChange,
  selectedDate,
}: TimeCardProps) {
  const { hour, minute } = time;

  const isSelected = selected?.hour === hour && selected?.minute === minute;

  const baseDate = selectedDate || new Date();

  const fullDate = setMinutes(setHours(baseDate, hour), minute);

  const isValidTime = fullDate.getTime() > Date.now();

  return (
    <Pressable
      className="h-10 w-[6rem]"
      onPress={() => isValidTime && onChange(time)}
    >
      <View
        className={cn(
          "px-4 py-2 gap-3 border bg-background-muted rounded-lg justify-center items-center",
          isSelected ? "border-primary" : "border-outline-100",
          !isValidTime && "opacity-50"
        )}
      >
        <Text className="text-sm">{format(fullDate, "h:mm a")}</Text>
      </View>
    </Pressable>
  );
}

function isTimeValid(time: number, date: Date) {
  return Date.now() + 10 * 60 * 60 < setHours(date, time).getTime();
}

function generateBookingTimes() {
  const times: { hour: number; minute: number }[] = [];

  for (let hour = 7; hour <= 18; hour++) {
    times.push({ hour, minute: 0 });

    if (hour !== 18) {
      times.push({ hour, minute: 30 });
    }
  }

  return times;
}
