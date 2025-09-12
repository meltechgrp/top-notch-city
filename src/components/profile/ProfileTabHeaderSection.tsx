import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";
import { Icon } from "../ui";
import { House, LandPlot } from "lucide-react-native";

type IProps = {
  profile: Me;
  activeIndex: number;
  onTabChange: (index: number) => void;
};
export default function ProfileTabHeaderSection(props: IProps) {
  const { profile, onTabChange, activeIndex } = props;
  // if (profile?.isBlocked) return null
  return (
    <View className="  w-[70%] mx-auto rounded-xl my-4">
      <View className="flex-row justify-between flex-1">
        {profileTabs.map(({ label, icon }, index) => (
          <Pressable
            key={label}
            onPress={() => {
              onTabChange(index);
            }}
            className={cn(
              "h-full flex-row gap-1 w-20 border-b border-background pb-1 items-center justify-center mt-0.5",
              activeIndex === index && `border-white`
            )}
          >
            <Icon
              size={"xl"}
              as={icon}
              className={cn(activeIndex === index ? `text-white` : ` `)}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export const profileTabs = [
  {
    label: "Houses",
    icon: House,
    key: "houses",
  },
  {
    label: "Lands",
    icon: LandPlot,
    key: "land",
  },
];
