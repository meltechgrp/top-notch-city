import { cn } from "@/lib/utils";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "../ui";

type IProps = {
  profile: Me;
  activeIndex: number;
  onTabChange: (index: number) => void;
};
export default function ProfileTabHeaderSection(props: IProps) {
  const { profile, onTabChange, activeIndex } = props;
  // if (profile?.isBlocked) return null
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="my-4 w-full"
    >
      <View className="flex-row px-4 flex-1 gap-2">
        {profileTabs.map(({ label }, index) => (
          <Pressable
            key={label}
            onPress={() => {
              onTabChange(index);
            }}
            className={cn(
              "h-full flex-row gap-1 py-2 px-4 rounded-full items-center",
              activeIndex === index && `bg-primary/10`
            )}
          >
            <Text className={cn(activeIndex === index && `text-primary`)}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

export const profileTabs = [
  {
    label: "All",
    key: "all",
  },
  {
    label: "Properties",
    key: "houses",
  },
  {
    label: "Saved",
    key: "saved",
  },
  {
    label: "Reviews",
    key: "reviews",
  },
];
