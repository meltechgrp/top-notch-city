import React, { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import { cn } from "@/lib/utils";
import DatePicker from "@/components/custom/DatePicker";
import { Pressable, Text } from "@/components/ui";
import { formatISO } from "date-fns";

interface Availability {
  start: string;
  end: string;
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (value: Availability) => void;
}

export const AvailabilityPickerSheet = ({
  visible,
  onDismiss,
  onSelect,
}: Props) => {
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const formatStart = (date: string | Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return formatISO(d);
  };

  const formatEnd = (date: string | Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return formatISO(d);
  };
  useEffect(() => {
    setSelectedStart(null);
    setSelectedEnd(null);
  }, []);
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-center">
        <View className="bg-background-muted p-6 rounded-2xl">
          <View className="mb-6">
            <Text className="text-base font-medium">
              Select Start and End Date
            </Text>
          </View>

          <View className="mb-8">
            <DatePicker
              label="Select Start"
              placeholder="Day / Month / Year"
              value={selectedStart}
              className="bg-background"
              formatPattern="EEE, dd-MMM-yyyy"
              onChange={(val) => {
                const date = new Date(val);
                setSelectedStart(date);
              }}
              mode="date"
              minimumDate={new Date()}
              startDate={new Date()}
              maximumDate={undefined}
            />
          </View>

          <View className="mb-8">
            <DatePicker
              label="Select End"
              placeholder="Day / Month / Year"
              formatPattern="EEE, dd-MMM-yyyy"
              className="bg-background"
              disabled={!selectedStart}
              value={selectedEnd}
              onChange={(val) => {
                const d = new Date(val);
                setSelectedEnd(d);
              }}
              mode="date"
              minimumDate={new Date()}
              startDate={new Date()}
              maximumDate={undefined}
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
              disabled={!selectedStart || !selectedEnd}
              onPress={() => {
                if (!selectedStart || !selectedEnd) return;

                onSelect({
                  start: formatStart(selectedStart),
                  end: formatEnd(selectedEnd),
                });
                onDismiss();
              }}
              className={cn(
                "bg-primary rounded-xl flex-1 py-3 items-center",
                !selectedStart || !selectedEnd ? "opacity-40" : ""
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
