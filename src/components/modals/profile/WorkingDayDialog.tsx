import { Modal } from "react-native";
import { useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "@/components/ui";
import { InlineTimePicker, TimePicker } from "@/components/custom/TimePicker";
import { SafeAreaView } from "react-native-safe-area-context";

export function WorkingDayDialog({
  visible,
  day,
  initial,
  onClose,
  onSave,
}: {
  visible: boolean;
  day: string;
  initial?: string;
  onClose: () => void;
  onSave: (day: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<string | undefined>();
  const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);

  const [end, setEnd] = useState<string | undefined>();

  useEffect(() => {
    if (initial) {
      const [s, e] = initial.split("-");
      setOpen(true);
      setStart(s);
      setEnd(e);
    } else {
      setOpen(false);
      setStart(undefined);
      setEnd(undefined);
    }
  }, [initial, visible]);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);

    if (next && (!start || !end)) {
      setStart("09:00");
      setEnd("18:00");
    }
  };

  const remove = () => {
    onSave(day, "");
    onClose();
  };

  const save = () => {
    if (!open) {
      onSave(day, "");
      onClose();
      return;
    }
    onSave(day, `${start}-${end}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/30 justify-end">
        <SafeAreaView
          edges={["bottom"]}
          className="bg-background rounded-t-2xl border-t border-outline-100"
        >
          <View className=" px-4 py-6 rounded-t-2xl bg-background">
            <Text className="text-center text-xl mb-6 capitalize ">{day}</Text>

            <View className="bg-background-muted rounded-xl p-4 flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-lg capitalize ">{day}</Text>
                <Text className="text-gray-400">
                  {open ? "Open" : "Closed"}
                </Text>
              </View>

              <Switch size="md" value={open} onToggle={toggleOpen} />
            </View>

            {open && (
              <View className="bg-[#111] rounded-2xl overflow-hidden mt-4">
                <Pressable
                  onPress={() =>
                    setOpenPicker((prev) => (prev === "start" ? null : "start"))
                  }
                  className="p-4 flex-row items-center justify-between"
                >
                  <Text className="text-lg text-white">Starts</Text>
                  <Text className="text-lg text-white">{start}</Text>
                </Pressable>

                {openPicker === "start" && (
                  <InlineTimePicker value={start} onChange={setStart} />
                )}

                <View className="h-[1px] bg-white/10 mx-4" />

                <Pressable
                  onPress={() =>
                    setOpenPicker((prev) => (prev === "end" ? null : "end"))
                  }
                  className="p-4 flex-row items-center justify-between"
                >
                  <Text className="text-lg text-white">Ends</Text>
                  <Text className="text-lg text-white">{end}</Text>
                </Pressable>

                {openPicker === "end" && (
                  <InlineTimePicker value={end} onChange={setEnd} />
                )}

                <View className="py-4">
                  <Text
                    onPress={remove}
                    className="text-center text-red-500 text-lg"
                  >
                    Remove
                  </Text>
                </View>
              </View>
            )}

            <View className="mt-10 flex-row gap-4">
              <Pressable
                onPress={onClose}
                className=" bg-background-muted rounded-xl p-4 flex-1"
              >
                <Text className=" text-center">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={save}
                className=" bg-primary rounded-xl p-4 flex-1"
              >
                <Text className=" text-center text-lg font-semibold">Done</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
