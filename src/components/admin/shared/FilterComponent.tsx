import { Pressable, ScrollView } from "react-native";
import { Badge, BadgeText, Text, View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CustomInput } from "@/components/custom/CustomInput";

type Props = {
  tab?: string;
  tabs?: {
    title: string;
    total: number;
  }[];
  search?: string;
  searchPlaceholder?: string;
  onSearch: (search: string) => void;
  onUpdate?: (tab: string) => void;
  className?: string;
};

export function FilterComponent({
  tab,
  searchPlaceholder,
  tabs,
  onSearch,
  onUpdate,
  search,
  className,
}: Props) {
  return (
    <View className={cn("gap-3 mb-4", className)}>
      <View className="gap-4">
        <View>
          <CustomInput
            className="rounded-xl bg-background-muted px-2 h-11 "
            value={search}
            placeholder={
              searchPlaceholder ?? "Search by name, email or phone..."
            }
            onUpdate={onSearch}
          />
        </View>
        {tabs?.length && (
          <ScrollView
            horizontal
            snapToInterval={300 + 4}
            contentContainerClassName="gap-x-4 px-2 pr-10"
            pagingEnabled
            keyboardDismissMode="interactive"
            snapToAlignment="center"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            className="flex-wrap gap-4"
          >
            {tabs?.map((item) => (
              <Pressable
                key={item.title}
                onPress={() => onUpdate?.(item.title)}
              >
                <Badge
                  size="md"
                  variant="solid"
                  className={cn(
                    "flex-row border border-background-muted gap-4 py-2.5 px-4 rounded-xl items-center justify-between",
                    tab == item.title && " border-primary"
                  )}
                  action="muted"
                >
                  <BadgeText className="text-base font-medium capitalize">
                    {item.title}
                  </BadgeText>
                  <View className="ml-auto">
                    <Text size="md" className="text-primary">
                      {item.total}
                    </Text>
                  </View>
                </Badge>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
      <View className="border-b h-px border-outline"></View>
    </View>
  );
}
