import { composeFullAddress } from "@/lib/utils";
import { Icon, Text, View } from "../ui";
import PropertyCarousel from "./PropertyCarousel";
import { PropertyInteractions } from "./PropertyInteractions";
import { MapPin } from "lucide-react-native";
import { PropertyPrice } from "./PropertyPrice";
import { PropertyTitle } from "./PropertyTitle";

interface Props {
  property: Property;
  width: number;
}

export function PropertyHeroSection({ property, width }: Props) {
  return (
    <View className="flex-1">
      <View className=" relative">
        <PropertyCarousel
          width={width || 400}
          factor={1.15}
          withBackdrop={true}
          loop={false}
          media={property.media}
          pointerPosition={30}
        />
        <View className=" absolute flex-row justify-between bottom-16 left-4 right-4 w-full px-1">
          <View className="gap-2">
            <PropertyTitle property={property} />
            <PropertyPrice property={property} className="self-start" />
            <View className="flex-row items-center mt-1 gap-2">
              <Icon size="md" as={MapPin} className="text-primary" />
              <Text size="md" className=" text-white">
                {composeFullAddress(property?.address, true, "long")}
              </Text>
            </View>
          </View>
          <PropertyInteractions interaction={property.interaction} />
        </View>
      </View>
    </View>
  );
}
