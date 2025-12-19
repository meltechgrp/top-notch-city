import { cn, generateTitle } from "@/lib/utils";
import { formatMoney } from "@/lib/utils";
import { Icon, Image, Pressable, Text, View } from "../ui";
import { useRouter } from "expo-router";
import { generateMediaUrl } from "@/lib/api";
import { memo } from "react";
import { PropertyBadge } from "@/components/property/PropertyBadge";
import { House, LandPlot } from "lucide-react-native";

type Props = {
  data: Property;
  className?: string;
};
function HorizontalListItem(props: Props) {
  const { data, className } = props;
  const { media, price, id, title, category, slug } = data;
  const router = useRouter();
  if (category == "Land") return null;
  return (
    <Pressable
      both
      onPress={() => {
        router.push({
          pathname: `/property/[propertyId]`,
          params: {
            propertyId: slug,
          },
        });
      }}
      className={cn(
        "relative flex-row h-[120px] bg-background-muted/80 rounded-xl p-2 gap-4 overflow-hidden active:scale-[0.95]",
        className
      )}
      style={{ borderRadius: 8 }}
    >
      <Image
        source={{ uri: generateMediaUrl(media[0]).uri }}
        className="h-full w-32 rounded-xl"
        style={{ width: 120, borderRadius: 8 }}
        alt={title}
      />
      <View className=" w-[135px] gap-2 justify-center">
        <View className="mb-2 gap-1">
          <PropertyBadge property={data} />
          <View className="flex-row gap-1 items-center">
            <Icon
              size={"sm"}
              as={data.category == "Land" ? LandPlot : House}
              className="text-white"
            />
            <Text
              numberOfLines={1}
              className={cn("text-sm text-white font-medium")}
            >
              {generateTitle(data)}
            </Text>
          </View>
        </View>
        <View className=" gap-1">
          <Text size="md" className="font-bold text-typography">
            {formatMoney(price, "NGN", 0)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default memo(HorizontalListItem);
