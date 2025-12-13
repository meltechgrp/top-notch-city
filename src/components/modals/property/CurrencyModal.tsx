import React, { useState } from "react";
import { Modal, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Check, X } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Icon, Text, View } from "@/components/ui";
import { fetchAllCurrencies } from "@/actions/property/currency";

export function CurrencyPickerModal({
  open,
  onClose,
  onSelect,
  selected,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (v: { code: string; symbol: string }) => void;
  selected?: {
    code: string;
    symbol: string;
  };
}) {
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["currencies"],
    queryFn: fetchAllCurrencies,
  });

  const currencies = data ?? [];

  const filtered = currencies.filter((c) => {
    const label = `${c.code} - ${c.name} (${c.symbol})`;
    return label.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <Modal visible={open} transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-background rounded-2xl p-4 max-h-[95%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold">Select Currency</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon as={X} size={"xl"} />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Search currency..."
            placeholderTextColor="#777"
            value={query}
            onChangeText={setQuery}
            className="bg-background-muted h-12 rounded-xl text-typography px-3 mb-4"
          />

          {isLoading && <Text className="text-center py-6">Loading...</Text>}

          {isError && (
            <Text className="text-center py-6 text-red-500">
              Failed to load currencies
            </Text>
          )}

          {!isLoading && !isError && (
            <ScrollView className="max-h-[90%] h-[80%]">
              {filtered.map((c) => {
                const label = `${c.code} - ${c.name} (${c.symbol})`;
                const disabled = selected?.code == c.code;

                return (
                  <TouchableOpacity
                    key={c.id}
                    disabled={disabled}
                    onPress={() => {
                      onSelect({ symbol: c.symbol, code: c.code });
                      onClose();
                    }}
                    className={cn(
                      "px-4 flex-row py-4 rounded-xl mb-2 justify-between items-center",
                      disabled
                        ? "bg-background-muted/80"
                        : "bg-background-muted"
                    )}
                  >
                    <Text
                      className={cn(
                        "text-sm",
                        disabled && "text-typography/70"
                      )}
                    >
                      {label}
                    </Text>

                    {disabled && (
                      <Icon size={"sm"} as={Check} className="text-primary" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
