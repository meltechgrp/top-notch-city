import { Pressable, ScrollView } from "react-native";
import { Badge, BadgeText, Text, View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CustomInput } from "@/components/custom/CustomInput";

type Props = {
  tab: string;
  tabs: {
    title: string;
    total: number;
  }[];
  search?: string;
  onSearch: (search: string) => void;
  onUpdate: (tab: string) => void;
};

export function UsersFilter({ tab, tabs, onSearch, onUpdate, search }: Props) {
  return (
    <View className="gap-5 mb-4">
      <View className="gap-4">
        <View>
          <CustomInput
            placeholder="Search by name, email or phone..."
            value={search}
            onUpdate={onSearch}
          />
        </View>
        <ScrollView
          horizontal
          snapToInterval={238 + 4}
          contentContainerClassName="gap-x-4 px-2 pr-10"
          pagingEnabled
          keyboardDismissMode="interactive"
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          className="flex-wrap gap-4"
        >
          {tabs?.map((item) => (
            <Pressable key={item.title} onPress={() => onUpdate(item.title)}>
              <Badge
                size="md"
                variant="solid"
                className={cn(
                  "flex-row border border-background-muted w-28 py-2.5 px-4 rounded-xl items-center justify-between",
                  tab == item.title && " border-primary"
                )}
                action="muted"
              >
                <BadgeText className="text-base font-medium capitalize">
                  {item.title}
                </BadgeText>
                <View className="ml-auto">
                  <Text size="sm" className="text-primary">
                    {item.total}
                  </Text>
                </View>
              </Badge>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View className="border-b h-px border-outline"></View>
    </View>
  );
}
