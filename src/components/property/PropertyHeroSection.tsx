import { composeFullAddress } from "@/lib/utils";
import { Icon, Text, View } from "../ui";
import PropertyCarousel from "./PropertyCarousel";
import { MapPin } from "lucide-react-native";
import { PropertyPrice } from "./PropertyPrice";
import { PropertyTitle } from "./PropertyTitle";
import PropertyInteractions from "@/components/property/PropertyInteractions";

interface Props {
  property: Property | null;
  width: number;
}

export function PropertyHeroSection({ property, width }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className=" relative flex-1">
        <PropertyCarousel
          width={width || 400}
          factor={1}
          withBackdrop={true}
          loop={false}
          media={
            property?.media.filter((item) => item.media_type == "IMAGE") || []
          }
          pointerPosition={40}
        />
        {property && (
          <View className=" absolute flex-row justify-between bottom-16 left-4 right-4 w-full px-1">
            <View className="gap-2 flex-1">
              <PropertyTitle property={property} />
              <PropertyPrice property={property} className="self-start" />
              <View className="flex-row items-center mt-1 gap-2">
                <Icon size="sm" as={MapPin} className="text-primary" />
                <Text size="sm" className=" text-white">
                  {composeFullAddress(property?.address, true, "long")}
                </Text>
              </View>
            </View>
            <PropertyInteractions interaction={property.interaction} />
          </View>
        )}
      </View>
    </View>
  );
}
