import MultiSelectOptionBottomSheet from "@/components/shared/MultiSelectOptionBottomSheet";
import { ChevronDownIcon, Icon, Text } from "@/components/ui";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react-native";
import { memo, ReactNode, useState } from "react";
import { TouchableOpacity } from "react-native";

function DropdownSelect({
  value,
  onChange,
  options,
  className,
  format,
  icon,
  multiple = false,
  placeholder,
  Trigger,
  showSearch,
}: {
  value?: string | string[];
  onChange: (val: string | string[]) => void;
  options: string[];
  className?: string;
  format?: boolean;
  icon?: LucideIcon;
  multiple?: boolean;
  showSearch?: boolean;
  placeholder?: string;
  Trigger?: ReactNode;
}) {
  const [show, setShow] = useState(false);

  const displayValue = Array.isArray(value)
    ? value.length > 0
      ? value.join(", ")
      : placeholder || "Select"
    : value || placeholder || "Select";

  return (
    <>
      {Trigger ? (
        <TouchableOpacity onPress={() => setShow(true)} className={className}>
          {Trigger}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setShow(true)}
          className={cn(
            "flex-row justify-between p-4 rounded-2xl border border-outline items-center gap-2",
            !icon && "flex-1",
            className
          )}
        >
          {!icon && <Text>{displayValue}</Text>}
          <Icon size="xl" as={icon || ChevronDownIcon} />
        </TouchableOpacity>
      )}

      <MultiSelectOptionBottomSheet
        isOpen={show}
        format={format}
        showSearch={showSearch}
        multiple={multiple}
        onDismiss={() => setShow(false)}
        onChange={onChange}
        value={value}
        options={options.map((op) => ({
          label: op,
          value: op,
        }))}
      />
    </>
  );
}

export default memo(DropdownSelect);
