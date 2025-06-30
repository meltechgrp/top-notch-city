import { cn, formatMoney } from "@/lib/utils";
import { Text, View } from "../ui";

interface Props {
  property: Property;
  className?: string
}

export function PropertyPrice({ property: { price }, className }: Props) {
  return (
    <View className={cn("flex-row items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-primary/80", className)}>
      <Text size={"xl"} className="text-white font-bold">
        {formatMoney(price, "NGN", 0)}
      </Text>
    </View>
  );
}
