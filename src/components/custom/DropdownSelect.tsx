import OptionsBottomSheet from "@/components/shared/OptionsBottomSheet";
import { ChevronDownIcon, Icon, Text } from "@/components/ui";
import { cn } from "@/lib/utils";
import { memo, useState } from "react";
import { TouchableOpacity } from "react-native";

function DropdownSelect({
  value,
  onChange,
  options,
  className,
  format,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  className?: string;
  format?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setShow(true)}
        className={cn(
          "flex-1 flex-row justify-between p-4 rounded-2xl border border-outline items-center gap-2",
          className
        )}
      >
        <Text>{value?.toString() || "Select"}</Text>
        <Icon className="" as={ChevronDownIcon} />
      </TouchableOpacity>
      <OptionsBottomSheet
        isOpen={show}
        format={format}
        onDismiss={() => setShow(false)}
        onChange={async (val) => onChange(val.value)}
        value={{ label: value, value: value }}
        options={options?.map((op) => ({
          label: op,
          value: op,
        }))}
      />
    </>
  );
}

export default memo(DropdownSelect);
