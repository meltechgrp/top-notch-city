import React, { useEffect, useMemo, useState } from "react";
import { Modal, View } from "react-native";
import { Pressable, Text } from "../../ui";
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
import { cn } from "@/lib/utils";
import DatePicker from "@/components/custom/DatePicker";
import { showErrorAlert } from "@/components/custom/CustomNotification";

interface Availabilities {
  id: string;
  start: string;
  end: string;
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (value: Date) => void;
  isReservation: boolean;
  availableDates?: Availabilities[];
}

export const DateTimePickerSheet = ({
  visible,
  onDismiss,
  onSelect,
  isReservation,
  availableDates = [],
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
  } | null>(null);

  const validReservationDates = useMemo(() => {
    if (!isReservation) return null;

    return availableDates.flatMap((range) => {
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
    return availableDates.some((range) => {
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
    setSelectedTime(null);
  }, []);
  const date = new Date();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-center">
        <View className="bg-background-muted p-6 rounded-2xl">
          {isReservation ? (
            <View className="mb-6">
              <Text className="text-base font-medium mb-1">
                Available Dates
              </Text>
              <View className="flex-row gap-4 flex-wrap">
                {availableDates.map((d) => (
                  <Text key={d.id} className="text-xs text-typography/80">
                    {format(parseISO(d.start), "MMM d")} -{" "}
                    {format(parseISO(d.end), "MMM d, yyyy")}
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            <View className="mb-6">
              <Text className="text-base font-medium">
                Select Date and Time
              </Text>
            </View>
          )}

          <View className="mb-8">
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
                selectedTime && selectedDate
                  ? new Date(
                      setMinutes(
                        setHours(selectedDate, selectedTime.hour),
                        selectedTime.minute
                      )
                    )
                  : null
              }
              onChange={(val) => {
                const d = new Date(val);
                const hour = d.getHours();
                const minute = d.getMinutes();

                if (!isReservation && !isTimeAllowedForInspection(hour)) {
                  showErrorAlert({
                    title: "Inspection is between 8am to 5:30pm",
                    alertType: "warn",
                  });
                  setSelectedTime(null);
                  return;
                }

                setSelectedTime({ hour, minute });
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

          <View className="flex-row gap-4">
            <Pressable
              className=" flex-1 bg-background py-3 rounded-xl items-center"
              onPress={onDismiss}
            >
              <Text className="text-typography/80">Cancel</Text>
            </Pressable>
            <Pressable
              disabled={!selectedDate || !selectedTime}
              onPress={() => {
                if (!selectedDate || !selectedTime) return;

                const finalDate = setMinutes(
                  setHours(selectedDate, selectedTime.hour),
                  selectedTime.minute
                );

                onSelect(finalDate);
              }}
              className={cn(
                "bg-primary rounded-xl flex-1 py-3 items-center",
                !selectedDate || !selectedTime ? "opacity-40" : ""
              )}
            >
              <Text className="text-white font-medium">Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
