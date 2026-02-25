import { Badge, BadgeText, Icon, Pressable, Text, View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { of } from "rxjs";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";
import { ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Search } from "lucide-react-native";
import { buildListQuery } from "@/store/searchStore";

type Props = {
  tab?: string;
  all?: any;
  pending?: any;
  approved?: any;
  flagged?: any;
  rejected?: any;
  search?: string;
  agentId?: string;
  searchPlaceholder?: string;
  onSearch: (search: string) => void;
  onUpdate?: (tab: string) => void;
  showTabs?: boolean;
  className?: string;
  inputClassName?: string;
};

export function FilterComponent({
  tab,
  searchPlaceholder,
  all,
  pending,
  flagged,
  approved,
  rejected,
  onSearch,
  onUpdate,
  search,
  className,
  inputClassName,
  showTabs = true,
}: Props) {
  const tabs = {
    all: all,
    pending: pending,
    approved: approved,
    rejected: rejected,
    flagged: flagged,
  };
  return (
    <View className={cn("gap-3 mb-4", className)}>
      <View className="gap-2">
        <View className="flex-row gap-2 items-center h-12 border border-outline-100 px-2 py-1 rounded-xl bg-background-muted">
          <Icon as={Search} className="text-primary" />
          <TextInput
            className={cn(
              "rounded-xl text-typography placeholder:text-typography p-0  flex-1 ",
              inputClassName,
            )}
            value={search}
            placeholder={
              searchPlaceholder ?? "Search by name, email or phone..."
            }
            onChangeText={onSearch}
          />
        </View>
        {showTabs && (
          <ScrollView
            horizontal
            contentContainerClassName="gap-x-4 px-2 pr-10"
            keyboardDismissMode="interactive"
            snapToAlignment="center"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
          >
            {Object.entries(tabs)?.map(([key, val]) => (
              <Pressable key={key} onPress={() => onUpdate?.(key)}>
                <Badge
                  size="sm"
                  variant="solid"
                  className={cn(
                    "flex-row border border-background-muted gap-3 py-1.5 px-3 rounded-xl items-center justify-between",
                    tab == key && " border-primary",
                  )}
                  action="muted"
                >
                  <BadgeText className="text-base font-medium capitalize">
                    {key}
                  </BadgeText>
                  <View className="ml-auto">
                    <Text size="md" className="text-primary">
                      {val}
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
const enhance = withObservables(
  ["agentId", "filter", "showTabs"],
  ({ agentId, filter, showTabs }) => ({
    all: showTabs
      ? database
          .get("properties")
          .query(...buildListQuery({ filter, agentId }))
          .observeCount()
      : of(0),
    pending: showTabs
      ? database
          .get("properties")
          .query(
            ...buildListQuery({ filter, agentId }),
            Q.where("status", "pending"),
          )
          .observeCount()
      : of(0),
    approved: showTabs
      ? database
          .get("properties")
          .query(
            ...buildListQuery({ filter, agentId }),
            Q.where("status", "approved"),
          )
          .observeCount()
      : of(0),
    rejected: showTabs
      ? database
          .get("properties")
          .query(
            ...buildListQuery({ filter, agentId }),
            Q.where("status", "rejected"),
          )
          .observeCount()
      : of(0),
    flagged: showTabs
      ? database
          .get("properties")
          .query(
            ...buildListQuery({ filter, agentId }),
            Q.where("status", "flagged"),
          )
          .observeCount()
      : of(0),
  }),
);

export default enhance(FilterComponent);
