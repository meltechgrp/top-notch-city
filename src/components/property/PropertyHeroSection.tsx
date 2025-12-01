import { composeFullAddress, formatMoney } from "@/lib/utils";
import { Icon, Text, View } from "../ui";
import PropertyCarousel from "./PropertyCarousel";
import { MapPin } from "lucide-react-native";
import { PropertyTitle } from "./PropertyTitle";
import PropertyInteractions from "@/components/property/PropertyInteractions";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";

interface Props {
  property: Property;
  width: number;
}

export function PropertyHeroSection({ property, width }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className=" relative flex-1">
        <ProfileImageTrigger image={property?.media || []} index={0}>
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
        </ProfileImageTrigger>
        {property && (
          <View className=" absolute flex-row justify-between bottom-10 left-4 right-4 w-full px-1">
            <View className="gap-1 flex-1">
              <View className=" flex-row justify-between items-end">
                <PropertyTitle property={property} />
                <PropertyInteractions interaction={property.interaction} />
              </View>
              <View className="flex-row items-center gap-2">
                <Icon size="sm" as={MapPin} className="" />
                <Text className="text-sm text-white">
                  {composeFullAddress(property?.address)}
                </Text>
              </View>

              <Text className="text-white text-xl font-bold">
                {formatMoney(property.price, "NGN", 0)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
