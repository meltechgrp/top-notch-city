import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";
import { Text } from "../ui";

type IProps = {
  profile: Me;
  activeTab: string;
  onTabChange: (index: number) => void;
  profileTabs: string[];
};
export default function ProfileTabHeaderSection(props: IProps) {
  const { profile, onTabChange, activeTab, profileTabs } = props;
  if (profile?.is_blocked_by_admin) return null;
  return (
    <View className="mx-4 p-1 flex-row my-3 bg-background-muted rounded-xl border border-outline-100">
      {profileTabs.map((label, index) => (
        <Pressable
          key={label}
          onPress={() => {
            onTabChange(index);
          }}
          className={cn(
            "h-10 flex-1 gap-1 justify-center px-4 rounded-xl items-center",
            activeTab.toLowerCase() === label.toLowerCase() && `bg-primary`
          )}
        >
          <Text
            className={cn(
              "text-typography/80",
              activeTab.toLowerCase() === label.toLowerCase() &&
                `text-white font-medium`
            )}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
