import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils";
import { Image, Pressable, Text, View } from "../ui";
import { useRouter } from "expo-router";
import { generateMediaUrl } from "@/lib/api";
import { PropertyTitle } from "./PropertyTitle";

type Props = {
  data: Property;
  className?: string;
};
export default function HorizontalListItem(props: Props) {
  const { data, className } = props;
  const { media, price, id, title, amenities } = data;
  const router = useRouter();
  return (
    <Pressable
      both
      onPress={() => {
        router.push({
          pathname: `/property/[propertyId]`,
          params: {
            propertyId: id,
          },
        });
      }}
      className={cn(
        "relative flex-row h-[110px] bg-background-muted/80 rounded-xl p-2 gap-4 overflow-hidden active:scale-[0.95]",
        className
      )}
      style={{ borderRadius: 8 }}
    >
      <Image
        source={{ uri: generateMediaUrl(media[0]).uri }}
        className="h-full w-32 rounded-xl"
        style={{ width: 128, borderRadius: 8 }}
        alt={title}
      />
      <View className=" w-[120px] gap-1">
        <PropertyTitle property={data} smallView />
        <View className=" gap-1">
          <Text size="md" className="text-medium text-typography">
            {formatMoney(price, "NGN", 0)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
