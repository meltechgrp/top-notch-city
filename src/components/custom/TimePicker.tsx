import { useState } from "react";
import DatePicker from "./DatePicker";
import { format } from "date-fns";
import { Text, View } from "@/components/ui";
import DatePickerLib from "react-native-date-picker";

export function TimePicker({
  label,
  value,
  onChange,
}: {
  label?: string;
  value?: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <DatePicker
      label={label}
      mode="time"
      formatPattern="HH:mm"
      value={
        value
          ? new Date(`1970-01-01T${value}:00`)
          : new Date(`1970-01-01T09:00:00`)
      }
      onChange={(date) => {
        const t = format(new Date(date), "HH:mm");
        onChange(t);
      }}
      placeholder="--:--"
      className="w-[100px]"
    />
  );
}

export function InlineTimePicker({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (v: string) => void;
}) {
  const initial = value
    ? new Date(`1970-01-01T${value}:00`)
    : new Date(`1970-01-01T09:00:00`);

  const [date, setDate] = useState(initial);

  return (
    <View className="p-2 w-full items-center bg-[#111]">
      <DatePickerLib
        date={date}
        onDateChange={(d) => {
          setDate(d);
          onChange(format(d, "HH:mm"));
        }}
        mode="time"
        theme="dark"
      />
    </View>
  );
}
