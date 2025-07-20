import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";
import { Heading, Icon } from "@/components/ui";
import { Activity, House } from "lucide-react-native";

type IProps = {
  profile: Me;
  activeIndex: number;
  onTabChange: (index: number) => void;
};
export default function ProfileTabHeaderSection(props: IProps) {
  const { profile, onTabChange, activeIndex } = props;
  // if (profile?.isBlocked) return null
  return (
    <View className=" bg-background-muted w-[80%] mx-auto rounded-xl my-4">
      <View className="flex-row h-12">
        {profileTabs.map(({ label, icon }, index) => (
          <Pressable
            key={label}
            onPress={() => {
              onTabChange(index);
            }}
            className={cn(
              "h-full flex-row gap-1 items-center rounded-xl w-1/2 justify-center mt-0.5",
              activeIndex === index ? `bg-primary` : `border-transparent`
            )}
          >
            <Icon
              as={icon}
              className={cn(activeIndex === index ? `text-white` : ` `)}
            />
            <Heading
              className={cn(" text-sm", activeIndex === index && "text-white")}
            >
              {label}
            </Heading>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export const profileTabs = [
  {
    label: "Properties",
    icon: House,
    key: "properties",
  },
  {
    label: "Activities",
    icon: Activity,
    key: "activities",
  },
];
