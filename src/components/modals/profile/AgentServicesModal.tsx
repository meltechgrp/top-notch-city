import React, { useState } from "react";
import { Modal, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Check, X } from "lucide-react-native";
import { ALL_SERVICES } from "@/constants/user";
import { cn } from "@/lib/utils";
import { Icon, Text, View } from "@/components/ui";

export function AgentServicesModal({
  open,
  onClose,
  onSelect,
  selected,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (v: string) => void;
  selected: string[];
}) {
  const [query, setQuery] = useState("");

  const filtered = ALL_SERVICES.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={open} transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-background rounded-2xl p-4 max-h-[80%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className=" text-lg font-semibold">Add Service</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon as={X} size={22} />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Search service..."
            placeholderTextColor="#777"
            value={query}
            onChangeText={setQuery}
            className="bg-background-muted  h-12 rounded-xl text-typography px-3 mb-4"
          />

          <ScrollView className="max-h-[90%] h-[80%]">
            {filtered.map((s) => {
              const disabled = selected.includes(s);
              return (
                <TouchableOpacity
                  key={s}
                  disabled={disabled}
                  onPress={() => {
                    onSelect(s);
                    onClose();
                  }}
                  className={`px-4 flex-row py-4 rounded-xl mb-2 justify-between items-center ${
                    disabled ? "bg-background-muted/80" : "bg-background-muted"
                  }`}
                >
                  <Text
                    className={cn("text-sm", disabled && "text-typography/70")}
                  >
                    {s}
                  </Text>
                  {disabled && (
                    <Icon size={"sm"} as={Check} className="text-primary" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
